using FluentValidation;
using HealthGameCurator.Application.DTOs;
using HealthGameCurator.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HealthGameCurator.Api.Controllers;

/// <summary>
/// 관리자 API 컨트롤러 - JWT 인증 필수 (로그인 엔드포인트 제외)
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly IGameService _gameService;
    private readonly IGameDataCollectorService _collectorService;
    private readonly IAdminService _adminService;
    private readonly IValidator<CreateGameRequest> _createValidator;
    private readonly IValidator<UpdateGameRequest> _updateValidator;

    public AdminController(
        IGameService gameService,
        IGameDataCollectorService collectorService,
        IAdminService adminService,
        IValidator<CreateGameRequest> createValidator,
        IValidator<UpdateGameRequest> updateValidator)
    {
        _gameService = gameService;
        _collectorService = collectorService;
        _adminService = adminService;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
    }

    /// <summary>
    /// 관리자 로그인 - JWT 토큰 발급 (인증 불필요)
    /// </summary>
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<LoginResponse>>> Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            return BadRequest(ApiResponse<LoginResponse>.Fail("아이디와 비밀번호를 입력해주세요.", "INVALID_INPUT"));

        var result = await _adminService.LoginAsync(request);
        if (result is null)
            return Unauthorized(ApiResponse<LoginResponse>.Fail("아이디 또는 비밀번호가 올바르지 않습니다.", "INVALID_CREDENTIALS"));

        return Ok(ApiResponse<LoginResponse>.Ok(result));
    }

    /// <summary>
    /// 관리자 대시보드 통계 조회
    /// </summary>
    [HttpGet("stats")]
    public async Task<ActionResult<ApiResponse<AdminStatsDto>>> GetStats()
    {
        var stats = await _adminService.GetStatsAsync();
        return Ok(ApiResponse<AdminStatsDto>.Ok(stats));
    }

    /// <summary>
    /// 관리자용 전체 게임 목록 조회
    /// </summary>
    [HttpGet("games")]
    public async Task<ActionResult<ApiResponse<List<AdminGameDto>>>> GetGames()
    {
        var games = await _adminService.GetAllGamesAsync();
        return Ok(ApiResponse<List<AdminGameDto>>.Ok(games));
    }

    /// <summary>
    /// 게임 추가 (FluentValidation 검증)
    /// </summary>
    [HttpPost("games")]
    public async Task<ActionResult<ApiResponse<AdminGameDto>>> CreateGame([FromBody] CreateGameRequest request)
    {
        var validation = await _createValidator.ValidateAsync(request);
        if (!validation.IsValid)
        {
            var errors = string.Join("; ", validation.Errors.Select(e => e.ErrorMessage));
            return BadRequest(ApiResponse<AdminGameDto>.Fail(errors, "VALIDATION_FAILED"));
        }

        var game = await _adminService.CreateGameAsync(request);
        return Ok(ApiResponse<AdminGameDto>.Ok(game));
    }

    /// <summary>
    /// 게임 수정 (FluentValidation 검증)
    /// </summary>
    [HttpPut("games/{id:int}")]
    public async Task<ActionResult<ApiResponse<AdminGameDto>>> UpdateGame(
        int id, [FromBody] UpdateGameRequest request)
    {
        var validation = await _updateValidator.ValidateAsync(request);
        if (!validation.IsValid)
        {
            var errors = string.Join("; ", validation.Errors.Select(e => e.ErrorMessage));
            return BadRequest(ApiResponse<AdminGameDto>.Fail(errors, "VALIDATION_FAILED"));
        }

        try
        {
            var game = await _adminService.UpdateGameAsync(id, request);
            return Ok(ApiResponse<AdminGameDto>.Ok(game));
        }
        catch (KeyNotFoundException)
        {
            return NotFound(ApiResponse<AdminGameDto>.Fail("게임을 찾을 수 없습니다.", "GAME_NOT_FOUND"));
        }
    }

    /// <summary>
    /// 게임 삭제 (연관 HealthTag CASCADE 삭제)
    /// </summary>
    [HttpDelete("games/{id:int}")]
    public async Task<ActionResult<ApiResponse<object?>>> DeleteGame(int id)
    {
        try
        {
            await _adminService.DeleteGameAsync(id);
            return Ok(ApiResponse<object?>.Ok(null));
        }
        catch (KeyNotFoundException)
        {
            return NotFound(ApiResponse<object?>.Fail("게임을 찾을 수 없습니다.", "GAME_NOT_FOUND"));
        }
    }

    /// <summary>
    /// 단일 게임 AI 건강 효과 분석 트리거 (관리자 재분석 버튼: forceReanalyze=true)
    /// </summary>
    [HttpPost("analyze/{gameId:int}")]
    public async Task<ActionResult<ApiResponse<AnalyzeGameResponse>>> AnalyzeGame(int gameId)
    {
        // 관리자 패널에서 호출 시 강제 재분석 (이미 분석된 게임도 재분석)
        var result = await _gameService.AnalyzeGameAsync(gameId, forceReanalyze: true);

        if (string.IsNullOrEmpty(result.GameName))
            return NotFound(ApiResponse<AnalyzeGameResponse>.Fail("게임을 찾을 수 없습니다.", "GAME_NOT_FOUND"));

        return Ok(ApiResponse<AnalyzeGameResponse>.Ok(result));
    }

    /// <summary>
    /// 미분석 게임 전체 일괄 AI 분석
    /// </summary>
    [HttpPost("analyze/all")]
    public async Task<ActionResult<ApiResponse<List<AnalyzeGameResponse>>>> AnalyzeAllGames()
    {
        var results = await _gameService.AnalyzeAllGamesAsync();
        return Ok(ApiResponse<List<AnalyzeGameResponse>>.Ok(results));
    }

    /// <summary>
    /// 게임 데이터 수집 트리거 (Mock 또는 RapidAPI)
    /// </summary>
    [HttpPost("collect")]
    public async Task<ActionResult<ApiResponse<CollectionResult>>> CollectGames(
        [FromQuery] int maxCount = 10)
    {
        if (maxCount <= 0 || maxCount > 100) maxCount = 10;

        var result = await _collectorService.CollectAndSaveGamesAsync(maxCount);

        if (!result.IsSuccess)
            return StatusCode(500, ApiResponse<CollectionResult>.Fail(
                result.ErrorMessage ?? "데이터 수집 실패", "COLLECTION_FAILED"));

        return Ok(ApiResponse<CollectionResult>.Ok(result));
    }
}
