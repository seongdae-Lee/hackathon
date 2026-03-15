using HealthGameCurator.Application.DTOs;

namespace HealthGameCurator.Application.Interfaces;

/// <summary>
/// 관리자 서비스 인터페이스 - 게임 CRUD + 통계
/// </summary>
public interface IAdminService
{
    Task<AdminStatsDto> GetStatsAsync();
    Task<AdminGameDto> CreateGameAsync(CreateGameRequest request);
    Task<AdminGameDto> UpdateGameAsync(int id, UpdateGameRequest request);
    Task DeleteGameAsync(int id);
    Task<List<AdminGameDto>> GetAllGamesAsync();
}
