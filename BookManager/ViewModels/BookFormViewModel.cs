using System.ComponentModel.DataAnnotations;
using BookManager.Models;

namespace BookManager.ViewModels;

public class BookFormViewModel
{
    public int? Id { get; set; }

    [Required(ErrorMessage = "O título é obrigatório")]
    [StringLength(150)]
    public string Title { get; set; } = string.Empty;

    [Required(ErrorMessage = "O autor/nome é obrigatório")]
    [StringLength(120)]
    public string Author { get; set; } = string.Empty;

    [Display(Name = "Já tenho este livro")]
    public bool IsOwned { get; set; } = true;

    [Display(Name = "Tipos de livro")]
    public List<string> SelectedGenres { get; set; } = [];

    public IReadOnlyList<string> AvailableGenres { get; set; } = BookGenres.All;

    public string? ErrorMessage { get; set; }
}
