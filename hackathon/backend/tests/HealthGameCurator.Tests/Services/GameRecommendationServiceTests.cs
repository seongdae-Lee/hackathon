using HealthGameCurator.Application.Interfaces;
using HealthGameCurator.Application.Services;
using HealthGameCurator.Domain.Entities;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace HealthGameCurator.Tests.Services;

public class GameRecommendationServiceTests
{
    private readonly Mock<IGameRepository> _mockRepository;
    private readonly Mock<ILogger<GameRecommendationService>> _mockLogger;
    private readonly GameRecommendationService _sut;

    public GameRecommendationServiceTests()
    {
        _mockRepository = new Mock<IGameRepository>();
        _mockLogger = new Mock<ILogger<GameRecommendationService>>();
        _sut = new GameRecommendationService(_mockRepository.Object, _mockLogger.Object);
    }

    [Fact]
    public async Task 유사_게임_공통_태그_높은_순으로_정렬()
    {
        // Arrange
        var currentGame = new Game
        {
            Id = 1,
            Name = "현재 게임",
            Category = "달리기",
            HealthTags = new List<HealthTag>
            {
                new() { Tag = "#심폐기능", Confidence = 0.9 },
                new() { Tag = "#스트레스해소", Confidence = 0.7 },
            }
        };

        var allGames = new List<Game>
        {
            currentGame,
            new()
            {
                Id = 2,
                Name = "심폐 강화 게임",
                Category = "달리기",
                HealthTags = new List<HealthTag>
                {
                    new() { Tag = "#심폐기능", Confidence = 0.85, IsAiAnalyzed = true },
                    new() { Tag = "#스트레스해소", Confidence = 0.65, IsAiAnalyzed = true },
                }
            },
            new()
            {
                Id = 3,
                Name = "부분 유사 게임",
                Category = "피트니스",
                HealthTags = new List<HealthTag>
                {
                    new() { Tag = "#심폐기능", Confidence = 0.70 },
                }
            },
        };

        _mockRepository.Setup(r => r.GetGameByIdAsync(1)).ReturnsAsync(currentGame);
        _mockRepository.Setup(r => r.GetGamesAsync(null, "popular", 1, 200))
            .ReturnsAsync((allGames, 3));

        // Act
        var result = await _sut.GetSimilarGamesAsync(1, 4);

        // Assert
        Assert.NotEmpty(result);
        // 2번 게임이 더 많은 공통 태그를 가지므로 먼저 나와야 함
        Assert.Equal(2, result[0].Id);
    }

    [Fact]
    public async Task 존재하지_않는_게임_빈_목록_반환()
    {
        // Arrange
        _mockRepository.Setup(r => r.GetGameByIdAsync(999)).ReturnsAsync((Game?)null);

        // Act
        var result = await _sut.GetSimilarGamesAsync(999);

        // Assert
        Assert.Empty(result);
    }

    [Fact]
    public async Task 태그_없는_게임_같은_카테고리_반환()
    {
        // Arrange
        var currentGame = new Game
        {
            Id = 1,
            Name = "태그 없는 게임",
            Category = "달리기",
            HealthTags = new List<HealthTag>()
        };

        var allGames = new List<Game>
        {
            currentGame,
            new()
            {
                Id = 2,
                Name = "같은 카테고리 게임",
                Category = "달리기",
                Rating = 4.5,
                HealthTags = new List<HealthTag>()
            },
            new()
            {
                Id = 3,
                Name = "다른 카테고리 게임",
                Category = "피트니스",
                Rating = 4.8,
                HealthTags = new List<HealthTag>()
            },
        };

        _mockRepository.Setup(r => r.GetGameByIdAsync(1)).ReturnsAsync(currentGame);
        _mockRepository.Setup(r => r.GetGamesAsync(null, "popular", 1, 200))
            .ReturnsAsync((allGames, 3));

        // Act
        var result = await _sut.GetSimilarGamesAsync(1, 4);

        // Assert
        Assert.NotEmpty(result);
        // 태그 없으면 같은 카테고리만 반환
        Assert.All(result, g => Assert.Equal("달리기", g.Category));
    }

    [Fact]
    public async Task AI_분석_완료_게임_우선_추천()
    {
        // Arrange
        var currentGame = new Game
        {
            Id = 1,
            Name = "현재 게임",
            Category = "달리기",
            HealthTags = new List<HealthTag>
            {
                new() { Tag = "#심폐기능", Confidence = 0.9 },
            }
        };

        var allGames = new List<Game>
        {
            currentGame,
            new()
            {
                Id = 2,
                Name = "AI 분석 미완료 게임",
                Category = "달리기",
                HealthTags = new List<HealthTag>
                {
                    new() { Tag = "#심폐기능", Confidence = 0.9, IsAiAnalyzed = false },
                }
            },
            new()
            {
                Id = 3,
                Name = "AI 분석 완료 게임",
                Category = "피트니스",
                HealthTags = new List<HealthTag>
                {
                    new() { Tag = "#심폐기능", Confidence = 0.85, IsAiAnalyzed = true },
                }
            },
        };

        _mockRepository.Setup(r => r.GetGameByIdAsync(1)).ReturnsAsync(currentGame);
        _mockRepository.Setup(r => r.GetGamesAsync(null, "popular", 1, 200))
            .ReturnsAsync((allGames, 3));

        // Act
        var result = await _sut.GetSimilarGamesAsync(1, 4);

        // Assert
        Assert.NotEmpty(result);
        // AI 분석 완료 게임(Id=3)이 먼저 나와야 함
        Assert.Equal(3, result[0].Id);
    }
}
