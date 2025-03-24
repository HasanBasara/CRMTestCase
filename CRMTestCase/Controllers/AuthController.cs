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
        private readonly IUserService _userService;
        private readonly JwtService _jwtService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            IUserService userService,
            JwtService jwtService,
            ILogger<AuthController> logger)
        {
            _userService = userService;
            _jwtService = jwtService;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            _logger.LogInformation($"Kullanıcı giriş denemesi: {model.Username}");

            var user = await _userService.GetUserByUsernameAsync(model.Username);
            if (user == null)
            {
                _logger.LogWarning($"Kullanıcı bulunamadı: {model.Username}");
                return Unauthorized(new { message = "Geçersiz kullanıcı adı veya şifre" });
            }

            bool isValidPassword = await _userService.CheckPasswordAsync(user, model.Password);
            if (!isValidPassword)
            {
                _logger.LogWarning($"Geçersiz şifre, kullanıcı: {model.Username}");
                return Unauthorized(new { message = "Geçersiz kullanıcı adı veya şifre" });
            }

            var token = _jwtService.GenerateToken(user);
            _logger.LogInformation($"Kullanıcı {model.Username} başarıyla giriş yaptı");

            return Ok(new
            {
                token = token,
                user = new
                {
                    id = user.Id,
                    username = user.Username,
                    role = user.Role,
                    createdAt = user.CreatedAt,
                    updatedAt = user.UpdatedAt
                }
            });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            _logger.LogInformation("Kullanıcı çıkış yaptı");
            return Ok(new { message = "Başarıyla çıkış yapıldı" });
        }
    }

    public class LoginModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
