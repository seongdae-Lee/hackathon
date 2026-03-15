using HealthGameCurator.Application.DTOs;
using HealthGameCurator.Application.Interfaces;
using HealthGameCurator.Domain.Entities;
using HealthGameCurator.Domain.Enums;
using Microsoft.Extensions.Logging;

namespace HealthGameCurator.Application.Services;

/// <summary>
/// 건강 목표 기반 맞춤 추천 서비스
/// HealthTag 기반 필터링 + Claude AI 추천 이유 생성
/// </summary>
public class HealthGoalRecommendService : IHealthGoalRecommendService
{
    private readonly IGameRepository _gameRepository;
    private readonly IClaudeApiService _claudeApiService;
    private readonly ILogger<HealthGoalRecommendService> _logger;

    public HealthGoalRecommendService(
        IGameRepository gameRepository,
        IClaudeApiService claudeApiService,
        ILogger<HealthGoalRecommendService> logger)
    {
        _gameRepository = gameRepository;
        _claudeApiService = claudeApiService;
        _logger = logger;
    }

    public async Task<RecommendResponse> RecommendGamesAsync(RecommendRequest request)
    {
        // 유효한 목표만 필터링 (비어있거나 50자 초과 또는 HealthTagType에 없는 값 제거)
        var validGoals = request.HealthGoals
            .Where(g => !string.IsNullOrWhiteSpace(g))
            .Select(g => g.Trim())
            .Where(g => g.Length <= 50 && HealthTagType.AllTags.Contains("#" + g))
            .Distinct()
            .ToList();

        _logger.LogInformation("맞춤 추천 요청 - 목표: {Goals}", string.Join(", ", validGoals));

        if (validGoals.Count == 0)
        {
            return new RecommendResponse(request.HealthGoals, []);
        }

        // # 접두사 붙인 태그 목록 (예: "심폐기능" → "#심폐기능")
        var targetTags = validGoals.Select(g => "#" + g).ToList();

        // 해당 태그를 보유한 게임 조회 (OR 조건)
        var games = await _gameRepository.GetGamesByTagsAsync(targetTags);

        if (games.Count == 0)
        {
            return new RecommendResponse(validGoals, []);
        }

        // 각 게임에 대해 매칭 점수 계산 + 추천 이유 생성
        var resultTasks = games.Select(async game =>
        {
            var matchScore = CalculateMatchScore(game, targetTags);
            var reason = await _claudeApiService.GenerateRecommendReasonAsync(
                game.Name, game.Description, game.Category, validGoals);

            return new RecommendResultDto(MapToDto(game), matchScore, reason);
        });

        var results = await Task.WhenAll(resultTasks);

        // 매칭 점수 내림차순 정렬
        var sortedResults = results
            .OrderByDescending(r => r.MatchScore)
            .ToList();

        return new RecommendResponse(validGoals, sortedResults);
    }

    /// <summary>
    /// 매칭 점수 = 요청 목표 중 게임이 보유한 태그 수 / 전체 요청 목표 수
    /// Confidence 가중치 반영
    /// </summary>
    private static double CalculateMatchScore(Game game, List<string> targetTags)
    {
        if (targetTags.Count == 0) return 0;

        var matchedConfidenceSum = game.HealthTags
            .Where(t => targetTags.Contains(t.Tag))
            .Sum(t => t.Confidence);

        return matchedConfidenceSum / targetTags.Count;
    }

    private static GameDto MapToDto(Game game) => new(
        game.Id,
        game.Name,
        game.Description,
        game.Developer,
        game.IconUrl,
        game.Rating,
        game.DownloadCount,
        game.Category,
        game.PlayStoreUrl,
        game.AppStoreUrl,
        game.CreatedAt,
        game.HealthTags.Select(t => new HealthTagDto(
            t.Id,
            t.Tag,
            t.Confidence,
            t.AiDescription,
            t.IsAiAnalyzed
        )).ToList()
    );
}
