// Ankit-To-Do-List logic
const taskInput = document.getElementById('task-input');
const dateInput = document.getElementById('date-input');
const timeInput = document.getElementById('time-input');
const taskList = document.getElementById('task-list');
const todoForm = document.getElementById('todo-form');
const filterBtns = document.querySelectorAll('.filter-btn');
const progressBar = document.getElementById('progress-bar');
const progressLabel = document.getElementById('progress-label');
const modeSwitch = document.getElementById('mode-switch');
const undoBtn = document.getElementById('undo-btn');
const priorityInput = document.getElementById('priority-input');
let tasks = JSON.parse(localStorage.getItem('ankit_tasks') || '[]');
let filter = 'all';
let lastDeleted = null;
let notifyTimeout = null;
let completedTimers = {};

function saveTasks() {
  localStorage.setItem('ankit_tasks', JSON.stringify(tasks));
}

function getDefaultDate() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}
function getDefaultTime() {
  return '23:59';
}

function sortTasks(arr) {
  // Custom sort: overdue incomplete on top, then by due date/time, then priority, completed at last
  return arr.slice().sort((a, b) => {
    const now = new Date();
    const aDue = getDueDateTime(a);
    const bDue = getDueDateTime(b);
    // Overdue incomplete on top
    const aOverdue = !a.completed && aDue < now;
    const bOverdue = !b.completed && bDue < now;
    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;
    // Completed at last
    if (!a.completed && b.completed) return -1;
    if (a.completed && !b.completed) return 1;
    // By due date/time
    if (aDue < bDue) return -1;
    if (aDue > bDue) return 1;
    // By priority (high < medium < low)
    const prioOrder = {high: 0, medium: 1, low: 2};
    const aPrio = prioOrder[a.priority || 'medium'];
    const bPrio = prioOrder[b.priority || 'medium'];
    if (aPrio < bPrio) return -1;
    if (aPrio > bPrio) return 1;
    // Starred tasks on top
    if (a.star && !b.star) return -1;
    if (!a.star && b.star) return 1;
    return 0;
  });
}

function renderTasks() {
  taskList.innerHTML = '';
  let filtered = tasks.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });
  filtered = sortTasks(filtered);
  let completedCount = filtered.filter(t => t.completed).length;
  let totalCount = filtered.length;
  // Progress bar
  let percent = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;
  progressBar.style.width = percent + '%';
  progressLabel.textContent = `${completedCount} / ${totalCount} completed`;
  if (filtered.length === 0) {
    const msg = document.createElement('div');
    msg.id = 'no-tasks-message';
    msg.textContent = 'No tasks yet! Add something motivating.';
    taskList.appendChild(msg);
    return;
  }
  filtered.forEach((task, idx) => {
    const li = document.createElement('li');
    li.className = 'task-item priority-' + (task.priority || 'medium') + (task.completed ? ' completed' : '');
    // Overdue highlight
    let dueDateTime = getDueDateTime(task);
    if (task.due && !task.completed && dueDateTime < new Date()) {
      li.classList.add('overdue');
    }
    // Notify if due within 1 minute
    if (task.due && !task.completed) {
      let now = new Date();
      let diff = dueDateTime - now;
      if (diff > 0 && diff < 60000) {
        if (!li.classList.contains('notified')) {
          li.classList.add('notified');
          showNotification(`Task "${task.text}" is due now!`);
        }
      }
    }
    // Auto-delete completed after 2 minutes
    if (task.completed && !completedTimers[task.text + (task.due || '')]) {
      completedTimers[task.text + (task.due || '')] = setTimeout(() => {
        let idx = tasks.findIndex(t => t.text === task.text && t.due === task.due);
        if (idx !== -1 && tasks[idx].completed) {
          tasks.splice(idx, 1);
          saveTasks();
          renderTasks();
        }
        delete completedTimers[task.text + (task.due || '')];
      }, 120000);
    }
    // Task content
    li.innerHTML = `
      <button class="star-btn${task.star ? ' starred' : ''}" title="Mark Important">★</button>
      <span class="task-text">${task.text}</span>
      <span class="task-date">${formatDateTime(task.due, task.time)}</span>
      <span class="task-priority">${task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : 'Medium'}</span>
      <div class="task-actions">
        <button class="complete-btn" title="Mark Complete">✓</button>
        <button class="edit-btn" title="Edit">✎</button>
        <button class="delete-btn" title="Delete">🗑</button>
      </div>
    `;
    // Animate addition
    li.classList.add('adding');
    setTimeout(() => li.classList.remove('adding'), 10);
    // Complete
    li.querySelector('.complete-btn').onclick = () => {
      tasks[getTaskIdx(filtered[idx])].completed = !task.completed;
      saveTasks();
      renderTasks();
    };
    // Delete
    li.querySelector('.delete-btn').onclick = () => {
      if (confirm('Are you sure you want to permanently delete this task?')) {
        li.classList.add('removing');
        lastDeleted = tasks[getTaskIdx(filtered[idx])];
        setTimeout(() => {
          tasks.splice(getTaskIdx(filtered[idx]), 1);
          saveTasks();
          renderTasks();
          showUndo();
        }, 400);
      }
    };
    // Edit
    li.querySelector('.edit-btn').onclick = () => {
      startEdit(li, filtered[idx]);
    };
    // Star
    li.querySelector('.star-btn').onclick = () => {
      tasks[getTaskIdx(filtered[idx])].star = !task.star;
      saveTasks();
      renderTasks();
    };
    taskList.appendChild(li);
  });
}

