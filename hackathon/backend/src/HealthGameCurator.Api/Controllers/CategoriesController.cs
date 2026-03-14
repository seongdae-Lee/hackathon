using HealthGameCurator.Application.DTOs;
using HealthGameCurator.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace HealthGameCurator.Api.Controllers;

/// <summary>
/// 카테고리 API 컨트롤러
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly GameService _gameService;

    public CategoriesController(GameService gameService)
    {
        _gameService = gameService;
    }

    /// <summary>
    /// 게임 카테고리 목록 조회
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<string>>>> GetCategories()
    {
        var categories = await _gameService.GetCategoriesAsync();
        return Ok(ApiResponse<List<string>>.Ok(categories));
    }
}
