using Microsoft.AspNetCore.Identity;

namespace CRMTestCase.Models
{
    public class User : IdentityUser
    {
        public string Role { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
