using AuthECAPI.Data;
using AuthECAPI.DTOs;
using AuthECAPI.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AuthECAPI.Controllers
{
    public static class UserEndpoints
    {
        public static IEndpointRouteBuilder MapUserEndpoints(this IEndpointRouteBuilder app)
        {
            var group = app.MapGroup("/api/users")
                            .WithTags("Users");

            group.MapPost("/signup", SignUp);
            group.MapPost("/login", login); 

            return app;
        }

        private static IResult SignUp(UserManager<User> userManager,[FromBody] RegisterUserDto userDto)
        {
            if(userDto.Password != userDto.ConfirmPassword)
            {
                return Results.BadRequest("Password and Confirm Password do not match.");
            }

            var user = new User { FullName = userDto.FullName, Email = userDto.Email, UserName = userDto.UserName };
            var result = userManager.CreateAsync(user, userDto.Password).Result;
            if (result.Succeeded)
            {
                return Results.Ok(result);
            }
            else
            {
                return Results.BadRequest(result.Errors);
            }
        }

        private static IResult login(UserManager<User> userManager, [FromBody] LoginDto loginDto, IOptions<JwtOptions> jwtOptions)
        {
            // 1- Validate user credentials
            var user = userManager.FindByNameAsync(loginDto.UserNameOrEmail).Result 
                       ?? userManager.FindByEmailAsync(loginDto.UserNameOrEmail).Result;

            if (user is null)
            {
                return Results.BadRequest("Invalid username/email or password.");
            }

            var passwordValid = userManager.CheckPasswordAsync(user, loginDto.Password).Result;
            if (!passwordValid)
            {
                return Results.BadRequest("Invalid username/email or password.");
            }

            // 2- Generate JWT token 
            var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.Value.JWTSecret));

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim("UserID", user.Id.ToString()),
                    new Claim("FullName", user.FullName),
                    new Claim("UserName", user.UserName?? "")
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var securityToken = tokenHandler.CreateToken(tokenDescriptor);
            var token = tokenHandler.WriteToken(securityToken);

            return Results.Ok(token);
        }

    }
}
