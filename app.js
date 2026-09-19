(function () {
  'use strict';

  const STORAGE_KEY = 'todos';

  const form = document.getElementById('todo-form');
  const input = document.getElementById('todo-input');
  const list = document.getElementById('todo-list');

  /** Load todos from localStorage, defaulting to an empty array. */
  function loadTodos() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return [];
    }
  }

  /** Persist the current todos array to localStorage. */
  function saveTodos(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }

  let todos = loadTodos();

  function render() {
    list.innerHTML = '';

    if (todos.length === 0) {
      const empty = document.createElement('li');
      empty.className = 'empty-message';
      empty.textContent = 'No todos yet. Add one above!';
      list.appendChild(empty);
      return;
    }

    todos.forEach((todo) => {
      const li = document.createElement('li');
      li.className = 'todo-item' + (todo.completed ? ' completed' : '');
      li.dataset.id = todo.id;

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = todo.completed;
      checkbox.className = 'toggle-checkbox';

      const text = document.createElement('span');
      text.className = 'todo-text';
      text.textContent = todo.text;

      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'delete-btn';
      deleteBtn.textContent = '✕';
      deleteBtn.setAttribute('aria-label', 'Delete todo');

      li.appendChild(checkbox);
      li.appendChild(text);
      li.appendChild(deleteBtn);
      list.appendChild(li);
    });
  }

  function addTodo(text) {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }
    todos.push({ id: Date.now(), text: trimmed, completed: false });
    saveTodos(todos);
    render();
  }

  function toggleTodo(id) {
    todos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos(todos);
    render();
  }

  function deleteTodo(id) {
    todos = todos.filter((todo) => todo.id !== id);
    saveTodos(todos);
    render();
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    addTodo(input.value);
    input.value = '';
    input.focus();
  });

  // Event delegation for toggle/delete on list items.
  list.addEventListener('click', (event) => {
    const li = event.target.closest('.todo-item');
    if (!li) {
      return;
    }
    const id = Number(li.dataset.id);

    if (event.target.classList.contains('toggle-checkbox')) {
      toggleTodo(id);
    } else if (event.target.classList.contains('delete-btn')) {
      deleteTodo(id);
    }
  });

  render();
})();