function getTaskIdx(task) {
  return tasks.findIndex(t => t.text === task.text && t.due === task.due);
}

function getDueDateTime(task) {
  if (!task.due) return new Date(0);
  let dateStr = task.due;
  let timeStr = task.time || '23:59';
  return new Date(dateStr + 'T' + timeStr);
}

function formatDateTime(dateStr, timeStr) {
  if (!dateStr) return '';
  let d = new Date(dateStr + 'T' + (timeStr || '23:59'));
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

function startEdit(li, task) {
  const idx = getTaskIdx(task);
  li.innerHTML = `<input class="edit-input" type="text" value="${task.text}">
    <input class="edit-input" type="date" value="${task.due ? task.due : ''}">
    <input class="edit-input" type="time" value="${task.time ? task.time : ''}">
    <select class="edit-input" id="edit-priority">
      <option value="low"${task.priority === 'low' ? ' selected' : ''}>Low</option>
      <option value="medium"${!task.priority || task.priority === 'medium' ? ' selected' : ''}>Medium</option>
      <option value="high"${task.priority === 'high' ? ' selected' : ''}>High</option>
    </select>
    <button class="save-btn">Save</button>
    <button class="cancel-btn">Cancel</button>`;
  const textInput = li.querySelector('input[type="text"]');
  const dateInput = li.querySelector('input[type="date"]');
  const timeInputEdit = li.querySelector('input[type="time"]');
  const priorityEdit = li.querySelector('#edit-priority');
  textInput.focus();
  li.querySelector('.save-btn').onclick = () => {
    tasks[idx].text = textInput.value.trim();
    tasks[idx].due = dateInput.value || getDefaultDate();
    tasks[idx].time = timeInputEdit.value || getDefaultTime();
    tasks[idx].priority = priorityEdit.value;
    saveTasks();
    renderTasks();
  };
  li.querySelector('.cancel-btn').onclick = () => {
    renderTasks();
  };
}

todoForm.onsubmit = e => {
  e.preventDefault();
  const text = taskInput.value.trim();
  let due = dateInput.value;
  let time = timeInput.value;
  const priority = priorityInput.value;
  if (!text) return;
  if (!due) due = getDefaultDate();
  if (!time) time = getDefaultTime();
  tasks.push({ text, due, time, priority, completed: false, star: false });
  saveTasks();
  renderTasks();
  taskInput.value = '';
  dateInput.value = '';
  timeInput.value = '';
  priorityInput.value = 'medium';
};

filterBtns.forEach(btn => {
  btn.onclick = () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filter = btn.dataset.filter;
    renderTasks();
  };
});

modeSwitch.onchange = () => {
  document.body.classList.toggle('light-mode', modeSwitch.checked);
};

function showNotification(msg) {
  if (notifyTimeout) clearTimeout(notifyTimeout);
  let n = document.createElement('div');
  n.textContent = msg;
  n.style.position = 'fixed';
  n.style.bottom = '32px';
  n.style.left = '50%';
  n.style.transform = 'translateX(-50%)';
  n.style.background = '#ff6f61';
  n.style.color = '#fff';
  n.style.padding = '0.75rem 2rem';
  n.style.borderRadius = '8px';
  n.style.fontWeight = 'bold';
  n.style.zIndex = '9999';
  n.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
  document.body.appendChild(n);
  notifyTimeout = setTimeout(() => n.remove(), 3500);
}

function showUndo() {
  undoBtn.style.display = 'block';
  undoBtn.onclick = () => {
    if (lastDeleted) {
      tasks.push(lastDeleted);
      saveTasks();
      renderTasks();
      lastDeleted = null;
      undoBtn.style.display = 'none';
    }
  };
  setTimeout(() => {
    undoBtn.style.display = 'none';
    lastDeleted = null;
  }, 6000);
}

window.addEventListener('DOMContentLoaded', renderTasks);
