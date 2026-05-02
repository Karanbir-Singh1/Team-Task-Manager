3# 🚀 Team Task Manager (Full-Stack SaaS Application)

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A production-ready, full-stack Task Management platform designed for modern teams. This project demonstrates proficiency in building scalable RESTful APIs, implementing robust Role-Based Access Control (RBAC), and crafting a highly polished, premium user interface using modern React and Tailwind CSS.

---

## 🎯 Project Overview

This application serves as a centralized hub for teams to coordinate projects, assign tasks, and track delivery progress. It was built to showcase a complete end-to-end development lifecycle—from designing a normalized MongoDB schema and securing a Node.js backend with JWT authentication, to creating a dynamic, theme-aware frontend that rivals enterprise SaaS products.

### ✨ Key Technical Achievements
- **Premium UI/UX Engineering**: Implemented custom keyframe animations, staggered "waterfall" list loading, and dynamic background gradients to create a premium user experience.
- **Advanced State & Theming**: Engineered a persistent, flicker-free Dark/Light mode system utilizing Tailwind's class-based strategy and React Context API.
- **Role-Based Access Control (RBAC)**: Securely segregated user experiences. **Admins** have full CRUD authority over projects and assignments, while **Members** operate in a restricted workspace focused on their assigned tasks.
- **RESTful API Design**: Built a secure, predictable, and fully validated API layer using Express.js and Joi.

---

## 💻 Tech Stack Architecture

### Frontend (Client)
- **Framework**: React.js (Vite) with React Router v6
- **Styling**: Tailwind CSS v3 (Custom design tokens, CSS variables, layered components)
- **Data Visualization**: Recharts (Theme-aware interactive dashboards)
- **HTTP Client**: Axios (Configured with interceptors for auth headers)
- **Icons & UI**: Lucide React, React Hot Toast

### Backend (Server)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT) & bcrypt for secure password hashing
- **Validation**: Joi (Strict payload validation middleware)

---

## ⚙️ Local Development & Setup Instructions

Follow these instructions to get a local copy up and running.

### Prerequisites
- **Node.js**: v16.0.0 or higher
- **MongoDB**: A running local instance or a MongoDB Atlas connection string.
- **Git**: To clone the repository.

### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/Karanbir-Singh1/YOUR-REPO-NAME.git
cd YOUR-REPO-NAME

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

### 2. Environment Configuration
You need to set up environment variables for both the client and server.

**Server (`server/.env`):**
Create a `.env` file in the `server` directory and add the following:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/task-manager   # Replace with your Atlas URI if using cloud DB
JWT_SECRET=your_super_secret_jwt_key_here            # Must be a strong, random string
NODE_ENV=development
```

**Client (`client/.env`):**
Create a `.env` file in the `client` directory and add the following:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Running the Application
You will need two terminal windows to run the client and server concurrently.

**Terminal 1 (Start the Backend):**
```bash
cd server
npm start
# Server should now be running on http://localhost:5000
```

**Terminal 2 (Start the Frontend):**
```bash
cd client
npm run dev
# Client should now be running on http://localhost:5173
```

---

## 🔐 Authentication & Roles

To test the application, you can create new users via the Signup page. The system supports two roles:

1. **Admin**: Can create projects, invite users, assign tasks, and delete records.
2. **Member**: Can only view projects they are a part of, see assigned tasks, and update task statuses (e.g., Todo -> In Progress -> Completed).

---

## 📡 Core API Endpoints

The backend exposes a RESTful API. All protected routes require a Bearer token (`Authorization: Bearer <token>`).

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/auth/signup` | Register a new user | Public |
| `POST` | `/api/auth/login` | Authenticate user & get token | Public |
| `GET`  | `/api/projects` | Fetch visible projects | Admin/Member |
| `POST` | `/api/projects` | Create a new project | Admin Only |
| `GET`  | `/api/tasks` | Fetch tasks (filtered by user/project) | Admin/Member |
| `PATCH`| `/api/tasks/:id/status`| Update task status | Admin/Assigned Member |
| `GET`  | `/api/tasks/stats/summary`| Get analytics for the dashboard | Admin/Member |

---

## 🚀 Future Enhancements (Roadmap)
- **Drag-and-Drop Kanban Board**: Implement `react-beautiful-dnd` for visual task management.
- **Real-time Notifications**: Integrate Socket.io to push live updates when a task is assigned.
- **OAuth Integration**: Allow users to sign in seamlessly via Google or GitHub.

