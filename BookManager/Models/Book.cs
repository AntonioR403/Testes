using System.ComponentModel.DataAnnotations;

namespace BookManager.Models;

public class Book
{
    public int Id { get; set; }

    [Required(ErrorMessage = "O título é obrigatório")]
    [StringLength(150)]
    public string Title { get; set; } = string.Empty;

    [Required(ErrorMessage = "O autor/nome é obrigatório")]
    [StringLength(120)]
    public string Author { get; set; } = string.Empty;

    [Required(ErrorMessage = "É obrigatório selecionar pelo menos um tipo")]
    [StringLength(600)]
    public string GenresCsv { get; set; } = string.Empty;

    [Display(Name = "Já tenho este livro")]
    public bool IsOwned { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
