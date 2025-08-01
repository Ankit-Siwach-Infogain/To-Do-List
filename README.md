# To-Do-List

A modern, animated To-Do app with dark/light mode, advanced sorting, auto-delete, notifications, and persistent storage.

## Overview
This project is a feature-rich To-Do List web application designed for productivity and motivation. It includes:
- Motivational quotes with smooth animations
- Responsive, accessible design
- Persistent local storage
- Advanced sorting and filtering
- Task notifications and auto-delete

## Features
- **Add, complete, edit, and delete tasks**
- **Set due date and time for each task** (defaults to today and midnight if not chosen)
- **Priority selection:** Low, Medium, High
- **Overdue tasks** automatically shown at the top and highlighted in red
- **Completed tasks** sorted to the bottom and auto-deleted after 2 minutes
- **Inline editing** for tasks (edit text, due date, time, and priority)
- **Filter tasks:** All / Active / Completed
- **Progress bar** for completed tasks
- **Toggle dark/light mode** for comfortable viewing
- **Mark tasks as important (starred)**; starred tasks sorted to top
- **Notification** for tasks nearing due time
- **Undo last deleted task**
- **Advanced sorting:** by due date/time, then priority, then overdue/incomplete/completed
- **Smooth animations** for adding/removing tasks and motivational quotes
- **Responsive and accessible design** (ARIA roles, keyboard navigation)
- **Tasks saved in localStorage** for persistence

## Usage
1. Clone or download the repository.
2. Open `index.html` in your browser to use the app.
3. Add tasks, set due dates/times, priorities, and manage your list interactively.
4. Use filters, progress bar, and dark/light mode for a personalized experience.

## How it works
- If no due date/time is chosen, today's date and 23:59 (midnight) are set by default.
- Overdue incomplete tasks are shown at the top, completed tasks at the bottom.
- Completed tasks are auto-deleted after 2 minutes.
- Notifications alert you when a task is nearing its due time.
- Undo button allows you to restore the last deleted task.
- All data is saved locally in your browser.
- Motivational quotes animate on the left and right sides of the app for inspiration.

## Accessibility & Responsiveness
- ARIA roles for improved accessibility
- Keyboard navigation supported
- Responsive layout for desktop and mobile
- Quotes hide on small screens for a clean mobile experience

## Customization
- Easily add more motivational quotes in `index.html`
- Style and theme can be customized in `style.css`

## Contributing
Feel free to fork the repository, submit pull requests, or open issues for suggestions and improvements.

## Author
Created by Ankit Siwach
