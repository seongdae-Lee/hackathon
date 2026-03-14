using System.Net.Http.Json;
using System.Text.Json;
using HealthGameCurator.Application.DTOs;
using HealthGameCurator.Application.Interfaces;
using HealthGameCurator.Domain.Enums;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace HealthGameCurator.Infrastructure.Services;

/// <summary>
/// Claude API 서비스 - Anthropic Messages API 직접 호출 (HttpClient)
/// </summary>
public class ClaudeApiService : IClaudeApiService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<ClaudeApiService> _logger;

    private const string ApiUrl = "https://api.anthropic.com/v1/messages";
    private const string AnthropicVersion = "2023-06-01";

    public ClaudeApiService(
        HttpClient httpClient,
        IConfiguration configuration,
        ILogger<ClaudeApiService> logger)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<AiAnalysisResult> AnalyzeGameHealthTagsAsync(AiAnalysisRequest request)
    {
        var apiKey = _configuration["ClaudeApi:ApiKey"];

        // API 키가 없거나 예제 값이면 Mock 결과 반환 (Graceful degradation)
        if (string.IsNullOrEmpty(apiKey) || apiKey == "YOUR_CLAUDE_API_KEY_HERE")
        {
            _logger.LogWarning("Claude API 키가 설정되지 않았습니다. Mock 태그를 반환합니다.");
            return CreateMockResult(request);
        }

        try
        {
            var prompt = BuildAnalysisPrompt(request);
            var model = _configuration["ClaudeApi:Model"] ?? "claude-sonnet-4-6";

            var requestBody = new
            {
                model,
                max_tokens = 1024,
                messages = new[]
                {
                    new { role = "user", content = prompt }
                }
            };

            using var httpRequest = new HttpRequestMessage(HttpMethod.Post, ApiUrl);
            httpRequest.Headers.Add("x-api-key", apiKey);
            httpRequest.Headers.Add("anthropic-version", AnthropicVersion);
            httpRequest.Content = JsonContent.Create(requestBody);

            var response = await _httpClient.SendAsync(httpRequest);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            _logger.LogInformation("Claude API 응답 수신: {GameName}", request.GameName);
            return ParseClaudeResponse(content);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Claude API 호출 실패 - 게임: {GameName}", request.GameName);
            return new AiAnalysisResult(false, new List<AiTagResult>(), ex.Message);
        }
    }

    // 분석 프롬프트 생성
    private static string BuildAnalysisPrompt(AiAnalysisRequest request)
    {
        var availableTags = string.Join(", ", HealthTagType.AllTags);

        // JSON 예시는 보간 없이 별도 원시 문자열로 분리 (CS9006 방지)
        var jsonExample =
            """
            {
              "tags": [
                {
                  "tag": "태그명",
                  "confidence": 0.85,
                  "description": "이 게임이 해당 건강 효과를 제공하는 이유"
                }
              ]
            }
            """;

        return $"다음 게임의 건강 효과를 분석해주세요.\n" +
               $"게임명: {request.GameName}\n" +
               $"설명: {request.Description}\n" +
               $"카테고리: {request.Category}\n" +
               $"개발사: {request.Developer}\n\n" +
               $"다음 태그 중 해당되는 것을 선택하고 신뢰도(0.0~1.0)와 근거를 JSON으로 반환해주세요:\n" +
               $"사용 가능한 태그: {availableTags}\n\n" +
               "응답 형식 (JSON만 반환, 다른 텍스트 없이):\n" +
               jsonExample;
    }

    // Claude 응답 JSON 파싱
    private AiAnalysisResult ParseClaudeResponse(string responseJson)
    {
        try
        {
            using var doc = JsonDocument.Parse(responseJson);
            var textContent = doc.RootElement
                .GetProperty("content")[0]
                .GetProperty("text")
                .GetString() ?? string.Empty;

            // 마크다운 코드 블록 처리
            var jsonContent = textContent.Trim();
            if (jsonContent.StartsWith("```"))
            {
                var start = jsonContent.IndexOf('{');
                var end = jsonContent.LastIndexOf('}');
                if (start >= 0 && end > start)
                    jsonContent = jsonContent[start..(end + 1)];
            }

            using var tagDoc = JsonDocument.Parse(jsonContent);
            var tags = new List<AiTagResult>();

            foreach (var tagElement in tagDoc.RootElement.GetProperty("tags").EnumerateArray())
            {
                var tag = tagElement.GetProperty("tag").GetString() ?? string.Empty;
                var confidence = tagElement.GetProperty("confidence").GetDouble();
                var description = tagElement.GetProperty("description").GetString() ?? string.Empty;

                // 정의된 태그만 허용
                if (HealthTagType.AllTags.Contains(tag))
                    tags.Add(new AiTagResult(tag, Math.Clamp(confidence, 0.0, 1.0), description));
            }

            return new AiAnalysisResult(true, tags);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Claude 응답 파싱 실패");
            return new AiAnalysisResult(false, new List<AiTagResult>(), "응답 파싱 실패");
        }
    }

    public async Task<string> GenerateRecommendReasonAsync(
        string gameName,
        string description,
        string category,
        IEnumerable<string> selectedGoals)
    {
        var goals = string.Join(", ", selectedGoals);
        var apiKey = _configuration["ClaudeApi:ApiKey"];

        // API 키 없으면 기본 텍스트 반환
        if (string.IsNullOrEmpty(apiKey) || apiKey == "YOUR_CLAUDE_API_KEY_HERE")
        {
            _logger.LogWarning("Claude API 키 없음 - 기본 추천 이유 반환: {GameName}", gameName);
            return $"선택하신 건강 목표({goals})와 관련된 게임입니다.";
        }

        try
        {
            var prompt = $"다음 게임이 사용자가 선택한 건강 목표에 왜 좋은지 2~3문장으로 설명해주세요.\n" +
                         $"게임명: {gameName}\n" +
                         $"설명: {description}\n" +
                         $"카테고리: {category}\n" +
                         $"선택한 건강 목표: {goals}\n\n" +
                         "한국어로 친근하게 설명해주세요. 설명 텍스트만 반환하고 다른 내용은 포함하지 마세요.";

            var model = _configuration["ClaudeApi:Model"] ?? "claude-sonnet-4-6";
            var requestBody = new
            {
                model,
                max_tokens = 256,
                messages = new[] { new { role = "user", content = prompt } }
            };

            using var httpRequest = new HttpRequestMessage(HttpMethod.Post, ApiUrl);
            httpRequest.Headers.Add("x-api-key", apiKey);
            httpRequest.Headers.Add("anthropic-version", AnthropicVersion);
            httpRequest.Content = JsonContent.Create(requestBody);

            var response = await _httpClient.SendAsync(httpRequest);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(content);
            var text = doc.RootElement
                .GetProperty("content")[0]
                .GetProperty("text")
                .GetString()?.Trim() ?? string.Empty;

            return string.IsNullOrEmpty(text)
                ? $"선택하신 건강 목표({goals})와 관련된 게임입니다."
                : text;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "추천 이유 생성 실패 - 게임: {GameName}", gameName);
            return $"선택하신 건강 목표({goals})와 관련된 게임입니다.";
        }
    }

    // API 키 없을 때 카테고리 기반 Mock 결과 반환
    private static AiAnalysisResult CreateMockResult(AiAnalysisRequest request) =>
        new(true, request.Category switch
        {
            "달리기" =>
            [
                new(HealthTagType.Cardio, 0.90, "달리기 게임은 지속적인 유산소 운동으로 심폐 기능을 향상시킵니다."),
                new(HealthTagType.StressRelief, 0.65, "야외 달리기는 스트레스 해소에 효과적입니다."),
            ],
            "피트니스" =>
            [
                new(HealthTagType.Strength, 0.85, "피트니스 게임은 전신 근력 운동을 포함합니다."),
                new(HealthTagType.Cardio, 0.75, "고강도 피트니스 동작은 심폐 기능을 강화합니다."),
            ],
            "명상/스트레스 해소" =>
            [
                new(HealthTagType.StressRelief, 0.95, "명상 콘텐츠는 스트레스 호르몬을 낮추고 정신 건강을 개선합니다."),
                new(HealthTagType.Cognitive, 0.60, "마음챙김 훈련은 집중력을 향상시킵니다."),
            ],
            "인지/두뇌훈련" =>
            [
                new(HealthTagType.Cognitive, 0.90, "두뇌 훈련 게임은 기억력과 집중력을 향상시킵니다."),
                new(HealthTagType.ReactionTraining, 0.55, "빠른 판단이 필요한 퍼즐은 반응 속도를 개선합니다."),
            ],
            "반응훈련" =>
            [
                new(HealthTagType.ReactionTraining, 0.88, "반응 속도 훈련은 신경 반응 시간을 단축시킵니다."),
                new(HealthTagType.Cognitive, 0.65, "빠른 의사결정은 인지 기능을 향상시킵니다."),
            ],
            "댄스/리듬" =>
            [
                new(HealthTagType.Cardio, 0.80, "리듬에 맞춰 춤을 추면 유산소 운동 효과가 있습니다."),
                new(HealthTagType.StressRelief, 0.70, "음악과 댄스는 기분을 향상시키고 스트레스를 해소합니다."),
            ],
            "밸런스" =>
            [
                new(HealthTagType.Strength, 0.75, "균형 훈련은 코어 근육을 강화합니다."),
                new(HealthTagType.ReactionTraining, 0.65, "밸런스 유지는 신체 반응 능력을 향상시킵니다."),
            ],
            "팔 운동" =>
            [
                new(HealthTagType.Strength, 0.90, "상체 근력 운동은 팔과 어깨 근육을 강화합니다."),
                new(HealthTagType.Cardio, 0.55, "지속적인 팔 운동은 심폐 기능에도 도움이 됩니다."),
            ],
            _ =>
            [
                new(HealthTagType.Cognitive, 0.70, "게임 플레이는 인지 기능과 집중력 향상에 도움이 됩니다."),
            ],
        });
}
