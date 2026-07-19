namespace RestaurantApp.Domain.Entities;

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int DisplayOrder { get; set; }
    
    // Navigation property
    public ICollection<MenuItem> MenuItems { get; set; } = new List<MenuItem>();
}
