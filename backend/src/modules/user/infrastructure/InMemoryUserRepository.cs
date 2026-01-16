using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.modules.user.domain;

namespace backend.modules.user.infrastructure;

public class InMemoryUserRepository : user.domain.IUserRepository
{
    private readonly List<domain.User> _users = new();

    public Task<domain.User?> GetByEmail(string email)
    {
        return Task.FromResult(_users.FirstOrDefault(u => u.Email == email));
    }

    public Task Add(domain.User user)
    {
        _users.Add(user);
        return Task.CompletedTask;
    }

    public Task Update(domain.User user)
    {
        return Task.CompletedTask;
    }

    public Task<User?> GetByRefreshToken(string refreshToken)
    {
        return new Task<User?>(() => _users.FirstOrDefault(u => u.RefreshToken == refreshToken));
    }
}
