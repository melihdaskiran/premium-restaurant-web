using MediatR;
using Microsoft.EntityFrameworkCore;
using RestaurantApp.Domain.Entities;

namespace RestaurantApp.Application.Features.MenuItems.Queries;

public record GetMenuItemsQuery(int? CategoryId) : IRequest<List<MenuItemDto>>;

public record MenuItemDto(int Id, string Name, string? Description, decimal Price, string? ImageUrl, int CategoryId, string CategoryName);

public class GetMenuItemsQueryHandler : IRequestHandler<GetMenuItemsQuery, List<MenuItemDto>>
{
    private readonly IAppDbContext _context;

    public GetMenuItemsQueryHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<List<MenuItemDto>> Handle(GetMenuItemsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.MenuItems.Include(m => m.Category).AsQueryable();

        if (request.CategoryId.HasValue)
        {
            query = query.Where(m => m.CategoryId == request.CategoryId.Value);
        }

        return await query
            .OrderBy(m => m.Category.DisplayOrder).ThenBy(m => m.Name)
            .Select(m => new MenuItemDto(m.Id, m.Name, m.Description, m.Price, m.ImageUrl, m.CategoryId, m.Category.Name))
            .ToListAsync(cancellationToken);
    }
}
