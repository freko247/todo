# Todo

A simple todo list app built with plain HTML, CSS, and JavaScript — no frameworks, no build
tooling, no npm dependencies required.

## Running

No build step is required. Either:

- Open `index.html` directly in a browser, or
- Serve the folder with any static file server, e.g.:

  ```bash
  python3 -m http.server
  ```

  then visit `http://localhost:8000`.

## Features

- Add a new todo
- Mark a todo as complete / uncomplete
- Delete a todo
- Todos persist across page reloads via `localStorage`

## Running tests

Tests use Node's built-in test runner (Node 18+), no dependencies required:

```bash
node --test tests/
```

Or, via npm:

```bash
npm test
```
