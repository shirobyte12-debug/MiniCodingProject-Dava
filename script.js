document.addEventListener('DOMContentLoaded', () => {

  // --- 1. GREETING & CLOCK ---
  const timeDisplay = document.getElementById('time-display');
  const dateDisplay = document.getElementById('date-display');
  const greetingTime = document.getElementById('greeting-time');
  const userName = document.getElementById('user-name');

  function updateClock() {
    const now = new Date();
    
    // Format Waktu
    timeDisplay.textContent = now.toLocaleTimeString('en-US', { hour12: false });
    
    // Format Tanggal
    dateDisplay.textContent = now.toLocaleDateString('en-US', { 
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' 
    });

    // Salam Berdasarkan Jam
    const hours = now.getHours();
    if (hours < 12) greetingTime.textContent = 'Good Morning';
    else if (hours < 18) greetingTime.textContent = 'Good Afternoon';
    else greetingTime.textContent = 'Good Evening';
  }

  setInterval(updateClock, 1000);
  updateClock();

  // Challenge: Custom Name in Greeting
  const savedName = localStorage.getItem('dashboard_username') || 'User';
  userName.textContent = savedName;

  userName.addEventListener('blur', () => {
    let name = userName.textContent.trim();
    if (!name) name = 'User';
    userName.textContent = name;
    localStorage.setItem('dashboard_username', name);
  });

  userName.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      userName.blur();
    }
  });


  // --- 2. FOCUS TIMER (25 Mins) ---
  const timerDisplay = document.getElementById('timer-display');
  const startBtn = document.getElementById('start-btn');
  const stopBtn = document.getElementById('stop-btn');
  const resetBtn = document.getElementById('reset-btn');

  let timeLeft = 25 * 60; // 25 menit
  let timerInterval = null;

  function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  startBtn.addEventListener('click', () => {
    if (timerInterval !== null) return;
    timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateTimerDisplay();
      } else {
        clearInterval(timerInterval);
        timerInterval = null;
        alert('Focus Session Complete!');
      }
    }, 1000);
  });

  stopBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
  });

  resetBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
    timeLeft = 25 * 60;
    updateTimerDisplay();
  });


  // --- 3. TO-DO LIST (With LocalStorage & Duplicate Prevention Challenge) ---
  const todoForm = document.getElementById('todo-form');
  const todoInput = document.getElementById('todo-input');
  const todoList = document.getElementById('todo-list');
  const todoError = document.getElementById('todo-error');

  let tasks = JSON.parse(localStorage.getItem('dashboard_tasks')) || [];

  function saveAndRenderTasks() {
    localStorage.setItem('dashboard_tasks', JSON.stringify(tasks));
    todoList.innerHTML = '';

    tasks.forEach((task, index) => {
      const li = document.createElement('li');
      li.className = `task-item ${task.completed ? 'completed' : ''}`;
      
      li.innerHTML = `
        <div class="task-content">
          <input type="checkbox" ${task.completed ? 'checked' : ''} data-index="${index}">
          <span>${escapeHtml(task.text)}</span>
        </div>
        <button class="btn btn-danger" data-delete="${index}">Delete</button>
      `;

      todoList.appendChild(li);
    });
  }

  todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskText = todoInput.value.trim();
    
    if (!taskText) return;

    // Challenge: Prevent Duplicate Tasks
    const isDuplicate = tasks.some(t => t.text.toLowerCase() === taskText.toLowerCase());
    if (isDuplicate) {
      todoError.textContent = 'Task already exists!';
      return;
    }

    todoError.textContent = '';
    tasks.push({ text: taskText, completed: false });
    todoInput.value = '';
    saveAndRenderTasks();
  });

  todoList.addEventListener('click', (e) => {
    if (e.target.dataset.index !== undefined) {
      const idx = e.target.dataset.index;
      tasks[idx].completed = !tasks[idx].completed;
      saveAndRenderTasks();
    } else if (e.target.dataset.delete !== undefined) {
      const idx = e.target.dataset.delete;
      tasks.splice(idx, 1);
      saveAndRenderTasks();
    }
  });

  saveAndRenderTasks();


  // --- 4. QUICK LINKS (With LocalStorage) ---
  const linkForm = document.getElementById('link-form');
  const linkNameInput = document.getElementById('link-name');
  const linkUrlInput = document.getElementById('link-url');
  const linksContainer = document.getElementById('links-container');

  let quickLinks = JSON.parse(localStorage.getItem('dashboard_links')) || [
    { name: 'Google', url: 'https://google.com' },
    { name: 'Gmail', url: 'https://mail.google.com' }
  ];

  function saveAndRenderLinks() {
    localStorage.setItem('dashboard_links', JSON.stringify(quickLinks));
    linksContainer.innerHTML = '';

    quickLinks.forEach((link, index) => {
      const a = document.createElement('a');
      a.className = 'link-chip';
      a.href = link.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.innerHTML = `
        ${escapeHtml(link.name)}
        <button data-remove="${index}">&times;</button>
      `;
      linksContainer.appendChild(a);
    });
  }

  linkForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = linkNameInput.value.trim();
    let url = linkUrlInput.value.trim();

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    quickLinks.push({ name, url });
    linkNameInput.value = '';
    linkUrlInput.value = '';
    saveAndRenderLinks();
  });

  linksContainer.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      e.preventDefault();
      const idx = e.target.dataset.remove;
      quickLinks.splice(idx, 1);
      saveAndRenderLinks();
    }
  });

  saveAndRenderLinks();


  // --- 5. CHALLENGE: LIGHT / DARK MODE ---
  const themeBtn = document.getElementById('theme-btn');
  const savedTheme = localStorage.getItem('dashboard_theme') || 'light';

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    themeBtn.textContent = theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
    localStorage.setItem('dashboard_theme', theme);
  }

  setTheme(savedTheme);

  themeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });

  // Utility Sanitizer
  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, (m) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[m]));
  }

});