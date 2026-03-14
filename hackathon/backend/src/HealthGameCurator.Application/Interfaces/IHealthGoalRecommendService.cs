using HealthGameCurator.Application.DTOs;

namespace HealthGameCurator.Application.Interfaces;

/// <summary>
/// 건강 목표 기반 맞춤 추천 서비스 인터페이스
/// </summary>
public interface IHealthGoalRecommendService
{
    /// <summary>
    /// 선택한 건강 목표에 맞는 게임 추천
    /// </summary>
    Task<RecommendResponse> RecommendGamesAsync(RecommendRequest request);
}
