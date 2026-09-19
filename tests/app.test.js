'use strict';

// Minimal in-memory localStorage stub so app.js can be required under Node.
const store = new Map();
globalThis.localStorage = {
  getItem(key) {
    return store.has(key) ? store.get(key) : null;
  },
  setItem(key, value) {
    store.set(key, String(value));
  },
  removeItem(key) {
    store.delete(key);
  },
  clear() {
    store.clear();
  },
};

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  addTodoToList,
  toggleTodoInList,
  deleteTodoFromList,
  loadTodos,
  saveTodos,
} = require('../app.js');

test('addTodoToList adds a trimmed non-empty todo with completed: false', () => {
  const result = addTodoToList([], '  Buy milk  ');
  assert.equal(result.length, 1);
  assert.equal(result[0].text, 'Buy milk');
  assert.equal(result[0].completed, false);
  assert.equal(typeof result[0].id, 'number');
});

test('addTodoToList ignores empty/whitespace-only input', () => {
  const original = [];
  const result = addTodoToList(original, '   ');
  assert.deepEqual(result, []);
});

test('addTodoToList does not mutate the input array', () => {
  const original = [];
  addTodoToList(original, 'Task');
  assert.deepEqual(original, []);
});

test('toggleTodoInList flips completed for the matching id, leaves others untouched', () => {
  const todos = [
    { id: 1, text: 'A', completed: false },
    { id: 2, text: 'B', completed: false },
  ];
  const result = toggleTodoInList(todos, 1);
  assert.equal(result[0].completed, true);
  assert.equal(result[1].completed, false);
});

test('toggleTodoInList is a no-op when id does not match any todo', () => {
  const todos = [{ id: 1, text: 'A', completed: false }];
  const result = toggleTodoInList(todos, 999);
  assert.deepEqual(result, todos);
});

test('deleteTodoFromList removes the todo with the matching id', () => {
  const todos = [
    { id: 1, text: 'A', completed: false },
    { id: 2, text: 'B', completed: false },
  ];
  const result = deleteTodoFromList(todos, 1);
  assert.deepEqual(result, [{ id: 2, text: 'B', completed: false }]);
});

test('deleteTodoFromList leaves the array unchanged when id does not match', () => {
  const todos = [{ id: 1, text: 'A', completed: false }];
  const result = deleteTodoFromList(todos, 999);
  assert.deepEqual(result, todos);
});

test('loadTodos returns [] when localStorage is empty', () => {
  store.clear();
  assert.deepEqual(loadTodos(), []);
});

test('loadTodos returns the parsed array when valid JSON is stored', () => {
  store.clear();
  const todos = [{ id: 1, text: 'A', completed: false }];
  store.set('todos', JSON.stringify(todos));
  assert.deepEqual(loadTodos(), todos);
});

test('loadTodos returns [] (not throws) when stored JSON is malformed', () => {
  store.clear();
  store.set('todos', '{not valid json');
  assert.deepEqual(loadTodos(), []);
});

test('loadTodos returns [] when stored JSON is not an array', () => {
  store.clear();
  store.set('todos', JSON.stringify({ not: 'an array' }));
  assert.deepEqual(loadTodos(), []);
});

test('saveTodos writes the JSON-serialized array to localStorage under the todos key', () => {
  store.clear();
  const todos = [{ id: 1, text: 'A', completed: false }];
  saveTodos(todos);
  assert.equal(store.get('todos'), JSON.stringify(todos));
});
