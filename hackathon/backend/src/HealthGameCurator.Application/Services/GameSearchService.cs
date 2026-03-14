using HealthGameCurator.Application.DTOs;
using HealthGameCurator.Application.Interfaces;
using HealthGameCurator.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace HealthGameCurator.Application.Services;

/// <summary>
/// 게임 검색 서비스 - EF Core Contains 기반 다중 필드 검색
/// </summary>
public class GameSearchService : IGameSearchService
{
    private readonly IGameRepository _gameRepository;
    private readonly ILogger<GameSearchService> _logger;

    public GameSearchService(
        IGameRepository gameRepository,
        ILogger<GameSearchService> logger)
    {
        _gameRepository = gameRepository;
        _logger = logger;
    }

    public async Task<List<SearchResultDto>> SearchGamesAsync(string query)
    {
        // 빈 키워드 또는 1글자 이하는 빈 배열 반환
        if (string.IsNullOrWhiteSpace(query) || query.Trim().Length <= 1)
            return [];

        var trimmedQuery = query.Trim();
        _logger.LogInformation("게임 검색 요청: {Query}", trimmedQuery);

        var games = await _gameRepository.SearchGamesAsync(trimmedQuery);

        return games
            .Select(g => new SearchResultDto(
                MapToDto(g),
                GetMatchedFields(g, trimmedQuery),
                trimmedQuery
            ))
            .ToList();
    }

    /// <summary>
    /// 어떤 필드가 매칭되었는지 판별 (하이라이팅용)
    /// </summary>
    private static List<string> GetMatchedFields(Game game, string query)
    {
        var fields = new List<string>();

        if (game.Name.Contains(query, StringComparison.OrdinalIgnoreCase))
            fields.Add("name");

        if (game.Category.Contains(query, StringComparison.OrdinalIgnoreCase))
            fields.Add("category");

        if (game.HealthTags.Any(t => t.Tag.Contains(query, StringComparison.OrdinalIgnoreCase)))
            fields.Add("tag");

        return fields;
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
