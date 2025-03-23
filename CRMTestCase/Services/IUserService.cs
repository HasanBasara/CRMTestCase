using CRMTestCase.Models;

namespace CRMTestCase.Services
{
    public interface IUserService
    {
        Task<User> GetUserByUsernameAsync(string username);
        Task<bool> CheckPasswordAsync(User user, string password);
    }
}
