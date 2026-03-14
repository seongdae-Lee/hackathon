using HealthGameCurator.Application.DTOs;
using HealthGameCurator.Application.Interfaces;
using HealthGameCurator.Domain.Entities;
using HealthGameCurator.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace HealthGameCurator.Infrastructure.Services;

/// <summary>
/// 게임 데이터 수집 서비스 - RapidAPI 실패 시 MockGameDataProvider로 자동 Fallback
/// </summary>
public class GameDataCollectorService : IGameDataCollectorService
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly ILogger<GameDataCollectorService> _logger;

    public GameDataCollectorService(
        AppDbContext context,
        IConfiguration configuration,
        ILogger<GameDataCollectorService> logger)
    {
        _context = context;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<CollectionResult> CollectAndSaveGamesAsync(int maxCount = 20)
    {
        List<CollectedGameDto> collectedGames;

        // RapidAPI 수집 시도 → 실패 시 Mock으로 Fallback
        try
        {
            collectedGames = await CollectFromRapidApiAsync(maxCount);
            _logger.LogInformation("RapidAPI에서 {Count}개 게임 수집 완료", collectedGames.Count);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "RapidAPI 수집 실패, Mock 데이터로 Fallback합니다.");
            collectedGames = MockGameDataProvider.GetMockGames().Take(maxCount).ToList();
        }

        return await SaveCollectedGamesAsync(collectedGames);
    }

    // RapidAPI에서 게임 데이터 수집 (API 키 없으면 예외 발생 → Fallback 처리됨)
    private async Task<List<CollectedGameDto>> CollectFromRapidApiAsync(int maxCount)
    {
        var apiKey = _configuration["RapidApi:ApiKey"];
        if (string.IsNullOrEmpty(apiKey))
            throw new InvalidOperationException("RapidAPI 키가 설정되지 않았습니다.");

        // TODO: RapidAPI Google Play Store API 연동 구현
        // 현재는 예외를 던져 Mock으로 Fallback
        await Task.CompletedTask;
        throw new NotImplementedException("RapidAPI 연동은 아직 구현되지 않았습니다.");
    }

    // 수집된 게임을 DB에 저장 (이미 존재하는 게임은 Skip)
    private async Task<CollectionResult> SaveCollectedGamesAsync(List<CollectedGameDto> games)
    {
        var savedCount = 0;
        var skippedCount = 0;

        foreach (var collected in games)
        {
            // 이름이 동일한 게임이 이미 존재하면 Skip
            var exists = await _context.Games.AnyAsync(g => g.Name == collected.Name);
            if (exists)
            {
                skippedCount++;
                continue;
            }

            var game = new Game
            {
                Name = collected.Name,
                Description = collected.Description,
                Developer = collected.Developer,
                IconUrl = collected.IconUrl,
                Rating = collected.Rating,
                DownloadCount = collected.DownloadCount,
                Category = collected.Category,
                PlayStoreUrl = collected.PlayStoreUrl,
                AppStoreUrl = collected.AppStoreUrl,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            };

            _context.Games.Add(game);
            savedCount++;
        }

        await _context.SaveChangesAsync();
        _logger.LogInformation("데이터 수집 완료 - 저장: {Saved}개, 건너뜀: {Skipped}개", savedCount, skippedCount);

        return new CollectionResult(true, games.Count, savedCount, skippedCount);
    }
}
