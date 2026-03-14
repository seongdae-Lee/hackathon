using HealthGameCurator.Application.DTOs;

namespace HealthGameCurator.Application.Interfaces;

/// <summary>
/// 유사 게임 추천 서비스 인터페이스 - AI 태그 기반 가중치 유사도
/// </summary>
public interface IGameRecommendationService
{
    /// <summary>
    /// 주어진 게임과 유사한 게임 목록 반환 (Confidence 가중치 유사도 기반)
    /// </summary>
    Task<List<GameDto>> GetSimilarGamesAsync(int gameId, int count = 4);
}
