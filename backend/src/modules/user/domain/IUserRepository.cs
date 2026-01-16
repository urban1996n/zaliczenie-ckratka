using System.Threading.Tasks;

namespace backend.modules.user.domain;

public interface IUserRepository
{
    Task<User?> GetByEmail(string email);
    Task Add(User user);
    Task Update(User user);
    Task<User?> GetByRefreshToken(string refreshToken);
}
