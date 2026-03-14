using HealthGameCurator.Domain.Entities;

namespace HealthGameCurator.Application.Interfaces;

/// <summary>
/// 게임 저장소 인터페이스
/// </summary>
public interface IGameRepository
{
    Task<(List<Game> Items, int Total)> GetGamesAsync(string? category, string sort, int page, int pageSize);
    Task<Game?> GetGameByIdAsync(int id);
    Task<List<string>> GetCategoriesAsync();
    Task<List<Game>> GetSimilarGamesAsync(int gameId, int count = 4);
}
