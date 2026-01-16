using backend.infrastructure.database;
using backend.modules.user.domain;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace backend.modules.user.infrastructure;

public class EFUserRepository : IUserRepository
{
    private readonly DefaultDatabaseContext _context;

    public EFUserRepository(DefaultDatabaseContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByEmail(string email)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task Add(User user)
    {
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
    }

    public async Task Update(User user)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
    }

    public async Task<User?> GetByRefreshToken(string refreshToken)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);
    }
}
