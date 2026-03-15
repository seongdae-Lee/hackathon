using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using HealthGameCurator.Application.DTOs;
using HealthGameCurator.Application.Interfaces;
using HealthGameCurator.Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;

namespace HealthGameCurator.Application.Services;

/// <summary>
/// 관리자 서비스 - JWT 인증 + 게임 CRUD + 통계 집계
/// </summary>
public class AdminService : IAdminService
{
    private readonly IGameRepository _repository;
    private readonly ILogger<AdminService> _logger;
    private readonly IConfiguration _configuration;

    public AdminService(IGameRepository repository, ILogger<AdminService> logger, IConfiguration configuration)
    {
        _repository = repository;
        _logger = logger;
        _configuration = configuration;
    }

    /// <summary>
    /// 관리자 로그인 - BCrypt 비밀번호 검증 후 JWT 토큰 발급
    /// </summary>
    public Task<LoginResponse?> LoginAsync(LoginRequest request)
    {
        // 설정에서 관리자 자격증명 조회
        var configuredUsername = _configuration["AdminCredentials:Username"];
        var configuredHash = _configuration["AdminCredentials:PasswordHash"];

        // 아이디 검증
        if (string.IsNullOrEmpty(configuredUsername) || request.Username != configuredUsername)
        {
            _logger.LogWarning("로그인 실패 - 존재하지 않는 아이디: {Username}", request.Username);
            return Task.FromResult<LoginResponse?>(null);
        }

        // BCrypt 비밀번호 검증
        if (string.IsNullOrEmpty(configuredHash) || !BCrypt.Net.BCrypt.Verify(request.Password, configuredHash))
        {
            _logger.LogWarning("로그인 실패 - 비밀번호 불일치: {Username}", request.Username);
            return Task.FromResult<LoginResponse?>(null);
        }

        // JWT 토큰 생성
        var token = GenerateJwtToken(request.Username);
        _logger.LogInformation("관리자 로그인 성공: {Username}", request.Username);
        return Task.FromResult<LoginResponse?>(token);
    }

    /// <summary>
    /// JWT 토큰 생성 - 설정에서 Secret/Issuer/Audience 읽어 서명
    /// </summary>
    private LoginResponse GenerateJwtToken(string username)
    {
        var secret = _configuration["Jwt:Secret"]
            ?? throw new InvalidOperationException("JWT Secret이 설정되지 않았습니다.");
        var issuer = _configuration["Jwt:Issuer"] ?? "HealthGameCurator";
        var audience = _configuration["Jwt:Audience"] ?? "HealthGameCuratorAdmin";
        var expiresInMinutes = int.TryParse(_configuration["Jwt:ExpiresInMinutes"], out var mins) ? mins : 480;

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expiresAt = DateTime.UtcNow.AddMinutes(expiresInMinutes);

        var claims = new[]
        {
            new Claim(ClaimTypes.Name, username),
            new Claim(ClaimTypes.Role, "Admin"),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: expiresAt,
            signingCredentials: creds
        );

        return new LoginResponse(new JwtSecurityTokenHandler().WriteToken(token), expiresAt);
    }

    /// <summary>
    /// 대시보드 통계 집계 (전체/분석완료/미분석 게임 수)
    /// </summary>
    public async Task<AdminStatsDto> GetStatsAsync()
    {
        var total = await _repository.CountAllAsync();
        var analyzed = await _repository.CountAnalyzedAsync();
        return new AdminStatsDto(total, analyzed, total - analyzed);
    }

    /// <summary>
    /// 관리자용 전체 게임 목록 조회 (등록일 내림차순)
    /// </summary>
    public async Task<List<AdminGameDto>> GetAllGamesAsync()
    {
        var (items, _) = await _repository.GetGamesAsync(null, "latest", 1, int.MaxValue);
        return items.Select(MapToAdminGameDto).ToList();
    }

    /// <summary>
    /// 게임 추가
    /// </summary>
    public async Task<AdminGameDto> CreateGameAsync(CreateGameRequest request)
    {
        var game = new Game
        {
            Name = request.Name,
            Description = request.Description,
            Developer = request.Developer,
            Category = request.Category,
            Rating = request.Rating,
            DownloadCount = request.DownloadCount,
            IconUrl = request.IconUrl,
            PlayStoreUrl = request.PlayStoreUrl,
            AppStoreUrl = request.AppStoreUrl,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        var created = await _repository.AddAsync(game);
        _logger.LogInformation("게임 추가 완료: {GameId} - {GameName}", created.Id, created.Name);
        return MapToAdminGameDto(created);
    }

    /// <summary>
    /// 게임 수정
    /// </summary>
    public async Task<AdminGameDto> UpdateGameAsync(int id, UpdateGameRequest request)
    {
        var game = await _repository.GetGameByIdAsync(id)
            ?? throw new KeyNotFoundException($"게임을 찾을 수 없습니다. ID: {id}");

        game.Name = request.Name;
        game.Description = request.Description;
        game.Developer = request.Developer;
        game.Category = request.Category;
        game.Rating = request.Rating;
        game.DownloadCount = request.DownloadCount;
        game.IconUrl = request.IconUrl;
        game.PlayStoreUrl = request.PlayStoreUrl;
        game.AppStoreUrl = request.AppStoreUrl;
        game.UpdatedAt = DateTime.UtcNow;

        var updated = await _repository.UpdateAsync(game);
        _logger.LogInformation("게임 수정 완료: {GameId} - {GameName}", updated.Id, updated.Name);
        return MapToAdminGameDto(updated);
    }

    /// <summary>
    /// 게임 삭제 (연관 HealthTag는 CASCADE DELETE)
    /// </summary>
    public async Task DeleteGameAsync(int id)
    {
        var game = await _repository.GetGameByIdAsync(id)
            ?? throw new KeyNotFoundException($"게임을 찾을 수 없습니다. ID: {id}");

        await _repository.DeleteAsync(id);
        _logger.LogInformation("게임 삭제 완료: {GameId} - {GameName}", id, game.Name);
    }

    private static AdminGameDto MapToAdminGameDto(Game game) => new(
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
        game.HealthTags.Any(t => t.IsAiAnalyzed),
        game.HealthTags.Select(t => new HealthTagDto(
            t.Id, t.Tag, t.Confidence, t.AiDescription, t.IsAiAnalyzed
        )).ToList()
    );
}
