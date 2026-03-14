using HealthGameCurator.Application.DTOs;

namespace HealthGameCurator.Application.Interfaces;

/// <summary>
/// 게임 검색 서비스 인터페이스
/// </summary>
public interface IGameSearchService
{
    /// <summary>
    /// 키워드로 게임 검색 (게임명, 카테고리, 건강 효과 태그)
    /// 빈 키워드 또는 1글자 이하는 빈 배열 반환
    /// </summary>
    Task<List<SearchResultDto>> SearchGamesAsync(string query);
}
