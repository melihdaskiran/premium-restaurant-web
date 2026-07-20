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
                Name = "L'Etoile", 
                Address = "123 Culinary Avenue", 
                Phone = "+1 (555) 0123-456", 
                WorkingHours = "18:00 - 23:00",
                PrimaryColor = "#D4AF37",
                LogoUrl = "",
                HeroTitle = "A Symphony of Flavors",
                HeroSubtitle = "Experience the pinnacle of culinary artistry, where traditional techniques meet modern innovation.",
                VisionTitle = "Art on a Plate. Passion in Every Bite.",
                VisionText = "At L'Etoile, dining is not merely a necessity, but an art form that speaks to the soul. We blend carefully selected ingredients from around the world with classical French gastronomy techniques to offer an unforgettable experience.\n\nEvery plate is a reflection of our culinary team's passion and pursuit of perfection. We invite you to join us on this unique journey of flavors.",
                VisionChefName = "Alexander Rossi",
                CtaTitle = "Unforgettable Evenings Await",
                CtaText = "Reserve your table today and immerse yourself in an atmosphere of elegance, warmth, and culinary brilliance."
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
