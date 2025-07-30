# Ankit-To-Do-List

A modern, animated To-Do app with dark/light mode, advanced sorting, auto-delete, notifications, and persistent storage.

## Features
- Add, complete, edit, and delete tasks
- Set due date and time for each task (defaults to today and midnight if not chosen)
- Priority selection (Low, Medium, High)
- Overdue tasks automatically shown at the top and highlighted in red
- Completed tasks sorted to the bottom
- Inline editing for tasks
- Filter by All / Active / Completed
- Progress bar for completed tasks
- Toggle dark/light mode
- Mark tasks as important (starred)
- Starred tasks sorted to top
- Notification for tasks nearing due time
- Undo last deleted task
- Auto-delete completed tasks after 2 minutes
- Advanced sorting: by due date/time, then priority, then overdue/incomplete/completed
- Smooth animations for adding/removing tasks
- Responsive and accessible design
- Tasks saved in localStorage

## Usage
Open `index.html` in your browser to use the app.

## How it works
- If no due date/time is chosen, today's date and 23:59 (midnight) are set by default.
- Overdue incomplete tasks are shown at the top, completed tasks at the bottom.
- Completed tasks are auto-deleted after 2 minutes.
- Notifications alert you when a task is nearing its due time.
- Undo button allows you to restore the last deleted task.
- All data is saved locally in your browser.
