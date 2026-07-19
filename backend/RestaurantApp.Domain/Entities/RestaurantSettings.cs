namespace RestaurantApp.Domain.Entities;

public class RestaurantSettings
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? Phone { get; set; }
    public string? WorkingHours { get; set; }
    public string? InstagramUrl { get; set; }
}
