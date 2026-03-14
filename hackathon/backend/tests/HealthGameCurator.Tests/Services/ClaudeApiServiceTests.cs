using HealthGameCurator.Application.DTOs;
using HealthGameCurator.Domain.Enums;
using HealthGameCurator.Infrastructure.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace HealthGameCurator.Tests.Services;

public class ClaudeApiServiceTests
{
    private readonly Mock<IConfiguration> _mockConfig;
    private readonly Mock<ILogger<ClaudeApiService>> _mockLogger;

    public ClaudeApiServiceTests()
    {
        _mockConfig = new Mock<IConfiguration>();
        _mockLogger = new Mock<ILogger<ClaudeApiService>>();
    }

    [Fact]
    public async Task API_키_없을_때_Mock_결과_반환()
    {
        // Arrange
        _mockConfig.Setup(c => c["ClaudeApi:ApiKey"]).Returns((string?)null);

        var httpClient = new HttpClient();
        var sut = new ClaudeApiService(httpClient, _mockConfig.Object, _mockLogger.Object);

        var request = new AiAnalysisRequest("테스트 달리기 게임", "달리기 게임입니다", "달리기", "테스트 개발사");

        // Act
        var result = await sut.AnalyzeGameHealthTagsAsync(request);

        // Assert
        Assert.True(result.IsSuccess);
        Assert.NotEmpty(result.Tags);
        // 달리기 카테고리는 심폐기능 태그 포함
        Assert.Contains(result.Tags, t => t.Tag == HealthTagType.Cardio);
    }

    [Fact]
    public async Task API_키_예제_값일_때_Mock_결과_반환()
    {
        // Arrange
        _mockConfig.Setup(c => c["ClaudeApi:ApiKey"]).Returns("YOUR_CLAUDE_API_KEY_HERE");

        var httpClient = new HttpClient();
        var sut = new ClaudeApiService(httpClient, _mockConfig.Object, _mockLogger.Object);

        var request = new AiAnalysisRequest("명상 앱", "마음챙김 명상 앱", "명상/스트레스 해소", "명상 개발사");

        // Act
        var result = await sut.AnalyzeGameHealthTagsAsync(request);

        // Assert
        Assert.True(result.IsSuccess);
        Assert.NotEmpty(result.Tags);
        // 명상 카테고리는 스트레스해소 태그 포함
        Assert.Contains(result.Tags, t => t.Tag == HealthTagType.StressRelief);
    }

    [Fact]
    public async Task Mock_결과_Confidence_범위_유효성_확인()
    {
        // Arrange
        _mockConfig.Setup(c => c["ClaudeApi:ApiKey"]).Returns((string?)null);

        var httpClient = new HttpClient();
        var sut = new ClaudeApiService(httpClient, _mockConfig.Object, _mockLogger.Object);

        var categories = new[] { "달리기", "피트니스", "명상/스트레스 해소", "인지/두뇌훈련", "반응훈련", "댄스/리듬", "밸런스", "팔 운동", "기타" };

        foreach (var category in categories)
        {
            var request = new AiAnalysisRequest("테스트", "설명", category, "개발사");

            // Act
            var result = await sut.AnalyzeGameHealthTagsAsync(request);

            // Assert
            Assert.True(result.IsSuccess);
            foreach (var tag in result.Tags)
            {
                Assert.InRange(tag.Confidence, 0.0, 1.0);
                Assert.Contains(tag.Tag, HealthTagType.AllTags);
            }
        }
    }
}
