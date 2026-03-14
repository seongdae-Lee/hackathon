using HealthGameCurator.Application.Interfaces;
using HealthGameCurator.Domain.Entities;
using HealthGameCurator.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace HealthGameCurator.Infrastructure.Repositories;

/// <summary>
/// 게임 저장소 구현체 - EF Core + SQLite
/// </summary>
public class GameRepository : IGameRepository
{
    private readonly AppDbContext _context;

    public GameRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<(List<Game> Items, int Total)> GetGamesAsync(string? category, string sort, int page, int pageSize)
    {
        var query = _context.Games
            .Include(g => g.HealthTags)
            .AsQueryable();

        // 카테고리 필터
        if (!string.IsNullOrEmpty(category))
            query = query.Where(g => g.Category == category);

        // 정렬
        query = sort switch
        {
            "rating" => query.OrderByDescending(g => g.Rating),
            "latest" => query.OrderByDescending(g => g.CreatedAt),
            _ => query.OrderByDescending(g => g.DownloadCount)  // popular (기본값)
        };

        var total = await query.CountAsync();
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, total);
    }

    public async Task<Game?> GetGameByIdAsync(int id)
    {
        return await _context.Games
            .Include(g => g.HealthTags)
            .FirstOrDefaultAsync(g => g.Id == id);
    }

    public async Task<List<string>> GetCategoriesAsync()
    {
        return await _context.Games
            .Select(g => g.Category)
            .Distinct()
            .OrderBy(c => c)
            .ToListAsync();
    }

    public async Task<List<Game>> GetSimilarGamesAsync(int gameId, int count = 4)
    {
        // 현재 게임의 태그 가져오기
        var currentGame = await _context.Games
            .Include(g => g.HealthTags)
            .FirstOrDefaultAsync(g => g.Id == gameId);

        if (currentGame is null) return new List<Game>();

        var currentTags = currentGame.HealthTags.Select(t => t.Tag).ToList();

        if (currentTags.Count == 0)
        {
            // 태그 없으면 같은 카테고리의 다른 게임 반환
            return await _context.Games
                .Include(g => g.HealthTags)
                .Where(g => g.Id != gameId && g.Category == currentGame.Category)
                .Take(count)
                .ToListAsync();
        }

        // 공통 태그가 가장 많은 게임 순으로 반환
        return await _context.Games
            .Include(g => g.HealthTags)
            .Where(g => g.Id != gameId && g.HealthTags.Any(t => currentTags.Contains(t.Tag)))
            .OrderByDescending(g => g.HealthTags.Count(t => currentTags.Contains(t.Tag)))
            .Take(count)
            .ToListAsync();
    }

    public async Task ReplaceHealthTagsAsync(int gameId, List<HealthTag> newTags)
    {
        // 기존 태그 삭제
        var existing = await _context.HealthTags
            .Where(t => t.GameId == gameId)
            .ToListAsync();
        _context.HealthTags.RemoveRange(existing);

        // 새 태그 추가
        await _context.HealthTags.AddRangeAsync(newTags);
        await _context.SaveChangesAsync();
    }
}
