using AuthECAPI.DTOs;
using AuthECAPI.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace AuthECAPI.Controllers
{
    public static class UserEndpoints
    {
        public static IEndpointRouteBuilder MapUserEndpoints(this IEndpointRouteBuilder app)
        {
            var group = app.MapGroup("/api/users")
                            .WithTags("Users");

            group.MapPost("/signup", SignUp);

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

    }
}
