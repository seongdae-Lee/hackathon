using HealthGameCurator.Application.DTOs;
using HealthGameCurator.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HealthGameCurator.Api.Controllers;

/// <summary>
/// 관리자 API 컨트롤러 - AI 분석 트리거, 데이터 수집
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly IGameService _gameService;
    private readonly IGameDataCollectorService _collectorService;

    public AdminController(
        IGameService gameService,
        IGameDataCollectorService collectorService)
    {
        _gameService = gameService;
        _collectorService = collectorService;
    }

    /// <summary>
    /// 단일 게임 AI 건강 효과 분석 트리거
    /// </summary>
    [HttpPost("analyze/{gameId:int}")]
    public async Task<ActionResult<ApiResponse<AnalyzeGameResponse>>> AnalyzeGame(int gameId)
    {
        var result = await _gameService.AnalyzeGameAsync(gameId);

        if (!result.IsAnalyzed && result.TagsUpdated == 0 && result.GameName == string.Empty)
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
