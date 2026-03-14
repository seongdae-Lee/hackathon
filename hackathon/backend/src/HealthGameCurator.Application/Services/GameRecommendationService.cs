using HealthGameCurator.Application.DTOs;
using HealthGameCurator.Application.Interfaces;
using HealthGameCurator.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace HealthGameCurator.Application.Services;

/// <summary>
/// 유사 게임 추천 서비스 - Confidence 가중 태그 유사도 기반
/// AI 분석 완료 게임을 우선 추천
/// </summary>
public class GameRecommendationService : IGameRecommendationService
{
    private readonly IGameRepository _gameRepository;
    private readonly ILogger<GameRecommendationService> _logger;

    public GameRecommendationService(
        IGameRepository gameRepository,
        ILogger<GameRecommendationService> logger)
    {
        _gameRepository = gameRepository;
        _logger = logger;
    }

    public async Task<List<GameDto>> GetSimilarGamesAsync(int gameId, int count = 4)
    {
        var currentGame = await _gameRepository.GetGameByIdAsync(gameId);
        if (currentGame is null)
        {
            _logger.LogWarning("유사 게임 조회: 게임 {GameId}를 찾을 수 없습니다.", gameId);
            return [];
        }

        // 모든 게임 조회 (현재 게임 제외)
        var (allGames, _) = await _gameRepository.GetGamesAsync(null, "popular", 1, 200);
        var candidates = allGames.Where(g => g.Id != gameId).ToList();

        if (candidates.Count == 0)
            return [];

        // 현재 게임 태그 (Confidence 포함)
        var currentTags = currentGame.HealthTags
            .ToDictionary(t => t.Tag, t => t.Confidence);

        if (currentTags.Count == 0)
        {
            // 태그 없으면 같은 카테고리의 게임 반환 (평점 순)
            return candidates
                .Where(g => g.Category == currentGame.Category)
                .OrderByDescending(g => g.Rating)
                .Take(count)
                .Select(MapToDto)
                .ToList();
        }

        // Confidence 가중치 유사도 계산
        var scored = candidates
            .Select(g => new
            {
                Game = g,
                Score = CalculateSimilarityScore(currentTags, g.HealthTags.ToList()),
                IsAiAnalyzed = g.HealthTags.Any(t => t.IsAiAnalyzed),
            })
            .Where(x => x.Score > 0)
            .OrderByDescending(x => x.IsAiAnalyzed)    // AI 분석 완료 게임 우선
            .ThenByDescending(x => x.Score)              // 유사도 높은 순
            .Take(count)
            .ToList();

        // 유사 게임이 부족하면 같은 카테고리로 보충
        if (scored.Count < count)
        {
            var existing = scored.Select(x => x.Game.Id).ToHashSet();
            var fallback = candidates
                .Where(g => !existing.Contains(g.Id) && g.Category == currentGame.Category)
                .OrderByDescending(g => g.Rating)
                .Take(count - scored.Count)
                .Select(g => new { Game = g, Score = 0.0, IsAiAnalyzed = false });

            return scored.Concat(fallback).Select(x => MapToDto(x.Game)).ToList();
        }

        return scored.Select(x => MapToDto(x.Game)).ToList();
    }

    /// <summary>
    /// 유사도 = 공통 태그의 Confidence 합계 / 현재 게임 태그 수
    /// </summary>
    private static double CalculateSimilarityScore(
        Dictionary<string, double> currentTags,
        List<HealthTag> candidateTags)
    {
        if (currentTags.Count == 0) return 0;

        var weightedMatch = candidateTags
            .Where(t => currentTags.ContainsKey(t.Tag))
            .Sum(t => (currentTags[t.Tag] + t.Confidence) / 2.0);

        return weightedMatch / currentTags.Count;
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
