using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RestaurantApp.Application;
using RestaurantApp.Application.Features.Categories.Queries;
using RestaurantApp.Application.Features.MenuItems.Queries;
using RestaurantApp.Infrastructure.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddOpenApi();

// Register DbContext (SQLite)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register IAppDbContext to use in Application layer
builder.Services.AddScoped<IAppDbContext>(provider => provider.GetRequiredService<AppDbContext>());

// Register MediatR
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(RestaurantApp.Application.AssemblyReference).Assembly));

// CORS policy for Next.js frontend
// WE ARE ALLOWING CREDENTIALS (COOKIES)
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials(); // Important for setting HTTP-Only cookies
        });
});

// Configure JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? "SuperSecretKeyForRestaurantAppThatIsLongEnough123!!";
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                context.Token = context.Request.Cookies["admin_token"];
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("FrontendPolicy");
app.UseHttpsRedirection();
app.UseStaticFiles();

// Auth Middleware
app.UseAuthentication();
app.UseAuthorization();

// Create database and apply migrations at startup
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.EnsureCreated(); // Will trigger OnModelCreating and seed Admin
}

// -----------------------------
// ENDPOINTS
// -----------------------------

var api = app.MapGroup("/api");

// ----- AUTH ENDPOINTS -----
api.MapPost("/auth/login", async (LoginRequest req, IAppDbContext db, IConfiguration config, HttpContext httpContext) =>
{
    var user = await db.AdminUsers.FirstOrDefaultAsync(u => u.Username == req.Username);
    if (user == null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
    {
        return Results.Unauthorized();
    }

    // Generate JWT
    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
    var token = new JwtSecurityToken(
        issuer: config["Jwt:Issuer"],
        audience: config["Jwt:Audience"],
        claims: new[] { new Claim(ClaimTypes.Name, user.Username) },
        expires: DateTime.UtcNow.AddHours(2),
        signingCredentials: creds
    );

    var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

    // Set HTTP-Only Cookie
    httpContext.Response.Cookies.Append("admin_token", tokenString, new CookieOptions
    {
        HttpOnly = true,
        Secure = true, // Set to true even in localhost for Next.js if using https, but we'll use SameSiteMode.Strict
        SameSite = SameSiteMode.Strict,
        Expires = DateTimeOffset.UtcNow.AddHours(2)
    });

    return Results.Ok(new { message = "Logged in successfully" });
});

api.MapPost("/auth/change-password", async (ChangePasswordRequest req, IAppDbContext db, HttpContext httpContext) =>
{
    // Ensure the user is authenticated via cookie
    var token = httpContext.Request.Cookies["admin_token"];
    if (string.IsNullOrEmpty(token)) return Results.Unauthorized();

    // Ideally, validate token here or rely on [Authorize] attribute, but since we are using cookie manually:
    // Let's use standard Authorize attribute for this endpoint.
    var username = httpContext.User.Identity?.Name;
    if (string.IsNullOrEmpty(username)) return Results.Unauthorized();

    var user = await db.AdminUsers.FirstOrDefaultAsync(u => u.Username == username);
    if (user == null || !BCrypt.Net.BCrypt.Verify(req.CurrentPassword, user.PasswordHash))
    {
        return Results.BadRequest("Mevcut şifreniz hatalı.");
    }

    user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.NewPassword);
    await db.SaveChangesAsync(CancellationToken.None);

    return Results.Ok(new { message = "Şifre başarıyla güncellendi." });
}).RequireAuthorization(); // Requires valid JWT

api.MapPost("/auth/change-username", async (ChangeUsernameRequest req, IAppDbContext db, HttpContext httpContext) =>
{
    var token = httpContext.Request.Cookies["admin_token"];
    if (string.IsNullOrEmpty(token)) return Results.Unauthorized();

    var username = httpContext.User.Identity?.Name;
    if (string.IsNullOrEmpty(username)) return Results.Unauthorized();

    var user = await db.AdminUsers.FirstOrDefaultAsync(u => u.Username == username);
    if (user == null || !BCrypt.Net.BCrypt.Verify(req.CurrentPassword, user.PasswordHash))
    {
        return Results.BadRequest("Mevcut şifreniz hatalı.");
    }

    if (string.IsNullOrWhiteSpace(req.NewUsername))
        return Results.BadRequest("Yeni kullanıcı adı boş olamaz.");

    // Check if new username is already taken by someone else
    if (await db.AdminUsers.AnyAsync(u => u.Username == req.NewUsername && u.Id != user.Id))
        return Results.BadRequest("Bu kullanıcı adı zaten kullanımda.");

    user.Username = req.NewUsername;
    await db.SaveChangesAsync(CancellationToken.None);

    return Results.Ok(new { message = "Kullanıcı adı başarıyla güncellendi. Lütfen yeni adınızla tekrar giriş yapın." });
}).RequireAuthorization();

