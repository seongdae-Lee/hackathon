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
    Task ReplaceHealthTagsAsync(int gameId, List<HealthTag> newTags);
    Task<List<Game>> SearchGamesAsync(string query);
    Task<List<Game>> GetGamesByTagsAsync(IEnumerable<string> tags);
    Task<Game> AddAsync(Game game);
    Task<Game> UpdateAsync(Game game);
    Task DeleteAsync(int id);
    Task<int> CountAllAsync();
    Task<int> CountAnalyzedAsync();
}
