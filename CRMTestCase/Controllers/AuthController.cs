using CRMTestCase.Models;
using CRMTestCase.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace CRMTestCase.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> UserManager;
        private readonly SignInManager<User> SignInManager;
        private readonly JwtService JwtService;
        private readonly ILogger<AuthController> Logger;

        public AuthController(
            UserManager<User> userManager,
            SignInManager<User> signInManager,
            JwtService jwtService,
            ILogger<AuthController> logger)
        {
            UserManager = userManager;
            SignInManager = signInManager;
            JwtService = jwtService;
            Logger = logger;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User model)
        {
            Logger.LogInformation($"Login attempt for user: {model.Username}");

            var user = await UserManager.FindByNameAsync(model.Username);
            if (user == null)
            {
                Logger.LogWarning($"User not found: {model.Username}");
                return Unauthorized(new { message = "Invalid username or password" });
            }

            var result = await SignInManager.CheckPasswordSignInAsync(user, model.Password, false);
            if (!result.Succeeded)
            {
                Logger.LogWarning($"Invalid password for user: {model.Username}");
                return Unauthorized(new { message = "Invalid username or password" });
            }

            var token = JwtService.GenerateToken(user);
            Logger.LogInformation($"User {model.Username} logged in successfully");

            return Ok(new
            {
                token = token,
                user = new
                {
                    id = user.Id,
                    username = user.Username,
                    role = user.Role
                }
            });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await SignInManager.SignOutAsync();
            Logger.LogInformation("User logged out");
            return Ok(new { message = "Logged out successfully" });
        }
    }
}
