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
    Task<AnalyzeGameResponse> AnalyzeGameAsync(int gameId);
    Task<List<AnalyzeGameResponse>> AnalyzeAllGamesAsync();
}
