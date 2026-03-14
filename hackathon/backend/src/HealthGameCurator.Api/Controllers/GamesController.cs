using HealthGameCurator.Application.DTOs;
using HealthGameCurator.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HealthGameCurator.Api.Controllers;

/// <summary>
/// 게임 API 컨트롤러
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class GamesController : ControllerBase
{
    private readonly IGameService _gameService;
    private readonly IGameRecommendationService _recommendationService;
    private readonly IGameSearchService _searchService;

    public GamesController(
        IGameService gameService,
        IGameRecommendationService recommendationService,
        IGameSearchService searchService)
    {
        _gameService = gameService;
        _recommendationService = recommendationService;
        _searchService = searchService;
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
        // [Suggestion-01] 입력값 유효성 검사
        if (page <= 0) page = 1;
        if (pageSize <= 0 || pageSize > 100) pageSize = 20;

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
    /// 게임 키워드 검색 (게임명, 카테고리, 건강 효과 태그)
    /// </summary>
    [HttpGet("search")]
    public async Task<ActionResult<ApiResponse<List<SearchResultDto>>>> SearchGames(
        [FromQuery] string? q = null)
    {
        var results = await _searchService.SearchGamesAsync(q ?? string.Empty);
        return Ok(ApiResponse<List<SearchResultDto>>.Ok(results));
    }

    /// <summary>
    /// 유사 게임 추천 조회
    /// </summary>
    [HttpGet("{id:int}/similar")]
    public async Task<ActionResult<ApiResponse<List<GameDto>>>> GetSimilarGames(int id)
    {
        // [Suggestion-03] 게임 존재 여부 먼저 확인
        var game = await _gameService.GetGameByIdAsync(id);
        if (game is null)
            return NotFound(ApiResponse<List<GameDto>>.Fail("게임을 찾을 수 없습니다.", "GAME_NOT_FOUND"));

        var games = await _recommendationService.GetSimilarGamesAsync(id);
        return Ok(ApiResponse<List<GameDto>>.Ok(games));
    }
}
