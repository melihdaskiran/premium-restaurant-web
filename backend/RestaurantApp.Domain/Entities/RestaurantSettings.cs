namespace RestaurantApp.Domain.Entities;

public class RestaurantSettings
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? Phone { get; set; }
    public string? WorkingHours { get; set; }
    public string? InstagramUrl { get; set; }
    public string? LogoUrl { get; set; }
    public string PrimaryColor { get; set; } = "#D4AF37"; // Default Gold
    
    // Dynamic Homepage Texts
    public string HeroTitle { get; set; } = "A Symphony of Flavors";
    public string HeroSubtitle { get; set; } = "Experience the pinnacle of culinary artistry, where traditional techniques meet modern innovation.";
    public string VisionTitle { get; set; } = "Art on a Plate. Passion in Every Bite.";
    public string VisionText { get; set; } = "At L'Etoile, dining is not merely a necessity, but an art form that speaks to the soul. We blend carefully selected ingredients from around the world with classical French gastronomy techniques to offer an unforgettable experience.\n\nEvery plate is a reflection of our culinary team's passion and pursuit of perfection. We invite you to join us on this unique journey of flavors.";
    public string VisionChefName { get; set; } = "Alexander Rossi";
    public string CtaTitle { get; set; } = "Unforgettable Evenings Await";
    public string CtaText { get; set; } = "Reserve your table today and immerse yourself in an atmosphere of elegance, warmth, and culinary brilliance.";
}
