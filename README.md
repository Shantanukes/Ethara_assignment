# 📋 TaskFlow - Comprehensive Technical Overview

TaskFlow is a deeply integrated, modern Kanban-style project and task management web application built from the ground up using the **MERN Stack** (MongoDB, Express, React, Node.js). 

This project was built to demonstrate proficiency in full-stack architecture, role-based access control, responsive UI/UX design, and RESTful API development.

---

## 🚀 Live Environments

- **Frontend (Production - Vercel):** [https://ethara-assignment-eta.vercel.app](https://ethara-assignment-eta.vercel.app)
- **Backend (Production - Railway):** [https://etharaassignment-production-c6a6.up.railway.app](https://etharaassignment-production-c6a6.up.railway.app)

*Note: You can use the Demo Accounts listed on the login page to securely test the application without creating a new user.*

---

## 🏗️ Technical Architecture

### Frontend (Client-Side)
- **React.js + Vite:** Chosen for blazing-fast HMR (Hot Module Replacement) and optimized production builds.
- **State Management:** Handled via elevated React hooks (`useState`, `useEffect`) at the `App.jsx` level, propagating data down through props to maintain a single source of truth.
- **UI/UX & Styling:** Custom CSS with modern properties (CSS Grid/Flexbox, `clamp()`, radial gradients, backdrop filters) to achieve a glass-morphic, premium aesthetic without the bulk of UI libraries.
- **Network Requests:** `axios` is configured with a dynamic `baseURL` (`VITE_API_URL`) to seamlessly switch between local development and production environments.

### Backend (Server-Side)
- **Node.js & Express.js:** A robust, unopinionated routing structure separating logic into `/users`, `/projects`, and `/tasks`.
- **Database Integration:** Utilizes `mongoose` to strictly define data schemas and manage relationships between collections in MongoDB Atlas.
- **Data Seeding:** A built-in `seed.js` script allows for rapid populating of realistic mock data, ensuring smooth deployments and testing.

---

## 🔐 Deep Dive into Features

### 1. Role-Based Access Control (RBAC)
The application enforces strict data visibility based on the user's role:
- **Admins:** Have global visibility. They can create, view, edit, and delete any project and task across the entire workspace.
- **Members:** Have scoped visibility. They can only see and interact with Projects where they have been explicitly added as a `member`. 

### 2. Kanban Task Management
Tasks are the core of the application. They feature:
- **Statuses:** `To Do`, `In Progress`, `Done`.
- **Priorities:** `Low`, `Medium`, `High` (color-coded for urgency).
- **Assignments:** Tasks belong to specific Projects and are assigned to specific Users.

### 3. Real-time UI Updates
When a task is moved to a new column or a project is deleted, the frontend optimistically updates the React state array in memory, resulting in an instant, zero-latency feel for the user, while asynchronously syncing the mutation with the database in the background.

---

## 🗄️ Database Schema Definition

TaskFlow utilizes three primary MongoDB Collections, heavily linked via `ObjectId` references:

### `User` Model
- `name` (String, required)
- `email` (String, required, unique)
- `password` (String, required) - *(Note: In a production environment, this should be hashed via bcrypt)*
- `role` (String, enum: `admin`, `member`)
- `initials` & `color` (String) - Used for auto-generating user avatars.

### `Project` Model
- `name` (String, required)
- `description` (String)
- `createdBy` (ObjectId `ref: 'User'`)
- `members` (Array of ObjectId `ref: 'User'`) - Dictates which members have read/write access.

### `Task` Model
- `projectId` (ObjectId `ref: 'Project'`)
- `title` (String, required)
- `description` (String)
- `assignedTo` (ObjectId `ref: 'User'`)
- `status` (String, required)
- `priority` (String, required)
- `dueDate` (Date)

---

## 🔌 API Reference Overview

The Express backend exposes the following RESTful endpoints:

* **Users API**
  * `GET /users/` - Fetch all users
  * `POST /users/add` - Register a new user

* **Projects API**
  * `GET /projects/` - Fetch all projects
  * `POST /projects/add` - Create a new project
  * `DELETE /projects/:id` - Delete a project (cascades manually in frontend)

* **Tasks API**
  * `GET /tasks/` - Fetch all tasks
  * `POST /tasks/add` - Create a new task
  * `POST /tasks/update/:id` - Update task status/details
  * `DELETE /tasks/:id` - Delete a task

---

## 📁 Repository Structure

```
Ethara_assignment/
├── backend/                  # Express/MongoDB Server
│   ├── models/               # Mongoose schemas (user, project, task)
│   ├── routes/               # Express API endpoints
│   ├── .env                  # Backend environment variables
│   ├── seed.js               # Database population script
│   └── server.js             # Main application entry point
├── frontend/                 # React/Vite Client
│   ├── src/
│   │   ├── components/       # Reusable UI elements (Sidebar, Modals, Forms)
│   │   ├── screens/          # Main page views (Auth, Dashboard, Projects, Tasks)
│   │   ├── App.jsx           # Root component and Global State manager
│   │   ├── App.css           # Global design system variables
│   │   └── constants.js      # Shared configurations and utilities
│   ├── .env                  # Frontend environment variables
│   └── vite.config.js        # Bundler configuration
└── README.md                 # Project documentation
```

---

## ⚙️ Exhaustive Local Setup Guide

Follow these steps to run the full stack locally:

### Prerequisites
- Node.js installed (v16+)
- A MongoDB cluster URL (or local MongoDB server)

### 1. Database Setup
1. Open a terminal and navigate to the backend:
   ```bash
   cd backend
   npm install
   ```
2. Create a `.env` file in the `backend/` folder:
   ```env
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   ```
3. **(Highly Recommended)** Seed the database to populate it with test projects, users, and tasks:
   ```bash
   npm run seed
   ```
4. Start the backend server:
   ```bash
   npm run dev
   # Server will run on http://localhost:5000
   ```

### 2. Client Setup
1. Open a new terminal window and navigate to the frontend:
   ```bash
   cd frontend
   npm install
   ```
2. Create a `.env` file in the `frontend/` folder to link the API:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`. You can log in using the demo accounts generated by the seed script!
