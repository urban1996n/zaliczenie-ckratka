using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
}
