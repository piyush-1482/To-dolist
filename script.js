/* Vanilla JS Todo — IIFE to avoid globals.
   Features: add, toggle, edit, delete (confirm), filters, clear completed (confirm),
   drag-and-drop reorder, localStorage persistence, ARIA announcements, dark mode toggle.
*/
(function () {
  const STORAGE_KEY = 'todo:v1';
  const FILTER_KEY = 'todo:filter';
  const THEME_KEY = 'todo:theme';

  const listEl = document.getElementById('todo-list');
  const form = document.getElementById('todo-form');
  const input = document.getElementById('todo-input');
  const countEl = document.getElementById('todo-count');
  const clearCompletedBtn = document.getElementById('clear-completed');
  const filters = Array.from(document.querySelectorAll('.todo__filter'));
  const announcer = document.getElementById('announcer');

  // 🌙 Dark mode toggle (Navbar)
  const themeToggleBtn = document.getElementById('theme-toggle');

  // In-memory state
  let tasks = load() || [];
  let domIndex = new Map(); // id -> li element
  let currentFilter = localStorage.getItem(FILTER_KEY) || 'all';

  // Utilities
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  function announce(msg) { if (announcer) announcer.textContent = msg; }

  // 🌟 Theme load on init
  function loadTheme() {
    const theme = localStorage.getItem(THEME_KEY) || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    if (themeToggleBtn) {
      themeToggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(THEME_KEY, next);
    if (themeToggleBtn) {
      themeToggleBtn.textContent = next === 'dark' ? '☀️' : '🌙';
    }
  }

  // Initial render
  function init() {
    applyFilterUI();
    tasks.forEach(task => {
      const li = createTaskElement(task);
      listEl.appendChild(li);
      domIndex.set(task.id, li);
    });
    updateCount();
    bindEvents();
    loadTheme(); // 🌙 apply theme on load
  }

  // Create a single task list item
  function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = 'todo__item';
    li.setAttribute('data-id', task.id);
    li.setAttribute('draggable', 'true');
    li.tabIndex = -1;

    // Checkbox
    const chk = document.createElement('input');
    chk.type = 'checkbox';
    chk.className = 'todo__checkbox';
    chk.checked = !!task.done;
    chk.setAttribute('aria-label', task.done ? `Mark "${task.text}" as active` : `Mark "${task.text}" as completed`);
    chk.addEventListener('change', () => toggleDone(task.id));

    // Text
    const txt = document.createElement('div');
    txt.className = 'todo__text' + (task.done ? ' todo__text--done' : '');
    txt.textContent = task.text;
    txt.title = 'Double-click to edit';
    txt.addEventListener('dblclick', () => startEdit(task.id));

    // Actions
    const actions = document.createElement('div');
    actions.className = 'todo__actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'todo__btn';
    editBtn.type = 'button';
    editBtn.title = 'Edit';
    editBtn.innerHTML = '✏️';
    editBtn.addEventListener('click', () => startEdit(task.id));

    const delBtn = document.createElement('button');
    delBtn.className = 'todo__btn';
    delBtn.type = 'button';
    delBtn.title = 'Delete';
    delBtn.innerHTML = '🗑️';
    delBtn.addEventListener('click', () => removeTaskWithConfirm(task.id));

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    li.appendChild(chk);
    li.appendChild(txt);
    li.appendChild(actions);

    // Drag handlers
    li.addEventListener('dragstart', (e) => {
      li.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', task.id);
    });
    li.addEventListener('dragend', () => li.classList.remove('dragging'));

    return li;
  }

  // Add task
  function addTask(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const t = { id: uid(), text: trimmed, done: false };
    tasks.unshift(t);
    const li = createTaskElement(t);
    listEl.insertBefore(li, listEl.firstChild);
    domIndex.set(t.id, li);
    save();
    updateCount();
    applyFilterToItem(t.id);
    announce('Task added');
  }

  // Toggle done
  function toggleDone(id) {
    const it = tasks.find(t => t.id === id);
    if (!it) return;
    it.done = !it.done;
    save();
    const li = domIndex.get(id);
    if (li) {
      const chk = li.querySelector('.todo__checkbox');
      const txt = li.querySelector('.todo__text');
      chk.checked = it.done;
      txt.classList.toggle('todo__text--done', it.done);
      chk.setAttribute('aria-label', it.done ? `Mark "${it.text}" as active` : `Mark "${it.text}" as completed`);
      announce(it.done ? 'Task completed' : 'Task marked active');
      applyFilterToItem(id);
    }
    updateCount();
  }

  // Start editing
  function startEdit(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const li = domIndex.get(id);
    if (!li) return;
    if (li.querySelector('.todo__edit')) return;

    const txt = li.querySelector('.todo__text');
    const input = document.createElement('input');
    input.className = 'todo__edit';
    input.value = task.text;
    input.setAttribute('aria-label', `Edit task: ${task.text}`);

    li.replaceChild(input, txt);
    input.focus();
    input.select();

    const finish = (saveEdit) => {
      if (saveEdit) {
        const val = input.value.trim();
        if (!val) {
          removeTaskWithConfirm(id, true);
          return;
        }
        if (val !== task.text) {
          task.text = val;
          save();
          announce('Task updated');
        } else {
          announce('Edit cancelled');
        }
      } else {
        announce('Edit cancelled');
      }
      const newTxt = document.createElement('div');
      newTxt.className = 'todo__text' + (task.done ? ' todo__text--done' : '');
      newTxt.textContent = task.text;
      newTxt.title = 'Double-click to edit';
      newTxt.addEventListener('dblclick', () => startEdit(id));
      li.replaceChild(newTxt, input);
    };

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); finish(true); }
      if (e.key === 'Escape') { finish(false); }
    });
    input.addEventListener('blur', () => finish(true));
  }

  // Remove with confirm
  function removeTaskWithConfirm(id, skipPrompt = false) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const confirmed = skipPrompt || confirm(`Delete task: "${task.text}"?`);
    if (!confirmed) return;
    tasks = tasks.filter(t => t.id !== id);
    const li = domIndex.get(id);
    if (li) li.remove();
    domIndex.delete(id);
    save();
    updateCount();
    announce('Task removed');
  }

  // Clear completed with confirm
  function clearCompleted() {
    const completed = tasks.filter(t => t.done);
    if (!completed.length) return;
    if (!confirm('Clear all completed tasks?')) return;
    completed.forEach(c => {
      const li = domIndex.get(c.id);
      if (li) li.remove();
      domIndex.delete(c.id);
    });
    tasks = tasks.filter(t => !t.done);
    save();
    updateCount();
    announce('Cleared completed tasks');
  }

  // Update footer count
  function updateCount() {
    const total = tasks.length;
    const open = tasks.filter(t => !t.done).length;
    countEl.textContent = `${open} open • ${total} total`;
  }

  // Filtering
  function setFilter(filter) {
    currentFilter = filter;
    localStorage.setItem(FILTER_KEY, filter);
    applyFilterUI();
    tasks.forEach(t => applyFilterToItem(t.id));
    announce(`Filter: ${filter}`);
  }
  function applyFilterUI() {
    filters.forEach(btn => {
      const f = btn.dataset.filter;
      btn.classList.toggle('todo__filter--active', f === currentFilter);
      btn.setAttribute('aria-selected', f === currentFilter ? 'true' : 'false');
    });
  }
  function applyFilterToItem(id) {
    const li = domIndex.get(id);
    if (!li) return;
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    let show = true;
    if (currentFilter === 'active') show = !task.done;
    if (currentFilter === 'completed') show = task.done;
    li.style.display = show ? '' : 'none';
  }

  // Drag-and-drop reorder
  function bindDragAndDrop(container) {
    container.addEventListener('dragover', (e) => {
      e.preventDefault();
      const after = getDragAfterElement(container, e.clientY);
      const dragging = container.querySelector('.dragging');
      if (!dragging) return;
      if (after == null) {
        container.appendChild(dragging);
      } else {
        container.insertBefore(dragging, after);
      }
    });

    container.addEventListener('drop', () => {
      const ids = Array.from(container.children).map(li => li.dataset.id);
      tasks = ids.map(id => tasks.find(t => t.id === id)).filter(Boolean);
      save();
      announce('Tasks reordered');
    });

    function getDragAfterElement(containerEl, y) {
      const draggableElements = [...containerEl.querySelectorAll('.todo__item:not(.dragging)')];
      return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
  }

  // Event bindings
  function bindEvents() {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const v = input.value;
      if (!v || !v.trim()) { input.value = ''; return; }
      addTask(v);
      input.value = '';
      input.focus();
    });

    clearCompletedBtn.addEventListener('click', clearCompleted);

    filters.forEach(btn => {
      btn.addEventListener('click', () => setFilter(btn.dataset.filter));
    });

    bindDragAndDrop(listEl);

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') input.value = '';
    });

    // 🌟 Theme toggle event
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', toggleTheme);
    }
  }

  // Load from localStorage
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('Failed to load tasks', e);
      return [];
    }
  }

  // Init
  init();

  // Debug
  window.__todo = {
    _tasks: tasks,
    add: (t) => addTask(t),
    clearCompleted,
    save,
  };
})();
