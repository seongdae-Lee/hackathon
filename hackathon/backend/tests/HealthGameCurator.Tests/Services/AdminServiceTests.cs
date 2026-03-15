using FluentValidation;
using HealthGameCurator.Application.DTOs;
using HealthGameCurator.Application.Services;
using HealthGameCurator.Application.Validators;
using HealthGameCurator.Application.Interfaces;
using HealthGameCurator.Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace HealthGameCurator.Tests.Services;

public class AdminServiceTests
{
    private readonly Mock<IGameRepository> _mockRepository;
    private readonly Mock<ILogger<AdminService>> _mockLogger;
    private readonly AdminService _sut;
    private readonly CreateGameRequestValidator _createValidator;
    private readonly UpdateGameRequestValidator _updateValidator;

    public AdminServiceTests()
    {
        _mockRepository = new Mock<IGameRepository>();
        _mockLogger = new Mock<ILogger<AdminService>>();

        // JWT 설정 Mock - 테스트에서 LoginAsync를 호출하지 않으므로 최소 설정
        var mockConfig = new Mock<IConfiguration>();
        mockConfig.Setup(c => c["Jwt:Secret"]).Returns("TestSecret-MinLength32CharsRequired!!");
        mockConfig.Setup(c => c["Jwt:Issuer"]).Returns("HealthGameCurator");
        mockConfig.Setup(c => c["Jwt:Audience"]).Returns("HealthGameCuratorAdmin");
        mockConfig.Setup(c => c["Jwt:ExpiresInMinutes"]).Returns("480");
        mockConfig.Setup(c => c["AdminCredentials:Username"]).Returns("admin");
        mockConfig.Setup(c => c["AdminCredentials:PasswordHash"]).Returns("$2a$11$e9VgmT.KdEMB3WkSsjEbTexq6A1D8aFBj4Piw.lPhosTIwGm6KU9y");

        _sut = new AdminService(_mockRepository.Object, _mockLogger.Object, mockConfig.Object);
        _createValidator = new CreateGameRequestValidator();
        _updateValidator = new UpdateGameRequestValidator();
    }

    private static Game CreateSampleGame(int id = 1) => new()
    {
        Id = id,
        Name = "Zombies, Run!",
        Description = "좀비를 피해 달리는 게임",
        Developer = "Six to Start",
        Category = "달리기",
        Rating = 4.5,
        DownloadCount = 5000000,
        IconUrl = "https://example.com/icon.png",
        HealthTags = new List<HealthTag>
        {
            new() { Id = 1, Tag = "#심폐기능", Confidence = 0.9, IsAiAnalyzed = true, AiDescription = "심폐 기능 향상" }
        }
    };

    private static CreateGameRequest CreateValidRequest() => new(
        Name: "테스트 게임",
        Description: "테스트 설명",
        Developer: "테스트 개발사",
        Category: "달리기",
        Rating: 4.0,
        DownloadCount: 10000,
        IconUrl: "https://example.com/icon.png",
        PlayStoreUrl: null,
        AppStoreUrl: null
    );

    [Fact]
    public async Task 게임_추가시_DB에_저장되고_반환된다()
    {
        // Arrange
        var request = CreateValidRequest();
        var savedGame = new Game
        {
            Id = 10,
            Name = request.Name,
            Description = request.Description,
            Developer = request.Developer,
            Category = request.Category,
            Rating = request.Rating,
            DownloadCount = request.DownloadCount,
            IconUrl = request.IconUrl,
        };
        _mockRepository.Setup(r => r.AddAsync(It.IsAny<Game>())).ReturnsAsync(savedGame);

        // Act
        var result = await _sut.CreateGameAsync(request);

        // Assert
        Assert.Equal(10, result.Id);
        Assert.Equal(request.Name, result.Name);
        Assert.Equal(request.Category, result.Category);
        _mockRepository.Verify(r => r.AddAsync(It.IsAny<Game>()), Times.Once);
    }

