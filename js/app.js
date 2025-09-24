/**
 * ===============================================
 * Smart To-Do List Application
 * ===============================================
 * Professional task management with modern features
 * Built with vanilla JavaScript and clean architecture
 * ===============================================
 */

class SmartTodoApp {
  constructor() {
    // App state
    this.tasks = this.loadFromStorage() || [];
    this.currentFilter = 'all';
    this.taskIdCounter = this.tasks.length > 0 ? Math.max(...this.tasks.map(t => t.id)) + 1 : 1;
    this.isLoading = false;
    this.currentTheme = this.loadTheme();

    // Initialize app
    this.initializeElements();
    this.attachEventListeners();
    this.initializeTheme();
    this.render();
    this.updateStats();
    
    console.log('Smart Todo App initialized successfully');
  }

  /**
   * Initialize DOM elements
   */
  initializeElements() {
    // Input elements
    this.taskInput = document.getElementById('taskInput');
    this.prioritySelect = document.getElementById('prioritySelect');
    this.addTaskBtn = document.getElementById('addTaskBtn');
    this.charCounter = document.getElementById('charCounter');
    
    // Task list elements
    this.taskList = document.getElementById('taskList');
    this.emptyState = document.getElementById('emptyState');
    this.clearCompletedBtn = document.getElementById('clearCompletedBtn');
    
    // Stats elements
    this.totalTasks = document.getElementById('totalTasks');
    this.activeTasks = document.getElementById('activeTasks');
    this.completedTasks = document.getElementById('completedTasks');
    
    // Filter elements
    this.filterBtns = document.querySelectorAll('.filter-btn');
    
    // Import/Export elements
    this.exportBtn = document.getElementById('exportBtn');
    this.importBtn = document.getElementById('importBtn');
    this.importFile = document.getElementById('importFile');
    
    // UI elements
    this.notificationContainer = document.getElementById('notificationContainer');
    this.loadingOverlay = document.getElementById('loadingOverlay');
    this.themeToggle = document.getElementById('themeToggle');
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Task input events
    this.taskInput.addEventListener('input', () => this.updateCharCounter());
    this.taskInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.addTask();
    });
    
    // Add task button
    this.addTaskBtn.addEventListener('click', () => this.addTask());
    
    // Filter buttons
    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => this.setFilter(e.target.dataset.filter));
    });
    
    // Clear completed button
    this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());
    
    // Import/Export buttons
    this.exportBtn.addEventListener('click', () => this.exportTasks());
    this.importBtn.addEventListener('click', () => this.importFile.click());
    this.importFile.addEventListener('change', (e) => this.importTasks(e));
    
    // Theme toggle
    this.themeToggle.addEventListener('click', () => this.toggleTheme());
    
    // Auto-save on page unload
    window.addEventListener('beforeunload', () => this.saveToStorage());
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
  }

  /**
   * Initialize theme on app load
   */
  initializeTheme() {
    this.setTheme(this.currentTheme);
  }

  /**
   * Load theme preference from storage
   */
  loadTheme() {
    try {
      return localStorage.getItem('smartTodoTheme') || 'light';
    } catch (error) {
      return 'light';
    }
  }

  /**
   * Save theme preference to storage
   */
  saveTheme(theme) {
    try {
      localStorage.setItem('smartTodoTheme', theme);
    } catch (error) {
      console.error('Failed to save theme preference');
    }
  }

  /**
   * Toggle between light and dark themes
   */
  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  /**
   * Set the application theme
   */
  setTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    this.updateThemeIcon(theme);
    this.saveTheme(theme);
  }

  /**
   * Update theme toggle icon
   */
  updateThemeIcon(theme) {
    const icon = this.themeToggle.querySelector('.theme-icon');
    if (icon) {
      icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }
  handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + Enter to add task from anywhere
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (this.taskInput.value.trim()) {
        this.addTask();
      } else {
        this.taskInput.focus();
      }
    }
    
    // Escape to clear input
    if (e.key === 'Escape') {
      this.taskInput.value = '';
      this.updateCharCounter();
      this.taskInput.blur();
    }
  }

  /**
   * Update character counter
   */
  updateCharCounter() {
    const currentLength = this.taskInput.value.length;
    this.charCounter.textContent = currentLength;
    
    // Color coding for character limit
    if (currentLength > 180) {
      this.charCounter.style.color = '#ef4444'; // red
    } else if (currentLength > 150) {
      this.charCounter.style.color = '#f59e0b'; // yellow
    } else {
      this.charCounter.style.color = '#6b7280'; // gray
    }
  }

  /**
   * Add a new task
   */
  addTask() {
    const text = this.taskInput.value.trim();
    
    // Validation
    if (!text) {
      this.showNotification('Please enter a task!', 'warning');
      this.taskInput.focus();
      return;
    }
    
    if (text.length > 200) {
      this.showNotification('Task is too long! Please keep it under 200 characters.', 'warning');
      return;
    }

    // Check for duplicate tasks
    const isDuplicate = this.tasks.some(task => 
      task.text.toLowerCase() === text.toLowerCase() && !task.completed
    );
    
    if (isDuplicate) {
      this.showNotification('This task already exists!', 'warning');
      return;
    }

    // Create new task
    const task = {
      id: this.taskIdCounter++,
      text: text,
      completed: false,
      priority: this.prioritySelect.value,
      createdAt: new Date().toISOString(),
      completedAt: null,
      editedAt: null
    };

    // Add task to beginning of array
    this.tasks.unshift(task);
    
    // Reset form
    this.taskInput.value = '';
    this.prioritySelect.value = 'medium';
    this.updateCharCounter();
    
    // Update UI
    this.saveToStorage();
    this.render();
    this.updateStats();
    
    // Show success notification
    this.showNotification('Task added successfully!', 'success');
    
    // Keep focus on input for quick task entry
    this.taskInput.focus();
  }

  /**
   * Delete a task
   */
  deleteTask(id) {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) return;

    const task = this.tasks[taskIndex];
    
    // Show confirmation for important tasks
    if (task.priority === 'high' && !task.completed) {
      if (!confirm('Are you sure you want to delete this high priority task?')) {
        return;
      }
    }

    // Remove task
    this.tasks.splice(taskIndex, 1);
    
    // Update UI
    this.saveToStorage();
    this.render();
    this.updateStats();
    
    this.showNotification('Task deleted', 'info');
  }

  /**
   * Toggle task completion
   */
  toggleComplete(id) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return;

    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date().toISOString() : null;

    // Move completed tasks to the end
    if (task.completed) {
      const taskIndex = this.tasks.indexOf(task);
      this.tasks.splice(taskIndex, 1);
      this.tasks.push(task);
    }

    this.saveToStorage();
    this.render();
    this.updateStats();

    const message = task.completed ? 'Task completed!' : 'Task marked as active';
    this.showNotification(message, task.completed ? 'success' : 'info');
  }

  /**
   * Edit a task
   */
  editTask(id) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return;

    const currentText = task.text;
    const newText = prompt('Edit task:', currentText);
    
    if (newText === null) return; // User cancelled
    
    const trimmedText = newText.trim();
    if (!trimmedText) {
      this.showNotification('Task cannot be empty!', 'warning');
      return;
    }
    
    if (trimmedText.length > 200) {
      this.showNotification('Task is too long! Please keep it under 200 characters.', 'warning');
      return;
    }

    // Check for duplicates (excluding current task)
    const isDuplicate = this.tasks.some(t => 
      t.id !== id && 
      t.text.toLowerCase() === trimmedText.toLowerCase() && 
      !t.completed
    );
    
    if (isDuplicate) {
      this.showNotification('A task with this text already exists!', 'warning');
      return;
    }

    // Update task
    task.text = trimmedText;
    task.editedAt = new Date().toISOString();

    this.saveToStorage();
    this.render();
    this.showNotification('Task updated successfully!', 'success');
  }

  /**
   * Set current filter
   */
  setFilter(filter) {
    this.currentFilter = filter;
    
    // Update filter button states
    this.filterBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    
    this.render();
  }

  /**
   * Get filtered tasks based on current filter
   */
  getFilteredTasks() {
    switch (this.currentFilter) {
      case 'active':
        return this.tasks.filter(t => !t.completed);
      case 'completed':
        return this.tasks.filter(t => t.completed);
      case 'high':
        return this.tasks.filter(t => t.priority === 'high');
      default:
        return this.tasks;
    }
  }

  /**
   * Clear all completed tasks
   */
  clearCompleted() {
    const completedTasks = this.tasks.filter(t => t.completed);
    
    if (completedTasks.length === 0) {
      this.showNotification('No completed tasks to clear!', 'info');
      return;
    }

    if (confirm(`Are you sure you want to delete ${completedTasks.length} completed task(s)?`)) {
      this.tasks = this.tasks.filter(t => !t.completed);
      this.saveToStorage();
      this.render();
      this.updateStats();
      this.showNotification(`${completedTasks.length} completed task(s) cleared!`, 'success');
    }
  }

  /**
   * Create task element
   */
  createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.dataset.taskId = task.id;

    const timeAgo = this.getTimeAgo(task.createdAt);
    const editedText = task.editedAt ? ` • Edited ${this.getTimeAgo(task.editedAt)}` : '';
    const completedText = task.completedAt ? ` • Completed ${this.getTimeAgo(task.completedAt)}` : '';

    li.innerHTML = `
      <div class="task-checkbox ${task.completed ? 'checked' : ''}" 
           onclick="app.toggleComplete(${task.id})"
           title="${task.completed ? 'Mark as active' : 'Mark as completed'}">
        ${task.completed ? '✓' : ''}
      </div>
      <div class="priority-indicator priority-${task.priority}"></div>
      <div class="task-content">
        <div class="task-text">${this.escapeHtml(task.text)}</div>
        <div class="task-meta">
          <span>Created ${timeAgo}</span>
          <span class="priority-badge priority-${task.priority}">${task.priority.toUpperCase()}</span>
          ${editedText}
          ${completedText}
        </div>
      </div>
      <div class="task-actions">
        <button class="action-btn complete-btn" 
                onclick="app.toggleComplete(${task.id})"
                title="${task.completed ? 'Mark as active' : 'Complete task'}">
          ${task.completed ? '↶' : '✓'}
        </button>
        <button class="action-btn edit-btn" 
                onclick="app.editTask(${task.id})"
                title="Edit task">
          ✎
        </button>
        <button class="action-btn delete-btn" 
                onclick="app.deleteTask(${task.id})"
                title="Delete task">
          🗑
        </button>
      </div>
    `;

    return li;
  }

  /**
   * Render the task list
   */
  render() {
    const filteredTasks = this.getFilteredTasks();
    this.taskList.innerHTML = '';

    if (filteredTasks.length === 0) {
      this.taskList.appendChild(this.emptyState);
    } else {
      filteredTasks.forEach(task => {
        this.taskList.appendChild(this.createTaskElement(task));
      });
    }

    // Update clear completed button visibility
    const hasCompleted = this.tasks.some(t => t.completed);
    this.clearCompletedBtn.style.display = hasCompleted ? 'flex' : 'none';
  }

  /**
   * Update statistics
   */
  updateStats() {
    const total = this.tasks.length;
    const completed = this.tasks.filter(t => t.completed).length;
    const active = total - completed;

    // Animate number changes
    this.animateNumber(this.totalTasks, total);
    this.animateNumber(this.activeTasks, active);
    this.animateNumber(this.completedTasks, completed);
  }

  /**
   * Animate number changes in stats
   */
  animateNumber(element, newNumber) {
    const oldNumber = parseInt(element.textContent) || 0;
    if (oldNumber === newNumber) return;

    element.style.transform = 'scale(1.2)';
    element.style.color = '#667eea';
    
    setTimeout(() => {
      element.textContent = newNumber;
      element.style.transform = 'scale(1)';
      element.style.color = '';
    }, 150);
  }

  /**
   * Get human-readable time difference
   */
  getTimeAgo(dateString) {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now - past;
    
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return past.toLocaleDateString();
  }

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Show notification
   */
  showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icons = {
      success: '✅',
      warning: '⚠️',
      error: '❌',
      info: 'ℹ️'
    };

    notification.innerHTML = `
      <span class="notification-icon">${icons[type] || icons.info}</span>
      <span class="notification-message">${message}</span>
    `;

    this.notificationContainer.appendChild(notification);

    // Auto remove notification
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, duration);
  }

  /**
   * Show loading overlay
   */
  showLoading(message = 'Processing...') {
    this.loadingOverlay.querySelector('.loading-text').textContent = message;
    this.loadingOverlay.classList.remove('hidden');
    this.isLoading = true;
  }

  /**
   * Hide loading overlay
   */
  hideLoading() {
    this.loadingOverlay.classList.add('hidden');
    this.isLoading = false;
  }

  /**
   * Save tasks to localStorage
   */
  saveToStorage() {
    try {
      localStorage.setItem('smartTodoTasks', JSON.stringify(this.tasks));
      localStorage.setItem('smartTodoSettings', JSON.stringify({
        filter: this.currentFilter,
        taskIdCounter: this.taskIdCounter
      }));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      this.showNotification('Failed to save tasks!', 'error');
    }
  }

  /**
   * Load tasks from localStorage
   */
  loadFromStorage() {
    try {
      const tasks = localStorage.getItem('smartTodoTasks');
      const settings = localStorage.getItem('smartTodoSettings');
      
      if (settings) {
        const parsed = JSON.parse(settings);
        this.currentFilter = parsed.filter || 'all';
        this.taskIdCounter = parsed.taskIdCounter || 1;
      }
      
      return tasks ? JSON.parse(tasks) : [];
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      this.showNotification('Failed to load saved tasks!', 'error');
      return [];
    }
  }

  /**
   * Export tasks to JSON file
   */
  exportTasks() {
    if (this.tasks.length === 0) {
      this.showNotification('No tasks to export!', 'warning');
      return;
    }

    try {
      const exportData = {
        tasks: this.tasks,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      a.href = url;
      a.download = `smart-todo-tasks-${timestamp}.json`;
      a.click();
      
      URL.revokeObjectURL(url);
      this.showNotification('Tasks exported successfully!', 'success');
    } catch (error) {
      console.error('Export failed:', error);
      this.showNotification('Failed to export tasks!', 'error');
    }
  }

  /**
   * Import tasks from JSON file
   */
  importTasks(event) {
    const file = event.target.files[0];
    if (!file) return;

    this.showLoading('Importing tasks...');

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        // Handle different export formats
        const importedTasks = data.tasks || data;
        
        if (!Array.isArray(importedTasks)) {
          throw new Error('Invalid file format');
        }

        // Validate task structure
        const validTasks = importedTasks.filter(task => 
          task && typeof task.text === 'string' && task.text.trim()
        );

        if (validTasks.length === 0) {
          throw new Error('No valid tasks found in file');
        }

        // Merge with existing tasks or replace
        const choice = confirm(
          `Found ${validTasks.length} task(s) in file.\n\n` +
          'Click OK to ADD to existing tasks, or Cancel to REPLACE all tasks.'
        );

        if (choice) {
          // Add to existing tasks
          const newTasks = validTasks.map(task => ({
            ...task,
            id: this.taskIdCounter++,
            createdAt: task.createdAt || new Date().toISOString()
          }));
          
          this.tasks = [...newTasks, ...this.tasks];
        } else {
          // Replace all tasks
          this.tasks = validTasks.map(task => ({
            ...task,
            id: this.taskIdCounter++,
            createdAt: task.createdAt || new Date().toISOString()
          }));
        }

        this.saveToStorage();
        this.render();
        this.updateStats();
        
        this.hideLoading();
        this.showNotification(
          `Successfully imported ${validTasks.length} task(s)!`, 
          'success'
        );
        
      } catch (error) {
        console.error('Import failed:', error);
        this.hideLoading();
        this.showNotification(
          'Failed to import tasks. Please check the file format.', 
          'error'
        );
      }
      
      // Reset file input
      event.target.value = '';
    };

    reader.onerror = () => {
      this.hideLoading();
      this.showNotification('Failed to read file!', 'error');
    };

    reader.readAsText(file);
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Global app instance for onclick handlers
  window.app = new SmartTodoApp();
});

// Service Worker registration for offline functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(() => console.log('Service Worker registered successfully'))
      .catch(error => console.log('Service Worker registration failed:', error));
  });
}