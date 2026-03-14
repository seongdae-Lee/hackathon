using HealthGameCurator.Application.DTOs;
using HealthGameCurator.Application.Interfaces;
using HealthGameCurator.Application.Services;
using HealthGameCurator.Domain.Entities;
using Moq;
using Xunit;

namespace HealthGameCurator.Tests.Services;

public class GameServiceTests
{
    private readonly Mock<IGameRepository> _mockRepository;
    private readonly GameService _sut;

    public GameServiceTests()
    {
        _mockRepository = new Mock<IGameRepository>();
        _sut = new GameService(_mockRepository.Object);
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
    public async Task 유사_게임_조회_게임_목록_반환()
    {
        // Arrange
        var similarGames = new List<Game>
        {
            new() { Id = 2, Name = "유사 게임 1", Category = "달리기", HealthTags = new List<HealthTag>() },
            new() { Id = 3, Name = "유사 게임 2", Category = "달리기", HealthTags = new List<HealthTag>() },
        };
        _mockRepository.Setup(r => r.GetSimilarGamesAsync(1, 4))
            .ReturnsAsync(similarGames);

        // Act
        var result = await _sut.GetSimilarGamesAsync(1);

        // Assert
        Assert.Equal(2, result.Count);
        Assert.Equal("유사 게임 1", result[0].Name);
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
}