// Auth Check endpoint
api.MapGet("/auth/check", (HttpContext httpContext) => 
{
    var token = httpContext.Request.Cookies["admin_token"];
    if(string.IsNullOrEmpty(token)) return Results.Unauthorized();
    
    return Results.Ok(new { authenticated = true });
});

api.MapPost("/auth/logout", (HttpContext httpContext) =>
{
    httpContext.Response.Cookies.Delete("admin_token");
    return Results.Ok();
});

// ----- DATA ENDPOINTS -----
api.MapGet("/categories", async (IMediator mediator) =>
{
    var result = await mediator.Send(new GetCategoriesQuery());
    return Results.Ok(result);
});

api.MapGet("/menu-items", async (int? categoryId, IMediator mediator) =>
{
    var result = await mediator.Send(new GetMenuItemsQuery(categoryId));
    return Results.Ok(result);
});

api.MapPost("/menu-items", async (RestaurantApp.Application.Features.MenuItems.Commands.CreateMenuItemCommand command, IMediator mediator) =>
{
    var id = await mediator.Send(command);
    return Results.Created($"/api/menu-items/{id}", new { id });
}).RequireAuthorization(); // Protect with JWT

api.MapPut("/menu-items/{id}", async (int id, RestaurantApp.Domain.Entities.MenuItem updatedItem, IAppDbContext db) =>
{
    var item = await db.MenuItems.FindAsync(id);
    if (item == null) return Results.NotFound();

    item.Name = updatedItem.Name;
    item.Description = updatedItem.Description;
    item.Price = updatedItem.Price;
    item.ImageUrl = updatedItem.ImageUrl;
    item.CategoryId = updatedItem.CategoryId;

    await db.SaveChangesAsync(CancellationToken.None);
    return Results.NoContent();
}).RequireAuthorization();

api.MapDelete("/menu-items/{id}", async (int id, IAppDbContext db) =>
{
    var item = await db.MenuItems.FindAsync(id);
    if (item == null) return Results.NotFound();

    db.MenuItems.Remove(item);
    await db.SaveChangesAsync(CancellationToken.None);
    return Results.NoContent();
}).RequireAuthorization();

// Photo Upload Endpoint
api.MapPost("/upload", async (IFormFile file, IWebHostEnvironment env) =>
{
    if (file == null || file.Length == 0) return Results.BadRequest("No file uploaded");

    var uploadsFolder = Path.Combine(env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads");
    if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

    var uniqueFileName = Guid.NewGuid().ToString() + "_" + file.FileName;
    var filePath = Path.Combine(uploadsFolder, uniqueFileName);

    using (var fileStream = new FileStream(filePath, FileMode.Create))
    {
        await file.CopyToAsync(fileStream);
    }

    return Results.Ok(new { url = $"/uploads/{uniqueFileName}" });
}).RequireAuthorization();

// Settings Endpoints
api.MapGet("/settings", async (IAppDbContext db) =>
{
    var settings = await db.Settings.FirstOrDefaultAsync();
    return settings != null ? Results.Ok(settings) : Results.NotFound();
});

api.MapPut("/settings", async (RestaurantApp.Domain.Entities.RestaurantSettings updatedSettings, IAppDbContext db) =>
{
    var settings = await db.Settings.FirstOrDefaultAsync();
    if (settings == null) return Results.NotFound();

    settings.Name = updatedSettings.Name;
    settings.LogoUrl = updatedSettings.LogoUrl;
    settings.PrimaryColor = updatedSettings.PrimaryColor;
    
    await db.SaveChangesAsync(CancellationToken.None);
    return Results.Ok(settings);
}).RequireAuthorization();

app.Run();

// DTOs for Auth
public record LoginRequest(string Username, string Password);
public record ChangePasswordRequest(string CurrentPassword, string NewPassword);
public record ChangeUsernameRequest(string CurrentPassword, string NewUsername);
