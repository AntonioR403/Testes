using BookManager.Models;

namespace BookManager.ViewModels;

public class BooksIndexViewModel
{
    public IReadOnlyList<Book> Books { get; set; } = [];
    public string? Search { get; set; }
    public string? GenreFilter { get; set; }
    public string Sort { get; set; } = "title_az";
    public IReadOnlyList<string> AvailableGenres { get; set; } = BookGenres.All;
}
