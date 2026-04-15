using System.ComponentModel.DataAnnotations;

namespace BookManager.Models;

public class Book
{
    public int Id { get; set; }

    [Required(ErrorMessage = "O título é obrigatório")]
    [StringLength(150)]
    public string Title { get; set; } = string.Empty;

    [Required(ErrorMessage = "O autor é obrigatório")]
    [StringLength(120)]
    public string Author { get; set; } = string.Empty;

    [Required(ErrorMessage = "O tipo/género é obrigatório")]
    [StringLength(80)]
    public string Genre { get; set; } = string.Empty;

    [Display(Name = "Já tenho este livro")]
    public bool IsOwned { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
