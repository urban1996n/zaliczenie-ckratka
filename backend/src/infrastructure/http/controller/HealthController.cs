using Microsoft.AspNetCore.Mvc;

namespace backend.infrastructure.http.controller;

[ApiController]
[Route("api/health")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get() => Ok("API działa");
}