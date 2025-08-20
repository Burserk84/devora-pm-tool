---
# Devora - Full-Stack Project Management Tool

Devora is a complete, full-stack project management application inspired by tools like Trello and Asana. It allows users to manage projects, organize tasks in an interactive Kanban board, and collaborate with team members in real-time. This project was built from scratch to demonstrate a wide range of modern web development skills.
---

## Features

- **Full User Authentication:** Secure user registration and login using JWT.
- **Project & Task Management:** Full CRUD (Create, Read, Update, Delete) operations for projects and tasks.
- **Interactive Kanban Board:** Drag-and-drop tasks between columns to update their status.
- **Real-Time Chat:** A dedicated chat room for each project using WebSockets (Socket.IO).
- **In-App Notifications:** Users receive real-time notifications for important events like task assignments and project invitations.
- **Collaboration System:** Project admins can invite users and manage their roles (`ADMIN` / `MEMBER`).
- **Advanced Permissions:** A robust, role-based access control system on the backend.
- **User Profiles & Settings:** Users can update their name and professional title.
- **Search & Filtering:** Instantly search tasks by title or filter by assignee on the Kanban board.
- **Responsive Design:** A clean and functional UI that works on both desktop and mobile devices.
- **Professional Polish:** Features like loading skeletons and robust form validation with Zod.

---

## Tech Stack

### **Frontend**

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Context
- **Real-Time:** Socket.IO Client
- **Forms:** React Hook Form & Zod for validation

### **Backend**

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Real-Time:** Socket.IO

---

## Local Setup

To run this project locally, you will need Node.js, npm, and Docker installed.

### 1\. Clone the Repository

```bash
git clone https://github.com/your-username/devora-pm-tool.git
cd devora-pm-tool
```

### 2\. Setup Backend

Navigate to the server directory, create an environment file, and install dependencies.

```bash
cd server
npm install
```

Create a `.env` file in the `/server` directory and add the following variables:

```
# .env
DATABASE_URL="postgresql://devora_user:devora_password@localhost:5432/devora_db"
JWT_SECRET="your_super_secret_and_long_random_string"
PORT=5001
```

### 3\. Setup Frontend

In a new terminal, navigate to the client directory and install dependencies.

```bash
cd client
npm install
```

### 4\. Start the Database

From the **root** `devora-pm-tool/` directory, start the PostgreSQL database using Docker.

```bash
docker-compose up -d
```

This will start a database container in the background.

### 5\. Run Database Migrations

Navigate back to the server directory and run the Prisma migrations to create your database tables.

```bash
cd server
npx prisma migrate dev
```

### 6\. Run the Application

You will need two terminals open to run both the frontend and backend servers.

**In your first terminal (Backend):**

```bash
cd server
npm run dev
```

The backend will be running on `http://localhost:5001`.

**In your second terminal (Frontend):**

```bash
cd client
npm run dev
```

The frontend will be running on `http://localhost:3000`. You can now open this URL in your browser.

---

## License

This project is licensed under the MIT License.

---

## Contact

Amirali Sharifi Asl - [sharifiasldev.ir](https://sharifiasldev.ir)
