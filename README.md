# Todo App - Full-Stack Task Manager

A production-ready To-Do application built with React (frontend) and Node.js/Express (backend). Users can create, view, edit, delete tasks with priorities and categories. Tasks persist across sessions via a SQLite database. Includes bonus features like filtering, real-time search, drag-and-drop reordering, and a stats dashboard.

![App Screenshot](https://via.placeholder.com/800x600?text=Todo+App+Screenshot) <!-- Add real screenshot later -->

## Features

### Core Features
- **Create Tasks**: Add tasks with title, priority (Low/Medium/High), and category (Work/Personal/Shopping/Other).
- **View Tasks**: Display all tasks with color-coded priorities and creation dates.
- **Edit Tasks**: Inline editing for titles; toggle completion status.
- **Delete Tasks**: Remove tasks with confirmation (basic).
- **Persistence**: Tasks saved to SQLite database (full-stack) or localStorage (frontend-only).

### Bonus Features
- **Filtering**: Show All/Active/Completed tasks.
- **Search**: Real-time, debounced search by task title.
- **Drag-and-Drop Reordering**: Intuitive reordering using `react-beautiful-dnd`.
- **Statistics Dashboard**: Counts for total/active/completed/high-priority tasks.
- **Responsive Design**: Mobile-friendly with gradients and modern UI.
- **Accessibility**: ARIA labels, keyboard navigation.

## Technology Choices

- **Frontend**: React 18 (hooks for state/logic), `react-beautiful-dnd` for drag-drop. Chosen for component reusability and performance.
- **Backend**: Node.js/Express (RESTful API), SQLite (lightweight DB for simplicity). Axios for HTTP client.
- **Styling**: Vanilla CSS (no frameworks) for custom gradients/responsiveness.
- **State Management**: Custom hooks (no Redux) to keep it lightweight.
- **Persistence**: SQLite for production-like setup; localStorage fallback for dev.
- **Other**: Debouncing for search, optimistic updates for UX.

## Architecture Decisions

- **Separation of Concerns**: 
  - UI: Small, single-responsibility components (e.g., `TaskItem` only renders one task).
  - Logic: `useTaskManager` hook handles all business rules (CRUD, filter/search).
  - Data: `api.js` service layer isolates persistence (easy to swap DBs).
- **Clean Code Principles**: Readable functions, DRY (utils/helpers), error handling (try-catch), meaningful comments (why, not what). No over-abstraction—pragmatic React patterns.
- **Folder Structure**: Logical grouping (components/hooks/services/utils/constants) for maintainability.
- **API Design**: RESTful endpoints (GET/POST/PUT/DELETE `/tasks`). Interceptors for error/auth.
- **Testing**: Unit-ready (e.g., hook testable in isolation); add Jest later.

## How to Run

### Prerequisites
- Node.js >= 18
- npm/yarn

### Frontend (Standalone - Uses localStorage)
1. `cd frontend`
2. `npm install`
3. `npm start` (runs on http://localhost:3000)

### Full-Stack (Frontend + Backend)
1. **Backend**:
   - `cd backend`
   - `npm install`
   - `npm run dev` (runs on http://localhost:5000)
2. **Frontend**:
   - In new terminal: `cd frontend`
   - `npm install`
   - Add `REACT_APP_API_URL=http://localhost:5000/api` to `.env`
   - `npm start`
3. Access app at http://localhost:3000. Tasks now persist via DB.

### Development Scripts
- Backend: `npm run dev` (nodemon for hot-reload)
- Frontend: `npm start` (hot-reload)
- Build: `npm run build` (frontend production build)

## API Documentation

Once backend is running:

| Endpoint | Method | Description | Body/Example |
|----------|--------|-------------|--------------|
| `/api/tasks` | GET | Fetch all tasks | - |
| `/api/tasks` | POST | Create task | `{ "title": "Buy milk", "priority": "low", "category": "shopping" }` |
| `/api/tasks/:id` | PUT | Update task | `{ "title": "Updated", "completed": true }` |
| `/api/tasks/:id` | DELETE | Delete task | - |
| `/api/tasks/reorder` | PUT | Reorder tasks | `{ "order": [id1, id2, ...] }` |

Responses: JSON with 200 OK or 4xx/5xx errors.

## Future Improvements

- **Authentication**: Add JWT for user-specific tasks.
- **Advanced Search**: Filter by category/priority/date.
- **Notifications**: Email/SMS for due dates (add `dueDate` field).
- **Testing**: Full Jest/Cypress suite.
- **Deployment**: Dockerize for Heroku/Vercel; migrate to PostgreSQL.
- **PWA**: Offline support with Service Workers.
- **Analytics**: Track user behavior with Google Analytics.

## Code Quality Standards

- **Linting**: ESLint + Prettier (add scripts if needed).
- **Commit Style**: Conventional Commits.
- **CI/CD**: GitHub Actions for tests/builds.
- **Security**: Sanitize inputs; CORS in backend.

This project demonstrates clean, scalable engineering without unnecessary complexity. Contributions welcome!

---

*Built with ❤️ by [Your Name] | October 2025*