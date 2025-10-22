# Todo App - Full-Stack Task Manager

A production-ready To-Do app with React (frontend) and Node.js/Express (backend). Manage tasks with priorities, categories, filtering, search, drag-and-drop reordering, and a stats dashboard. Persists via SQLite DB.

## Features
- **CRUD Tasks**: Create, view, edit, delete with title, priority (Low/Medium/High), category (Work/Personal/Shopping/Other).
- **View & Sort**: List tasks with color-coded priorities, dates; ordered by position/creation.
- **Filtering & Search**: All/Active/Completed views; real-time search by title/description.
- **Reordering**: Drag-and-drop to rearrange tasks (updates DB order).
- **Stats Dashboard**: Real-time counts (total/active/completed/high-priority).
- **Responsive UI**: Mobile-friendly with gradients, icons (Lucide), accessibility (ARIA/keyboard).
- **Persistence**: SQLite for full-stack; localStorage fallback.

## Tech Stack
- **Frontend**: React 18 (hooks/state), `@hello-pangea/dnd` (reordering), Axios (API).
- **Backend**: Node/Express (REST API), Sequelize/SQLite (DB).
- **Styling**: Tailwind CSS (gradients/responsive).
- **Other**: Debounced search, optimistic updates; ESLint/Prettier.

## Architecture
- **Layers**: UI (components), Logic (custom hooks), Data (service layer for DB swap).
- **Principles**: Single-responsibility, DRY, error-handling; RESTful API; folder structure (components/hooks/services).
- **Testing**: Unit/integration with Jest/Mocha (mocked, no externals).

## Quick Start

### Prerequisites
- Node.js ≥18, npm.

### Backend
1. `cd backend`
2. `npm install`
3. `npm run dev` (http://localhost:3001; auto-creates `database.sqlite`)

### Frontend
1. `cd frontend`
2. `npm install`
3. Add `.env`: `REACT_APP_API_URL=http://localhost:3001/api`
4. `npm start` (http://localhost:3000)

Test: Add tasks → Persist on refresh. Drag-reorder → Saves order.

## API Endpoints
| Method | Endpoint | Description | Body Example |
|--------|----------|-------------|--------------|
| GET | `/api/tasks` | Fetch all (sorted by order/created_at) | - |
| POST | `/api/tasks` | Create task | `{ "text": "Buy milk", "priority": "low", "category": "shopping" }` |
| PUT | `/api/tasks/:id` | Update (partial) | `{ "text": "Updated", "completed": true }` |
| DELETE | `/api/tasks/:id` | Delete | - |
| PUT | `/api/tasks/reorder` | Reorder | `{ "order": [1, 3, 2] }` |

Responses: JSON (200 OK or 4xx/5xx errors).

## Future Ideas
- JWT auth for users.
- Due dates/notifications.
- Advanced filters (category/priority).
- Jest/Cypress tests; Docker deploy.
- PWA offline support.

Contributions welcome! Built with ❤️ by [BRIGHT] | October 2025