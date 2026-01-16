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

        var accessToken = _authService.GenerateAccessToken(user);
        var refreshToken = _authService.GenerateRefreshToken();
        await _authService.SetRefreshToken(user, refreshToken);

        return Ok(new { Token = accessToken.token, RefreshToken = refreshToken, expiresAt = accessToken.ExpiryTime.ToString("O")});
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] RefreshTokenDto refreshTokenDto)
    {
        var user = await _userRepository.GetByRefreshToken(refreshTokenDto.RefreshToken);
        if (user == null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
        {
            return Unauthorized("Invalid refresh token.");
        }

        var newAccessToken = _authService.GenerateAccessToken(user);
        var newRefreshToken = _authService.GenerateRefreshToken();
        await _authService.SetRefreshToken(user, newRefreshToken);

        return Ok(new { Token = newAccessToken, RefreshToken = newRefreshToken });
    }
}

public record RegisterDto(string Email, string Password);
public record LoginDto(string Email, string Password);
public record RefreshTokenDto(string RefreshToken);
