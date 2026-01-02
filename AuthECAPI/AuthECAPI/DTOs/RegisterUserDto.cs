using System.ComponentModel.DataAnnotations;

namespace AuthECAPI.DTOs
{
    public class RegisterUserDto
    {
        [Required]
        [MaxLength(200)]
        public string FullName { get; set; }

        [Required]
        public string UserName { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        [MinLength(8)]
        public string Password { get; set; }

        [Required]
        [MinLength(8)]
        public string ConfirmPassword { get; set; }

       
    }
}
