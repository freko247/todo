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

  // Id of the todo currently being edited (in-place), or null if none.
  let editingId = null;

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

      li.appendChild(checkbox);

      if (todo.id === editingId) {
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.className = 'todo-edit-input';
        editInput.value = todo.text;
        li.appendChild(editInput);

        // Focus and select once the input is in the DOM.
        requestAnimationFrame(() => {
          editInput.focus();
          editInput.select();
        });
      } else {
        const text = document.createElement('span');
        text.className = 'todo-text';
        text.textContent = todo.text;
        li.appendChild(text);
      }

      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = 'edit-btn';
      editBtn.textContent = '✎';
      editBtn.setAttribute('aria-label', 'Edit todo');

      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'delete-btn';
      deleteBtn.textContent = '✕';
      deleteBtn.setAttribute('aria-label', 'Delete todo');

      li.appendChild(editBtn);
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
    if (editingId === id) {
      editingId = null;
    }
    saveTodos(todos);
    render();
  }

  /** Save the edited text for a todo, or exit edit mode without saving if empty. */
  function editTodo(id, newText) {
    const trimmed = newText.trim();
    if (!trimmed) {
      editingId = null;
      render();
      return;
    }
    todos = todos.map((todo) =>
      todo.id === id ? { ...todo, text: trimmed } : todo
    );
    saveTodos(todos);
    editingId = null;
    render();
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    addTodo(input.value);
    input.value = '';
    input.focus();
  });

  // Event delegation for toggle/delete/edit on list items.
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
    } else if (event.target.classList.contains('edit-btn')) {
      editingId = id;
      render();
    }
  });

  // Save/cancel handling for the in-place edit input.
  list.addEventListener(
    'keydown',
    (event) => {
      if (!event.target.classList.contains('todo-edit-input')) {
        return;
      }
      const li = event.target.closest('.todo-item');
      if (!li) {
        return;
      }
      const id = Number(li.dataset.id);

      if (event.key === 'Enter') {
        editTodo(id, event.target.value);
      } else if (event.key === 'Escape') {
        editingId = null;
        render();
      }
    }
  );

  // Save on click-away (blur) from the edit input.
  list.addEventListener(
    'blur',
    (event) => {
      if (!event.target.classList.contains('todo-edit-input')) {
        return;
      }
      const li = event.target.closest('.todo-item');
      if (!li) {
        return;
      }
      const id = Number(li.dataset.id);
      editTodo(id, event.target.value);
    },
    true
  );

  render();
})();
