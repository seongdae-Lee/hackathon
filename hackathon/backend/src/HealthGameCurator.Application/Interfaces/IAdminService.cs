using HealthGameCurator.Application.DTOs;

namespace HealthGameCurator.Application.Interfaces;

/// <summary>
/// 관리자 서비스 인터페이스 - 인증 + 게임 CRUD + 통계
/// </summary>
public interface IAdminService
{
    /// <summary>아이디/비밀번호 검증 후 JWT 토큰 반환. 실패 시 null 반환.</summary>
    Task<LoginResponse?> LoginAsync(LoginRequest request);
    Task<AdminStatsDto> GetStatsAsync();
    Task<AdminGameDto> CreateGameAsync(CreateGameRequest request);
    Task<AdminGameDto> UpdateGameAsync(int id, UpdateGameRequest request);
    Task DeleteGameAsync(int id);
    Task<List<AdminGameDto>> GetAllGamesAsync();
}
