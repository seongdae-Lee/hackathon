using HealthGameCurator.Application.DTOs;
using HealthGameCurator.Application.Interfaces;

namespace HealthGameCurator.Application.Services;

/// <summary>
/// 게임 서비스 - 게임 목록/상세 조회 비즈니스 로직
/// </summary>
public class GameService
{
    private readonly IGameRepository _gameRepository;

    public GameService(IGameRepository gameRepository)
    {
        _gameRepository = gameRepository;
    }

    public async Task<PagedResult<GameDto>> GetGamesAsync(GameListQuery query)
    {
        var (games, total) = await _gameRepository.GetGamesAsync(
            query.Category,
            query.Sort ?? "popular",
            query.Page,
            query.PageSize
        );

        var items = games.Select(g => MapToDto(g)).ToList();
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

    // Game 엔티티를 DTO로 변환
    private static GameDto MapToDto(Domain.Entities.Game game) => new(
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
