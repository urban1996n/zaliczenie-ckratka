using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.modules.user.presentation;

[ApiController]
[Route("api/_auth")]
public class AuthCheckController : ControllerBase
{
    [HttpGet]
    [Authorize]
    public IActionResult Get()
    {
        return Ok();
    }
}
