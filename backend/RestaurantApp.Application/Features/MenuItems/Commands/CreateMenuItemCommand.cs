using MediatR;
using RestaurantApp.Domain.Entities;

namespace RestaurantApp.Application.Features.MenuItems.Commands;

public record CreateMenuItemCommand(string Name, string? Description, decimal Price, int CategoryId, string? ImageUrl) : IRequest<int>;

public class CreateMenuItemCommandHandler : IRequestHandler<CreateMenuItemCommand, int>
{
    private readonly IAppDbContext _context;

    public CreateMenuItemCommandHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreateMenuItemCommand request, CancellationToken cancellationToken)
    {
        var menuItem = new MenuItem
        {
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            CategoryId = request.CategoryId,
            ImageUrl = request.ImageUrl
        };

        _context.MenuItems.Add(menuItem);
        await _context.SaveChangesAsync(cancellationToken);

        return menuItem.Id;
    }
}
