using HealthGameCurator.Application.DTOs;
using HealthGameCurator.Application.Interfaces;
using HealthGameCurator.Application.Services;
using HealthGameCurator.Domain.Entities;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace HealthGameCurator.Tests.Services;

public class GameServiceTests
{
    private readonly Mock<IGameRepository> _mockRepository;
    private readonly Mock<IClaudeApiService> _mockClaudeApi;
    private readonly Mock<ILogger<GameService>> _mockLogger;
    private readonly GameService _sut;

    public GameServiceTests()
    {
        _mockRepository = new Mock<IGameRepository>();
        _mockClaudeApi = new Mock<IClaudeApiService>();
        _mockLogger = new Mock<ILogger<GameService>>();
        _sut = new GameService(_mockRepository.Object, _mockClaudeApi.Object, _mockLogger.Object);
    }

    [Fact]
    public async Task 게임_목록_조회_정상_반환()
    {
        // Arrange
        var games = new List<Game>
        {
            new() { Id = 1, Name = "테스트 게임 1", Category = "달리기", HealthTags = new List<HealthTag>() },
            new() { Id = 2, Name = "테스트 게임 2", Category = "피트니스", HealthTags = new List<HealthTag>() },
        };
        _mockRepository.Setup(r => r.GetGamesAsync(null, "popular", 1, 20))
            .ReturnsAsync((games, 2));

        // Act
        var result = await _sut.GetGamesAsync(new GameListQuery());

        // Assert
        Assert.Equal(2, result.Items.Count);
        Assert.Equal(2, result.Total);
        Assert.Equal("테스트 게임 1", result.Items[0].Name);
    }

    [Fact]
    public async Task 게임_상세_조회_존재하는_ID_게임_반환()
    {
        // Arrange
        var game = new Game
        {
            Id = 1,
            Name = "Zombies Run",
            Description = "달리기 게임",
            Category = "달리기",
            HealthTags = new List<HealthTag>
            {
                new() { Id = 1, Tag = "#심폐기능", Confidence = 0.95, AiDescription = "심폐 기능 향상", IsAiAnalyzed = false }
            }
        };
        _mockRepository.Setup(r => r.GetGameByIdAsync(1))
            .ReturnsAsync(game);

        // Act
        var result = await _sut.GetGameByIdAsync(1);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Zombies Run", result.Name);
        Assert.Single(result.HealthTags);
        Assert.Equal("#심폐기능", result.HealthTags[0].Tag);
    }

    [Fact]
    public async Task 게임_상세_조회_존재하지_않는_ID_null_반환()
    {
        // Arrange
        _mockRepository.Setup(r => r.GetGameByIdAsync(999))
            .ReturnsAsync((Game?)null);

        // Act
        var result = await _sut.GetGameByIdAsync(999);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task 카테고리_목록_조회_정상_반환()
    {
        // Arrange
        var categories = new List<string> { "달리기", "명상/스트레스 해소", "피트니스" };
        _mockRepository.Setup(r => r.GetCategoriesAsync())
            .ReturnsAsync(categories);

        // Act
        var result = await _sut.GetCategoriesAsync();

        // Assert
        Assert.Equal(3, result.Count);
        Assert.Contains("달리기", result);
    }

    [Fact]
    public async Task 게임_목록_카테고리_필터_적용_확인()
    {
        // Arrange
        var games = new List<Game>
        {
            new() { Id = 1, Name = "달리기 게임", Category = "달리기", HealthTags = new List<HealthTag>() }
        };
        _mockRepository.Setup(r => r.GetGamesAsync("달리기", "popular", 1, 20))
            .ReturnsAsync((games, 1));

        // Act
        var result = await _sut.GetGamesAsync(new GameListQuery(Category: "달리기"));

        // Assert
        Assert.Single(result.Items);
        Assert.Equal("달리기 게임", result.Items[0].Name);
        _mockRepository.Verify(r => r.GetGamesAsync("달리기", "popular", 1, 20), Times.Once);
    }

    [Fact]
    public async Task AI_분석_이미_분석된_게임_재분석_Skip()
    {
        // Arrange
        var game = new Game
        {
            Id = 1,
            Name = "테스트 게임",
            Category = "달리기",
            HealthTags = new List<HealthTag>
            {
                new() { Tag = "#심폐기능", IsAiAnalyzed = true }
            }
        };
        _mockRepository.Setup(r => r.GetGameByIdAsync(1)).ReturnsAsync(game);

        // Act
        var result = await _sut.AnalyzeGameAsync(1);

        // Assert
        Assert.True(result.IsAnalyzed);
        Assert.Equal(0, result.TagsUpdated);
        // Claude API는 호출되지 않아야 함
        _mockClaudeApi.Verify(c => c.AnalyzeGameHealthTagsAsync(It.IsAny<AiAnalysisRequest>()), Times.Never);
    }

    [Fact]
    public async Task AI_분석_미분석_게임_분석_후_태그_저장()
    {
        // Arrange
        var game = new Game
        {
            Id = 1,
            Name = "테스트 달리기 게임",
            Description = "달리기 게임입니다",
            Category = "달리기",
            Developer = "테스트 개발사",
            HealthTags = new List<HealthTag>()
        };
        _mockRepository.Setup(r => r.GetGameByIdAsync(1)).ReturnsAsync(game);

        var analysisResult = new AiAnalysisResult(true, new List<AiTagResult>
        {
            new("#심폐기능", 0.90, "심폐 기능 향상에 도움이 됩니다."),
        });
        _mockClaudeApi.Setup(c => c.AnalyzeGameHealthTagsAsync(It.IsAny<AiAnalysisRequest>()))
            .ReturnsAsync(analysisResult);
        _mockRepository.Setup(r => r.ReplaceHealthTagsAsync(1, It.IsAny<List<HealthTag>>()))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _sut.AnalyzeGameAsync(1);

        // Assert
        Assert.True(result.IsAnalyzed);
        Assert.Equal(1, result.TagsUpdated);
        _mockRepository.Verify(r => r.ReplaceHealthTagsAsync(1, It.IsAny<List<HealthTag>>()), Times.Once);
    }

    [Fact]
    public async Task AI_분석_존재하지_않는_게임_실패_반환()
    {
        // Arrange
        _mockRepository.Setup(r => r.GetGameByIdAsync(999)).ReturnsAsync((Game?)null);

        // Act
        var result = await _sut.AnalyzeGameAsync(999);

        // Assert
        Assert.False(result.IsAnalyzed);
        Assert.Contains("찾을 수 없습니다", result.Message);
    }
}
