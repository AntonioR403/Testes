using BookManager.Data;
using BookManager.Models;
using BookManager.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookManager.Controllers;

public class BooksController(AppDbContext db) : Controller
{
    public async Task<IActionResult> Index(string? search, string? genre, string? sort = "title_az")
    {
        var query = db.Books.AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(b =>
                b.Title.ToLower().Contains(term) ||
                b.Author.ToLower().Contains(term) ||
                b.GenresCsv.ToLower().Contains(term) ||
                b.CreatedAt.ToString("yyyy-MM-dd").Contains(term) ||
                b.CreatedAt.ToString("dd/MM/yyyy").Contains(term));
        }

        if (!string.IsNullOrWhiteSpace(genre))
        {
            var genreTerm = genre.Trim().ToLower();
            query = query.Where(b => b.GenresCsv.ToLower().Contains(genreTerm));
        }

        query = sort switch
        {
            "title_za" => query.OrderByDescending(b => b.Title),
            "author_az" => query.OrderBy(b => b.Author),
            "author_za" => query.OrderByDescending(b => b.Author),
            "genre_az" => query.OrderBy(b => b.GenresCsv),
            "genre_za" => query.OrderByDescending(b => b.GenresCsv),
            "date_new_old" => query.OrderByDescending(b => b.CreatedAt),
            "date_old_new" => query.OrderBy(b => b.CreatedAt),
            _ => query.OrderBy(b => b.Title)
        };

        var vm = new BooksIndexViewModel
        {
            Books = await query.ToListAsync(),
            Search = search,
            GenreFilter = genre,
            Sort = sort ?? "title_az"
        };

        return View(vm);
    }

    public IActionResult Create()
    {
        return View(new BookFormViewModel());
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(BookFormViewModel vm)
    {
        if (!vm.SelectedGenres.Any())
        {
            vm.ErrorMessage = "Seleciona pelo menos um tipo de livro.";
        }

        if (!ModelState.IsValid || !vm.SelectedGenres.Any())
        {
            vm.AvailableGenres = BookGenres.All;
            return View(vm);
        }

        var book = new Book
        {
            Title = vm.Title,
            Author = vm.Author,
            GenresCsv = BookGenres.Normalize(vm.SelectedGenres),
            IsOwned = vm.IsOwned,
            CreatedAt = DateTime.UtcNow
        };

        db.Books.Add(book);
        await db.SaveChangesAsync();

        TempData["Success"] = "Livro adicionado com sucesso.";
        return RedirectToAction(nameof(Index));
    }

    public async Task<IActionResult> Edit(int id)
    {
        var book = await db.Books.FindAsync(id);
        if (book is null)
        {
            return NotFound();
        }

        var vm = new BookFormViewModel
        {
            Id = book.Id,
            Title = book.Title,
            Author = book.Author,
            IsOwned = book.IsOwned,
            SelectedGenres = BookGenres.Parse(book.GenresCsv).ToList()
        };

        return View(vm);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int id, BookFormViewModel vm)
    {
        if (vm.Id != id)
        {
            return BadRequest();
        }

        if (!vm.SelectedGenres.Any())
        {
            vm.ErrorMessage = "Seleciona pelo menos um tipo de livro.";
        }

        if (!ModelState.IsValid || !vm.SelectedGenres.Any())
        {
            vm.AvailableGenres = BookGenres.All;
            return View(vm);
        }

        var existing = await db.Books.FindAsync(id);
        if (existing is null)
        {
            return NotFound();
        }

        existing.Title = vm.Title;
        existing.Author = vm.Author;
        existing.GenresCsv = BookGenres.Normalize(vm.SelectedGenres);
        existing.IsOwned = vm.IsOwned;

        await db.SaveChangesAsync();

        TempData["Success"] = "Livro atualizado com sucesso.";
        return RedirectToAction(nameof(Index));
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Delete(int id)
    {
        var book = await db.Books.FindAsync(id);
        if (book is null)
        {
            return NotFound();
        }

        db.Books.Remove(book);
        await db.SaveChangesAsync();

        TempData["Success"] = "Livro removido com sucesso.";
        return RedirectToAction(nameof(Index));
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> ToggleOwned(int id)
    {
        var book = await db.Books.FindAsync(id);
        if (book is null)
        {
            return NotFound();
        }

        book.IsOwned = !book.IsOwned;
        await db.SaveChangesAsync();

        return RedirectToAction(nameof(Index));
    }
}
