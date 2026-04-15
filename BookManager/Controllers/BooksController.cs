using BookManager.Data;
using BookManager.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookManager.Controllers;

public class BooksController(AppDbContext db) : Controller
{
    public async Task<IActionResult> Index(string? q)
    {
        var query = db.Books.AsQueryable();

        if (!string.IsNullOrWhiteSpace(q))
        {
            var term = q.Trim().ToLower();
            query = query.Where(b =>
                b.Title.ToLower().Contains(term) ||
                b.Author.ToLower().Contains(term) ||
                b.Genre.ToLower().Contains(term));
        }

        var books = await query
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();

        ViewBag.Query = q;
        return View(books);
    }

    public IActionResult Create()
    {
        return View(new Book { IsOwned = true });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(Book book)
    {
        if (!ModelState.IsValid)
        {
            return View(book);
        }

        book.CreatedAt = DateTime.UtcNow;
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

        return View(book);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int id, Book book)
    {
        if (id != book.Id)
        {
            return BadRequest();
        }

        if (!ModelState.IsValid)
        {
            return View(book);
        }

        var existing = await db.Books.FindAsync(id);
        if (existing is null)
        {
            return NotFound();
        }

        existing.Title = book.Title;
        existing.Author = book.Author;
        existing.Genre = book.Genre;
        existing.IsOwned = book.IsOwned;

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
