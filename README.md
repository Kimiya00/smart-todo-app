# Smart To-Do App

A modern, feature-rich task management application that goes beyond basic CRUD. Built with vanilla JavaScript to showcase clean architecture, advanced DOM manipulation, and professional UI design.

## What It Does

Interactive productivity app featuring priority levels, smart filtering, persistent storage, and real-time statistics. Includes advanced features like task editing, data export/import, keyboard shortcuts, and a professional glassmorphism interface that adapts to any screen size.

## Why I Built This

Most demo todo apps lose your data when you refresh and lack real-world features. I wanted to build something I'd actually use while demonstrating advanced JavaScript concepts, modern CSS techniques, and thoughtful UX design. The focus was creating a professional-grade application that showcases technical depth alongside practical functionality.

## Tech Stack

- **HTML5** - Semantic, accessible markup with ARIA labels
- **CSS3** - Advanced styling with glassmorphism, custom properties, animations
- **Vanilla JavaScript (ES6+)** - Class-based architecture, modular design
- **Local Storage API** - Client-side data persistence with error handling
- **Service Workers** - Offline functionality and performance optimization

## Quick Start

```bash
git clone https://github.com/Kimiya00/smart-todo-app
cd smart-todo-app
# Open with Live Server or serve locally:
python -m http.server 8000
```

No build process needed. Runs directly in any modern browser.

**[Try it live →](https://kimiya00.github.io/smart-todo-app)**

## Key Features

**Core Functionality:**
- Add, edit, delete tasks with input validation
- Priority system with visual indicators (High/Medium/Low)
- Smart filtering by status and priority level
- Real-time statistics with animated counters
- Persistent storage that survives browser sessions

## Key Features

**Core Functionality:**
- Add, edit, delete tasks with input validation
- Priority system with visual indicators (High/Medium/Low)
- Smart filtering by status and priority level
- Real-time statistics with animated counters
- Persistent storage that survives browser sessions

**Advanced Features:**
- Character counter with color-coded warnings
- Duplicate task detection
- Bulk actions (clear completed tasks)
- Data export/import with JSON format
- Keyboard shortcuts (Ctrl+Enter, Escape)
- Responsive design with mobile-first approach
- Accessibility features with ARIA labels
- Professional glassmorphism UI with smooth animations

**User Experience:**
- Toast notifications for user feedback
- Loading states for async operations
- Empty state illustrations and helpful messaging
- Time tracking with "created/edited/completed" timestamps
- Confirmation dialogs for destructive actions

## How to Use

**Basic Operations:**
- Type a task and press Enter or click "Add Task"
- Set priority level before adding (Low/Medium/High)
- Click checkmark to complete tasks
- Use edit (✎) button to modify task text
- Delete tasks with trash icon

**Keyboard Shortcuts:**
- `Ctrl/Cmd + Enter` - Add task from anywhere
- `Escape` - Clear input field
- `Enter` in input - Add new task

**Filtering:**
- "All Tasks" - Show everything
- "Active" - Show incomplete tasks only
- "Completed" - Show finished tasks
- "High Priority" - Show urgent tasks

## Challenges I Solved

**State management without frameworks:** Coordinating filters, statistics, and task updates across multiple UI components
- Built a class-based architecture with clear separation of concerns
- Implemented event-driven updates to keep everything in sync

**Data persistence reliability:** Handling localStorage failures and data corruption gracefully
- Added comprehensive error handling with try-catch blocks
- Implemented data validation on import/export operations

**Professional UI design:** Creating a polished interface that showcases design skills
- Applied glassmorphism effects with backdrop-filter and custom animations
- Used CSS custom properties for maintainable, scalable styling
- Implemented responsive design with mobile-first principles

**Advanced user interactions:** Going beyond basic CRUD to include real productivity features
- Added duplicate detection, bulk operations, and data export capabilities
- Implemented keyboard shortcuts and accessibility features
- Created smooth animations and loading states for better UX

## What I Learned

- **Advanced JavaScript patterns:** Class-based architecture, error handling, and async operations
- **Modern CSS techniques:** Custom properties, glassmorphism, grid layouts, and complex animations  
- **User experience design:** Loading states, notifications, accessibility, and progressive enhancement
- **Data management:** localStorage best practices, import/export functionality, data validation
- **Performance optimization:** Efficient DOM updates, event delegation, and CSS animation performance

## Browser Support

Works in all modern browsers supporting ES6 classes and CSS custom properties:
- Chrome/Edge 60+
- Firefox 55+
- Safari 12+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Project Structure

```
smart-todo-app/
├── index.html          # Main HTML structure
├── css/
│   └── style.css      # Professional styling with glassmorphism
├── js/
│   └── app.js         # Class-based JavaScript architecture
├── sw.js              # Service worker for offline functionality
└── README.md          # Project documentation
```

## Performance Features

- **Lightweight:** No external dependencies except Tailwind CDN
- **Offline Ready:** Service worker caches resources for offline use
- **Fast Loading:** Optimized CSS animations and minimal JavaScript
- **Memory Efficient:** Proper event cleanup and DOM management

## Future Enhancements

- [ ] Task categories and tagging system
- [ ] Due date reminders with browser notifications
- [ ] Collaborative task sharing with real-time sync
- [ ] Dark/light theme toggle
- [ ] Advanced filtering and search functionality
- [ ] Task templates for recurring items

## Contact

**Kimiya Razdar**  
Razdarkim@gmail.com  
[GitHub](https://github.com/Kimiya00)  

---

Built with attention to detail, user needs, and probably too much coffee.