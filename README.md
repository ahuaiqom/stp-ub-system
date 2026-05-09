STP-UB-System Setup Guide (For Team Members)
1. Clone Repository

Open terminal in VS Code:

git clone https://github.com/ahuaiqom/stp-ub-system.git

Move into project folder:

cd stp-ub-system
FRONTEND SETUP
2. Move to Frontend
cd frontend
3. Install Frontend Dependencies
npm install
4. Install Tailwind CSS
npm install tailwindcss @tailwindcss/vite
5. Configure Vite for Tailwind

Edit:

frontend/vite.config.ts

Paste:

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
6. Configure Tailwind CSS

Edit:

frontend/src/index.css

Paste:

@import "tailwindcss";
7. Run Frontend
npm run dev

Frontend runs at:

http://localhost:5173
BACKEND SETUP

Open a NEW terminal.

8. Move to Backend
cd backend
9. Install Backend Dependencies
npm install
10. Install PostgreSQL Driver
npm install pg

Install TypeScript types:

npm install -D @types/pg
11. Install Authentication Packages
npm install bcryptjs jsonwebtoken

Install TypeScript types:

npm install -D @types/bcryptjs @types/jsonwebtoken
12. Install Other Required Packages
npm install express cors dotenv

Install TypeScript types:

npm install -D @types/express @types/cors
DATABASE SETUP
13. Open PostgreSQL / pgAdmin

Create database:

CREATE DATABASE stp_ub_db;
14. Create .env File

Inside:

backend/

Create file:

.env

Paste:

PORT=5000

DB_USER=postgres
DB_HOST=localhost
DB_NAME=stp_ub_db
DB_PASSWORD=your_postgres_password
DB_PORT=5432

JWT_SECRET=supersecretkey

Replace:

your_postgres_password

with your PostgreSQL password.

Example:

DB_PASSWORD=admin123
DATABASE CONNECTION
15. Configure PostgreSQL Connection

Create file:

backend/src/config/db.ts

Paste:

import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

pool.connect()
  .then(() => {
    console.log("✅ PostgreSQL Connected");
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err);
  });
EXPRESS SERVER
16. Configure Backend Server

Edit:

backend/src/index.ts

Paste:

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./config/db";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
RUN BACKEND
17. Run Backend Server

Inside backend:

npm run dev

Backend runs at:

http://localhost:5000

Expected terminal result:

Server running on port 5000
✅ PostgreSQL Connected
TEST APPLICATION
Frontend

Open:

http://localhost:5173
Backend

Open:

http://localhost:5000

Expected result:

API Running...
