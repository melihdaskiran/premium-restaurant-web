using Microsoft.EntityFrameworkCore;
using RestaurantApp.Application;
using RestaurantApp.Domain.Entities;

namespace RestaurantApp.Infrastructure.Data;

public class AppDbContext : DbContext, IAppDbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Category> Categories { get; set; } = null!;
    public DbSet<MenuItem> MenuItems { get; set; } = null!;
    public DbSet<RestaurantSettings> Settings { get; set; } = null!;
    public DbSet<AdminUser> AdminUsers { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Seed some initial data
        modelBuilder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "Başlangıçlar", DisplayOrder = 1 },
            new Category { Id = 2, Name = "Ana Yemekler", DisplayOrder = 2 },
            new Category { Id = 3, Name = "Tatlılar", DisplayOrder = 3 },
            new Category { Id = 4, Name = "İçecekler", DisplayOrder = 4 }
        );

        modelBuilder.Entity<RestaurantSettings>().HasData(
            new RestaurantSettings 
            { 
                Id = 1, 
                Name = "My Restaurant", 
                Address = "123 Main St", 
                Phone = "555-0100",
                WorkingHours = "09:00 - 22:00"
            }
        );

        modelBuilder.Entity<AdminUser>().HasData(
            new AdminUser
            {
                Id = 1,
                Username = "admin",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("password")
            }
        );
    }
}
