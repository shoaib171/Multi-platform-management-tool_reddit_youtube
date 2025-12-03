# Task Management App
A simplified Task Management API and Frontend for multi-platform "social tasks".

## Tech Stack

- **Backend**: Node.js, Express, TypeScript, MongoDB (Mongoose)
- **Frontend**: Next.js, TypeScript, CSS Modules
- **Authentication**: JWT (Bonus)

## Prerequisites

- Node.js (v14+)
- MongoDB (Local or Atlas)

## Getting Started

### Backend

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (or use the provided one):
   ```env
   PORT=4000
   MONGO_URI=mongodb://localhost:27017/mern-assessment
   JWT_SECRET=supersecretkey
   ```

4. Run the server:
   - Development: `npm run dev`
   - Production Build: `npm run build` then `npm start`

The API will run on `http://localhost:4000`.

### Frontend

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

The application will run on `http://localhost:3000`.

## Features

- **Create Tasks**: Support for Reddit, YouTube, and Trustpilot tasks.
- **List Tasks**: Filter by status and platform.
- **Task Details**: View and update task status.
- **Analytics**: View platform-specific statistics.
- **Authentication**: Register and Login to manage tasks.

## API Endpoints

- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Login.
- `GET /api/tasks`: Get all tasks (filters: status, platform).
- `POST /api/tasks`: Create a task (Protected).
- `GET /api/tasks/:id`: Get a task by ID.
- `PUT /api/tasks/:id`: Update a task (Protected).
- `GET /api/stats/platform-summary`: Get analytics.

## License

MIT