    [Fact]
    public async Task 게임_수정시_기존_데이터가_업데이트된다()
    {
        // Arrange
        var existing = CreateSampleGame();
        var request = new UpdateGameRequest(
            Name: "수정된 게임명",
            Description: "수정된 설명",
            Developer: "수정된 개발사",
            Category: "달리기",
            Rating: 3.5,
            DownloadCount: 99999,
            IconUrl: "https://example.com/new-icon.png",
            PlayStoreUrl: null,
            AppStoreUrl: null
        );
        _mockRepository.Setup(r => r.GetGameByIdAsync(1)).ReturnsAsync(existing);
        _mockRepository.Setup(r => r.UpdateAsync(It.IsAny<Game>())).ReturnsAsync((Game g) => g);

        // Act
        var result = await _sut.UpdateGameAsync(1, request);

        // Assert
        Assert.Equal("수정된 게임명", result.Name);
        Assert.Equal(3.5, result.Rating);
        _mockRepository.Verify(r => r.UpdateAsync(It.IsAny<Game>()), Times.Once);
    }

    [Fact]
    public async Task 게임_삭제시_DB에서_제거된다()
    {
        // Arrange
        var existing = CreateSampleGame();
        _mockRepository.Setup(r => r.GetGameByIdAsync(1)).ReturnsAsync(existing);
        _mockRepository.Setup(r => r.DeleteAsync(1)).Returns(Task.CompletedTask);

        // Act
        await _sut.DeleteGameAsync(1);

        // Assert
        _mockRepository.Verify(r => r.DeleteAsync(1), Times.Once);
    }

    [Fact]
    public async Task 존재하지않는_게임_수정시_예외가_반환된다()
    {
        // Arrange
        _mockRepository.Setup(r => r.GetGameByIdAsync(999)).ReturnsAsync((Game?)null);

        var request = new UpdateGameRequest(
            Name: "수정 게임",
            Description: "설명",
            Developer: "개발사",
            Category: "달리기",
            Rating: 4.0,
            DownloadCount: 1000,
            IconUrl: "https://example.com/icon.png",
            PlayStoreUrl: null,
            AppStoreUrl: null
        );

        // Act & Assert
        await Assert.ThrowsAsync<KeyNotFoundException>(() => _sut.UpdateGameAsync(999, request));
    }

    [Fact]
    public async Task 존재하지않는_게임_삭제시_예외가_반환된다()
    {
        // Arrange
        _mockRepository.Setup(r => r.GetGameByIdAsync(999)).ReturnsAsync((Game?)null);

        // Act & Assert
        await Assert.ThrowsAsync<KeyNotFoundException>(() => _sut.DeleteGameAsync(999));
    }

    [Fact]
    public async Task 통계_조회시_전체_분석완료_미분석_수가_반환된다()
    {
        // Arrange
        _mockRepository.Setup(r => r.CountAllAsync()).ReturnsAsync(31);
        _mockRepository.Setup(r => r.CountAnalyzedAsync()).ReturnsAsync(21);

        // Act
        var stats = await _sut.GetStatsAsync();

        // Assert
        Assert.Equal(31, stats.TotalGames);
        Assert.Equal(21, stats.AnalyzedGames);
        Assert.Equal(10, stats.UnanalyzedGames);
    }

    [Fact]
    public void 게임명이_비어있으면_ValidationException이_반환된다()
    {
        // Arrange
        var request = CreateValidRequest() with { Name = "" };

        // Act
        var result = _createValidator.Validate(request);

        // Assert
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "Name");
    }

    [Fact]
    public void 평점이_5를_초과하면_ValidationException이_반환된다()
    {
        // Arrange
        var request = CreateValidRequest() with { Rating = 6.0 };

        // Act
        var result = _createValidator.Validate(request);

        // Assert
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "Rating");
    }
}
