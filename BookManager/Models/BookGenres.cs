namespace BookManager.Models;

public static class BookGenres
{
    public static readonly IReadOnlyList<string> All =
    [
        "Ação e Aventura",
        "Arte e Fotografia",
        "Autoajuda",
        "Biografia",
        "Ciência",
        "Ciência Ficção",
        "Clássico",
        "Comédia",
        "Conto",
        "Desenvolvimento Pessoal",
        "Drama",
        "Educação",
        "Ensaio",
        "Fantasia",
        "Ficção Histórica",
        "Filosofia",
        "Finanças",
        "Gastronomia",
        "História",
        "Horror",
        "Infantil",
        "Jovem Adulto",
        "Literatura Portuguesa",
        "Mistério",
        "Negócios",
        "Poesia",
        "Policial",
        "Religião",
        "Romance",
        "Saúde e Bem-estar",
        "Suspense",
        "Tecnologia",
        "Thriller",
        "Turismo e Viagens"
    ];

    public static string Normalize(IEnumerable<string> genres)
    {
        return string.Join(", ", genres
            .Where(g => !string.IsNullOrWhiteSpace(g))
            .Select(g => g.Trim())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .OrderBy(g => g));
    }

    public static IReadOnlyList<string> Parse(string? csv)
    {
        if (string.IsNullOrWhiteSpace(csv))
        {
            return [];
        }

        return csv.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .OrderBy(g => g)
            .ToList();
    }
}
