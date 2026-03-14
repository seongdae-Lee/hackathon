using HealthGameCurator.Application.DTOs;
using HealthGameCurator.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace HealthGameCurator.Api.Controllers;

/// <summary>
/// 게임 API 컨트롤러
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class GamesController : ControllerBase
{
    private readonly GameService _gameService;

    public GamesController(GameService gameService)
    {
        _gameService = gameService;
    }

    /// <summary>
    /// 게임 목록 조회 (카테고리 필터, 정렬, 페이지네이션)
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<GameDto>>>> GetGames(
        [FromQuery] string? category = null,
        [FromQuery] string? sort = "popular",
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var query = new GameListQuery(category, sort, page, pageSize);
        var result = await _gameService.GetGamesAsync(query);
        return Ok(ApiResponse<PagedResult<GameDto>>.Ok(result));
    }

    /// <summary>
    /// 게임 상세 조회
    /// </summary>
    [HttpGet("{id:int}")]
    public async Task<ActionResult<ApiResponse<GameDto>>> GetGame(int id)
    {
        var game = await _gameService.GetGameByIdAsync(id);
        if (game is null)
            return NotFound(ApiResponse<GameDto>.Fail("게임을 찾을 수 없습니다.", "GAME_NOT_FOUND"));

        return Ok(ApiResponse<GameDto>.Ok(game));
    }

    /// <summary>
    /// 유사 게임 추천 조회
    /// </summary>
    [HttpGet("{id:int}/similar")]
    public async Task<ActionResult<ApiResponse<List<GameDto>>>> GetSimilarGames(int id)
    {
        var games = await _gameService.GetSimilarGamesAsync(id);
        return Ok(ApiResponse<List<GameDto>>.Ok(games));
    }
}
