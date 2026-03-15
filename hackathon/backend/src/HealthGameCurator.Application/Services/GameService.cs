using HealthGameCurator.Application.DTOs;
using HealthGameCurator.Application.Interfaces;
using HealthGameCurator.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace HealthGameCurator.Application.Services;

/// <summary>
/// 게임 서비스 - 게임 목록/상세 조회 및 AI 분석 비즈니스 로직
/// </summary>
public class GameService : IGameService
{
    private readonly IGameRepository _gameRepository;
    private readonly IClaudeApiService _claudeApiService;
    private readonly ILogger<GameService> _logger;

    public GameService(
        IGameRepository gameRepository,
        IClaudeApiService claudeApiService,
        ILogger<GameService> logger)
    {
        _gameRepository = gameRepository;
        _claudeApiService = claudeApiService;
        _logger = logger;
    }

    public async Task<PagedResult<GameDto>> GetGamesAsync(GameListQuery query)
    {
        var (games, total) = await _gameRepository.GetGamesAsync(
            query.Category,
            query.Sort ?? "popular",
            query.Page,
            query.PageSize
        );

        var items = games.Select(MapToDto).ToList();
        return new PagedResult<GameDto>(items, total, query.Page, query.PageSize);
    }

    public async Task<GameDto?> GetGameByIdAsync(int id)
    {
        var game = await _gameRepository.GetGameByIdAsync(id);
        return game is null ? null : MapToDto(game);
    }

    public async Task<List<string>> GetCategoriesAsync()
    {
        return await _gameRepository.GetCategoriesAsync();
    }

    public async Task<List<GameDto>> GetSimilarGamesAsync(int gameId)
    {
        var games = await _gameRepository.GetSimilarGamesAsync(gameId);
        return games.Select(MapToDto).ToList();
    }

    /// <summary>
    /// 단일 게임 AI 분석 - forceReanalyze=false이면 이미 분석된 게임은 Skip (DB 캐싱)
    /// </summary>
    /// <param name="forceReanalyze">true이면 이미 분석된 게임도 강제 재분석 (관리자 재분석용)</param>
    public async Task<AnalyzeGameResponse> AnalyzeGameAsync(int gameId, bool forceReanalyze = false)
    {
        var game = await _gameRepository.GetGameByIdAsync(gameId);
        if (game is null)
            return new AnalyzeGameResponse(gameId, string.Empty, false, 0, "게임을 찾을 수 없습니다.");

        // 이미 AI 분석된 게임은 재분석 Skip (단, forceReanalyze=true이면 강제 재분석)
        if (!forceReanalyze && game.HealthTags.Any(t => t.IsAiAnalyzed))
        {
            _logger.LogInformation("게임 {GameName}은 이미 AI 분석되었습니다. 재분석 Skip.", game.Name);
            return new AnalyzeGameResponse(gameId, game.Name, true, 0, "이미 분석된 게임입니다.");
        }

        var request = new AiAnalysisRequest(game.Name, game.Description, game.Category, game.Developer);
        var result = await _claudeApiService.AnalyzeGameHealthTagsAsync(request);

        if (!result.IsSuccess || result.Tags.Count == 0)
        {
            _logger.LogWarning("게임 {GameName} AI 분석 실패: {Error}", game.Name, result.ErrorMessage);
            return new AnalyzeGameResponse(gameId, game.Name, false, 0, result.ErrorMessage);
        }

        // 기존 태그 제거 후 AI 분석 태그로 교체
        await _gameRepository.ReplaceHealthTagsAsync(gameId, result.Tags
            .Select(t => new HealthTag
            {
                GameId = gameId,
                Tag = t.Tag,
                Confidence = t.Confidence,
                AiDescription = t.Description,
                IsAiAnalyzed = true,
                CreatedAt = DateTime.UtcNow,
            })
            .ToList());

        _logger.LogInformation("게임 {GameName} AI 분석 완료 - 태그 {Count}개 저장", game.Name, result.Tags.Count);
        return new AnalyzeGameResponse(gameId, game.Name, true, result.Tags.Count);
    }

    /// <summary>
    /// 미분석 게임 전체 일괄 AI 분석
    /// </summary>
    public async Task<List<AnalyzeGameResponse>> AnalyzeAllGamesAsync()
    {
        var (allGames, _) = await _gameRepository.GetGamesAsync(null, "popular", 1, 200);
        var unanalyzed = allGames.Where(g => !g.HealthTags.Any(t => t.IsAiAnalyzed)).ToList();

        _logger.LogInformation("미분석 게임 {Count}개 일괄 분석 시작", unanalyzed.Count);

        var results = new List<AnalyzeGameResponse>();
        foreach (var game in unanalyzed)
        {
            var result = await AnalyzeGameAsync(game.Id);
            results.Add(result);
        }

        return results;
    }

    // Game 엔티티를 DTO로 변환
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
