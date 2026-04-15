using BookManager.Models;
using Microsoft.EntityFrameworkCore;

namespace BookManager.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Book> Books => Set<Book>();
}
