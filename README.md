# Gestão de Livros (ASP.NET Core)

Aplicação em C# ASP.NET Core MVC para gerir livros com:
- Título, autor e tipo/género.
- Checkbox para indicar se já tens o livro (vem ativo por defeito ao adicionar).
- Edição, remoção, pesquisa e alternância rápida do estado.
- Interface responsiva (desktop + telemóvel).
- Instalação como app (PWA) no telemóvel e no computador.

## Como executar

1. Entrar na pasta do projeto:
   ```bash
   cd BookManager
   ```
2. Restaurar e correr:
   ```bash
   dotnet restore
   dotnet run
   ```
3. Abrir o URL indicado no terminal.

## Base de dados

- SQLite local: `BookManager/books.db`
- É criada automaticamente no primeiro arranque.

## Instalar como app (PWA)

- **No telemóvel**: abrir no browser e escolher **Adicionar ao ecrã principal**.
- **No computador**: no browser (Chrome/Edge), usar **Instalar aplicação**.

