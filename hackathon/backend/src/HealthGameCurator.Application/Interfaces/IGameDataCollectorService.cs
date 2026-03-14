using HealthGameCurator.Application.DTOs;

namespace HealthGameCurator.Application.Interfaces;

/// <summary>
/// 게임 데이터 수집 서비스 인터페이스
/// </summary>
public interface IGameDataCollectorService
{
    /// <summary>
    /// 외부 소스에서 게임 데이터를 수집하여 DB에 저장
    /// </summary>
    Task<CollectionResult> CollectAndSaveGamesAsync(int maxCount = 20);
}
