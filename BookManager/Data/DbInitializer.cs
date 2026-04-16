using BookManager.Models;

namespace BookManager.Data;

public static class DbInitializer
{
    public static void Seed(AppDbContext db)
    {
        if (db.Books.Any())
        {
            return;
        }

        db.Books.AddRange(
            new Book
            {
                Title = "Dom Quixote",
                Author = "Miguel de Cervantes",
                GenresCsv = BookGenres.Normalize(["Clássico", "Romance", "Comédia"]),
                IsOwned = true,
                CreatedAt = DateTime.UtcNow.AddDays(-3)
            },
            new Book
            {
                Title = "Os Maias",
                Author = "Eça de Queirós",
                GenresCsv = BookGenres.Normalize(["Clássico", "Drama", "Romance"]),
                IsOwned = false,
                CreatedAt = DateTime.UtcNow.AddDays(-1)
            }
        );

        db.SaveChanges();
    }
}
