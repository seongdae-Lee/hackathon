using HealthGameCurator.Infrastructure.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace HealthGameCurator.Tests.Services;

public class GameDataCollectorServiceTests
{
    [Fact]
    public void MockGameDataProvider_기본_게임_목록_반환()
    {
        // Act
        var games = MockGameDataProvider.GetMockGames();

        // Assert
        Assert.NotEmpty(games);
        Assert.All(games, g =>
        {
            Assert.NotEmpty(g.Name);
            Assert.NotEmpty(g.Description);
            Assert.NotEmpty(g.Category);
            Assert.InRange(g.Rating, 0.0, 5.0);
            Assert.True(g.DownloadCount >= 0);
        });
    }

    [Fact]
    public void MockGameDataProvider_모든_게임_필수_필드_유효()
    {
        // Act
        var games = MockGameDataProvider.GetMockGames();

        // Assert - 각 게임의 필수 필드 검증
        foreach (var game in games)
        {
            Assert.False(string.IsNullOrWhiteSpace(game.Name), $"게임명이 비어있습니다: {game.Name}");
            Assert.False(string.IsNullOrWhiteSpace(game.Developer), $"개발사가 비어있습니다: {game.Name}");
            Assert.False(string.IsNullOrWhiteSpace(game.Category), $"카테고리가 비어있습니다: {game.Name}");
        }
    }
}
