# Gestão de Livros (ASP.NET Core)

Aplicação em C# ASP.NET Core MVC para gerir livros com:
- Título, nome/autor, tipos de livro (seleção por checkboxes) e estado de posse.
- Checkbox para indicar se já tens o livro (vem ativo por defeito ao adicionar).
- Pesquisa por nome, título, tipo e added date.
- Filtro por tipo específico.
- Ordenação por:
  - Título (A-Z / Z-A)
  - Nome/autor (A-Z / Z-A)
  - Tipo (A-Z / Z-A)
  - Added date (mais recente → mais antigo / mais antigo → mais recente)
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
- Em caso de atualização de versão da app, apaga `BookManager/books.db` para recriar a estrutura mais recente.

## Instalar como app (PWA)

- **No telemóvel**: abrir no browser e escolher **Adicionar ao ecrã principal**.
- **No computador**: no browser (Chrome/Edge), usar **Instalar aplicação**.
