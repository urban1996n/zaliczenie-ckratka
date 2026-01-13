using backend.modules.user.domain;
using backend.modules.user.infrastructure;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace backend.modules.user.presentation;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    private readonly PasswordManager _passwordManager;
    private readonly AuthService _authService;

    public AuthController(IUserRepository userRepository, PasswordManager passwordManager, AuthService authService)
    {
        _userRepository = userRepository;
        _passwordManager = passwordManager;
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
    {
        var existingUser = await _userRepository.GetByEmail(registerDto.Email);
        if (existingUser != null)
        {
            return Conflict("User with this email already exists.");
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = registerDto.Email,
            Password = _passwordManager.HashPassword(registerDto.Password)
        };

        await _userRepository.Add(user);

        return Ok();
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        var user = await _userRepository.GetByEmail(loginDto.Email);
        if (user == null || !_passwordManager.VerifyPassword(loginDto.Password, user.Password))
        {
            return Unauthorized("Invalid credentials.");
        }

        var token = _authService.GenerateJwtToken(user);

        return Ok(new { Token = token });
    }
}

public record RegisterDto(string Email, string Password);
public record LoginDto(string Email, string Password);
