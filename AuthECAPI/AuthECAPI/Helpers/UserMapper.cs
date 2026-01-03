using AuthECAPI.DTOs;
using AuthECAPI.Models;

namespace AuthECAPI.Helpers
{
    public static class UserMapper
    {
        public static User ToUserFromRegisterUserDto(this RegisterUserDto dto)
        {
            return new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                UserName = dto.UserName
            };
        }

    }
}
