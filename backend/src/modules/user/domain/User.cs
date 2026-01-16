namespace backend.modules.user.domain;

public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiryTime { get; set; }
}
