using HealthGameCurator.Application.Interfaces;
using HealthGameCurator.Application.Services;
using HealthGameCurator.Domain.Entities;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace HealthGameCurator.Tests.Services;

public class GameSearchServiceTests
{
    private readonly Mock<IGameRepository> _mockRepository;
    private readonly Mock<ILogger<GameSearchService>> _mockLogger;
    private readonly GameSearchService _sut;

    public GameSearchServiceTests()
    {
        _mockRepository = new Mock<IGameRepository>();
        _mockLogger = new Mock<ILogger<GameSearchService>>();
        _sut = new GameSearchService(_mockRepository.Object, _mockLogger.Object);
    }

    private static List<Game> CreateSampleGames() =>
    [
        new()
        {
            Id = 1,
            Name = "Zombies, Run!",
            Category = "달리기",
            Description = "좀비를 피해 달리는 게임",
            Developer = "Six to Start",
            HealthTags = new List<HealthTag>
            {
                new() { Tag = "#심폐기능", Confidence = 0.9 }
            }
        },
        new()
        {
            Id = 2,
            Name = "Nike Run Club",
            Category = "달리기",
            Description = "나이키 러닝 앱",
            Developer = "Nike",
            HealthTags = new List<HealthTag>
            {
                new() { Tag = "#근력강화", Confidence = 0.8 }
            }
        },
        new()
        {
            Id = 3,
            Name = "Calm",
            Category = "명상/스트레스 해소",
            Description = "명상 앱",
            Developer = "Calm.com",
            HealthTags = new List<HealthTag>
            {
                new() { Tag = "#스트레스해소", Confidence = 0.95 }
            }
        }
    ];

    [Fact]
    public async Task 게임명으로_검색하면_매칭된_게임이_반환된다()
    {
        // Arrange
        var games = CreateSampleGames();
        _mockRepository.Setup(r => r.SearchGamesAsync("Zombies")).ReturnsAsync([games[0]]);

        // Act
        var result = await _sut.SearchGamesAsync("Zombies");

        // Assert
        Assert.Single(result);
        Assert.Equal(1, result[0].Game.Id);
        Assert.Contains("name", result[0].MatchedFields);
    }

    [Fact]
    public async Task 카테고리로_검색하면_매칭된_게임이_반환된다()
    {
        // Arrange
        var games = CreateSampleGames();
        _mockRepository.Setup(r => r.SearchGamesAsync("달리기")).ReturnsAsync([games[0], games[1]]);

        // Act
        var result = await _sut.SearchGamesAsync("달리기");

        // Assert
        Assert.Equal(2, result.Count);
        Assert.All(result, r => Assert.Contains("category", r.MatchedFields));
    }

    [Fact]
    public async Task 태그명으로_검색하면_매칭된_게임이_반환된다()
    {
        // Arrange
        var games = CreateSampleGames();
        _mockRepository.Setup(r => r.SearchGamesAsync("심폐기능")).ReturnsAsync([games[0]]);

        // Act
        var result = await _sut.SearchGamesAsync("심폐기능");

        // Assert
        Assert.Single(result);
        Assert.Contains("tag", result[0].MatchedFields);
    }

    [Fact]
    public async Task 존재하지않는_키워드로_검색하면_빈_배열이_반환된다()
    {
        // Arrange
        _mockRepository.Setup(r => r.SearchGamesAsync("존재하지않는게임xyz")).ReturnsAsync([]);

        // Act
        var result = await _sut.SearchGamesAsync("존재하지않는게임xyz");

        // Assert
        Assert.Empty(result);
    }

    [Fact]
    public async Task 빈_키워드로_검색하면_빈_배열이_반환된다()
    {
        // Act
        var emptyResult = await _sut.SearchGamesAsync("");
        var spaceResult = await _sut.SearchGamesAsync("  ");
        var oneCharResult = await _sut.SearchGamesAsync("a");

        // Assert
        Assert.Empty(emptyResult);
        Assert.Empty(spaceResult);
        Assert.Empty(oneCharResult);

        // Repository는 호출되지 않아야 함
        _mockRepository.Verify(r => r.SearchGamesAsync(It.IsAny<string>()), Times.Never);
    }

    [Fact]
    public async Task 검색결과에_매칭필드_정보가_포함된다()
    {
        // Arrange - 게임명과 카테고리 모두 "달리기"를 포함하는 게임
        var game = new Game
        {
            Id = 1,
            Name = "달리기 챔피언",
            Category = "달리기",
            Description = "달리기 게임",
            Developer = "Test",
            HealthTags = new List<HealthTag>()
        };
        _mockRepository.Setup(r => r.SearchGamesAsync("달리기")).ReturnsAsync([game]);

        // Act
        var result = await _sut.SearchGamesAsync("달리기");

        // Assert
        Assert.Single(result);
        var item = result[0];
        Assert.Contains("name", item.MatchedFields);
        Assert.Contains("category", item.MatchedFields);
        Assert.Equal("달리기", item.MatchedKeyword);
    }
}
