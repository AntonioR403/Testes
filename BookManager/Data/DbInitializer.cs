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
                Genre = "Romance",
                IsOwned = true,
                CreatedAt = DateTime.UtcNow
            },
            new Book
            {
                Title = "Os Maias",
                Author = "Eça de Queirós",
                Genre = "Clássico",
                IsOwned = false,
                CreatedAt = DateTime.UtcNow
            }
        );

        db.SaveChanges();
    }
}
