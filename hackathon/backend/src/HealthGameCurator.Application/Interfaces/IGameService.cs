using HealthGameCurator.Application.DTOs;

namespace HealthGameCurator.Application.Interfaces;

/// <summary>
/// 게임 서비스 인터페이스 - CLAUDE.md: 새 서비스 추가 시 인터페이스 먼저 정의
/// </summary>
public interface IGameService
{
    Task<PagedResult<GameDto>> GetGamesAsync(GameListQuery query);
    Task<GameDto?> GetGameByIdAsync(int id);
    Task<List<string>> GetCategoriesAsync();
    Task<List<GameDto>> GetSimilarGamesAsync(int gameId);
    /// <param name="forceReanalyze">true이면 이미 분석된 게임도 강제 재분석</param>
    Task<AnalyzeGameResponse> AnalyzeGameAsync(int gameId, bool forceReanalyze = false);
    Task<List<AnalyzeGameResponse>> AnalyzeAllGamesAsync();
}
