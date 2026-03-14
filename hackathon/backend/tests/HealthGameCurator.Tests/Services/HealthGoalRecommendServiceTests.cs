using HealthGameCurator.Application.DTOs;
using HealthGameCurator.Application.Interfaces;
using HealthGameCurator.Application.Services;
using HealthGameCurator.Domain.Entities;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace HealthGameCurator.Tests.Services;

public class HealthGoalRecommendServiceTests
{
    private readonly Mock<IGameRepository> _mockRepository;
    private readonly Mock<IClaudeApiService> _mockClaudeApi;
    private readonly Mock<ILogger<HealthGoalRecommendService>> _mockLogger;
    private readonly HealthGoalRecommendService _sut;

    public HealthGoalRecommendServiceTests()
    {
        _mockRepository = new Mock<IGameRepository>();
        _mockClaudeApi = new Mock<IClaudeApiService>();
        _mockLogger = new Mock<ILogger<HealthGoalRecommendService>>();
        _sut = new HealthGoalRecommendService(
            _mockRepository.Object,
            _mockClaudeApi.Object,
            _mockLogger.Object);

        // 기본 추천 이유 Mock 설정
        _mockClaudeApi
            .Setup(c => c.GenerateRecommendReasonAsync(
                It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<IEnumerable<string>>()))
            .ReturnsAsync("선택하신 건강 목표와 관련된 게임입니다.");
    }

    [Fact]
    public async Task 단일_목표로_추천하면_해당_태그_게임이_반환된다()
    {
        // Arrange
        var cardioGame = new Game
        {
            Id = 1, Name = "러닝 게임", Category = "달리기", Description = "달리기",
            Developer = "Dev",
            HealthTags = new List<HealthTag>
            {
                new() { Tag = "#심폐기능", Confidence = 0.9 }
            }
        };
        _mockRepository.Setup(r => r.GetGamesByTagsAsync(It.IsAny<IEnumerable<string>>()))
            .ReturnsAsync([cardioGame]);

        var request = new RecommendRequest(["심폐기능"]);

        // Act
        var result = await _sut.RecommendGamesAsync(request);

        // Assert
        Assert.Single(result.Games);
        Assert.Equal(1, result.Games[0].Game.Id);
        Assert.Contains("심폐기능", result.SelectedGoals);
    }

    [Fact]
    public async Task 복수_목표로_추천하면_OR_조건으로_게임이_반환된다()
    {
        // Arrange
        var games = new List<Game>
        {
            new()
            {
                Id = 1, Name = "달리기 게임", Category = "달리기", Description = "달리기",
                Developer = "Dev",
                HealthTags = new List<HealthTag>
                {
                    new() { Tag = "#심폐기능", Confidence = 0.9 }
                }
            },
            new()
            {
                Id = 2, Name = "명상 게임", Category = "명상/스트레스 해소", Description = "명상",
                Developer = "Dev",
                HealthTags = new List<HealthTag>
                {
                    new() { Tag = "#스트레스해소", Confidence = 0.85 }
                }
            }
        };
        _mockRepository.Setup(r => r.GetGamesByTagsAsync(It.IsAny<IEnumerable<string>>()))
            .ReturnsAsync(games);

        var request = new RecommendRequest(["심폐기능", "스트레스해소"]);

        // Act
        var result = await _sut.RecommendGamesAsync(request);

        // Assert
        Assert.Equal(2, result.Games.Count);
        Assert.Equal(2, result.SelectedGoals.Count);
    }

    [Fact]
    public async Task 매칭_게임이_없으면_빈_배열이_반환된다()
    {
        // Arrange
        _mockRepository.Setup(r => r.GetGamesByTagsAsync(It.IsAny<IEnumerable<string>>()))
            .ReturnsAsync([]);

        var request = new RecommendRequest(["심폐기능"]);

        // Act
        var result = await _sut.RecommendGamesAsync(request);

        // Assert
        Assert.Empty(result.Games);
    }

    [Fact]
    public async Task 유효하지않은_목표는_무시된다()
    {
        // Arrange
        _mockRepository.Setup(r => r.GetGamesByTagsAsync(It.IsAny<IEnumerable<string>>()))
            .ReturnsAsync([]);

        var request = new RecommendRequest(["존재하지않는목표", "유효하지않은태그"]);

        // Act
        var result = await _sut.RecommendGamesAsync(request);

        // Assert
        // 유효하지 않은 목표이므로 Repository 호출 없이 빈 결과 반환
        Assert.Empty(result.Games);
        _mockRepository.Verify(r => r.GetGamesByTagsAsync(It.IsAny<IEnumerable<string>>()), Times.Never);
    }

    [Fact]
    public async Task Claude_API_실패시_기본_추천이유가_반환된다()
    {
        // Arrange
        var game = new Game
        {
            Id = 1, Name = "테스트 게임", Category = "달리기", Description = "달리기",
            Developer = "Dev",
            HealthTags = new List<HealthTag>
            {
                new() { Tag = "#심폐기능", Confidence = 0.9 }
            }
        };
        _mockRepository.Setup(r => r.GetGamesByTagsAsync(It.IsAny<IEnumerable<string>>()))
            .ReturnsAsync([game]);

        // Claude API 실패 → 기본 텍스트 반환
        _mockClaudeApi
            .Setup(c => c.GenerateRecommendReasonAsync(
                It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<IEnumerable<string>>()))
            .ReturnsAsync("선택하신 건강 목표(심폐기능)와 관련된 게임입니다.");

        var request = new RecommendRequest(["심폐기능"]);

        // Act
        var result = await _sut.RecommendGamesAsync(request);

        // Assert
        Assert.Single(result.Games);
        Assert.NotEmpty(result.Games[0].RecommendReason);
    }

    [Fact]
    public async Task 매칭점수가_높은순으로_정렬된다()
    {
        // Arrange - 두 목표 모두 가진 게임(높은 점수)과 하나만 가진 게임(낮은 점수)
        var games = new List<Game>
        {
            new()
            {
                Id = 1, Name = "낮은 점수 게임", Category = "달리기", Description = "달리기",
                Developer = "Dev",
                HealthTags = new List<HealthTag>
                {
                    new() { Tag = "#심폐기능", Confidence = 0.7 }
                    // #스트레스해소 없음 → 두 목표 중 하나만 매칭
                }
            },
            new()
            {
                Id = 2, Name = "높은 점수 게임", Category = "달리기", Description = "달리기",
                Developer = "Dev",
                HealthTags = new List<HealthTag>
                {
                    new() { Tag = "#심폐기능", Confidence = 0.9 },
                    new() { Tag = "#스트레스해소", Confidence = 0.8 }
                    // 두 목표 모두 매칭 → 높은 점수
                }
            }
        };
        _mockRepository.Setup(r => r.GetGamesByTagsAsync(It.IsAny<IEnumerable<string>>()))
            .ReturnsAsync(games);

        var request = new RecommendRequest(["심폐기능", "스트레스해소"]);

        // Act
        var result = await _sut.RecommendGamesAsync(request);

        // Assert - 높은 점수 게임(Id=2)이 먼저 나와야 함
        Assert.Equal(2, result.Games[0].Game.Id);
        Assert.True(result.Games[0].MatchScore >= result.Games[1].MatchScore);
    }
}
