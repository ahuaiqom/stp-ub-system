# STP-UB-System Setup Guide (For Team Members)

## 1. Clone Repository

Open terminal in VS Code:

```bash
git clone https://github.com/ahuaiqom/stp-ub-system.git
```

Move into project folder:

```bash
cd stp-ub-system
```

---

# FRONTEND SETUP

## 2. Move to Frontend

```bash
cd frontend
```

## 3. Install Frontend Dependencies

```bash
npm install
```

## 4. Install Tailwind CSS

```bash
npm install tailwindcss @tailwindcss/vite
```

## 5. Configure Vite for Tailwind

Edit:

```text
frontend/vite.config.ts
```

Paste:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

## 6. Configure Tailwind CSS

Edit:

```text
frontend/src/index.css
```

Paste:

```css
@import "tailwindcss";
```

## 7. Run Frontend

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

---

# BACKEND SETUP

Open a **NEW terminal**.

## 8. Move to Backend

```bash
cd backend
```

## 9. Install Backend Dependencies

```bash
npm install
```

## 10. Install PostgreSQL Driver

```bash
npm install pg
```

Install TypeScript types:

```bash
npm install -D @types/pg
```

## 11. Install Authentication Packages

```bash
npm install bcryptjs jsonwebtoken
```

Install TypeScript types:

```bash
npm install -D @types/bcryptjs @types/jsonwebtoken
```

## 12. Install Other Required Packages

```bash
npm install express cors dotenv
```

Install TypeScript types:

```bash
npm install -D @types/express @types/cors
```

---

# DATABASE SETUP

## 13. Open PostgreSQL / pgAdmin

Create database:

```sql
CREATE DATABASE stp_ub_db;
```

## 14. Create `.env` File

Inside:

```text
backend/
```

Create file:

```text
.env
```

Paste:

```env
PORT=5000

DB_USER=postgres
DB_HOST=localhost
DB_NAME=stp_ub_db
DB_PASSWORD=your_postgres_password
DB_PORT=5432

JWT_SECRET=supersecretkey
```

Replace:

```text
your_postgres_password
```

with your PostgreSQL password.

Example:

```env
DB_PASSWORD=admin123
```

---

# DATABASE CONNECTION

## 15. Configure PostgreSQL Connection

Create file:

```text
backend/src/config/db.ts
```

Paste:

```ts
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
```

---

# EXPRESS SERVER

## 16. Configure Backend Server

Edit:

```text
backend/src/index.ts
```

Paste:

```ts
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
```

---

# RUN BACKEND

## 17. Run Backend Server

Inside backend:

```bash
npm run dev
```

Backend runs at:

```text
http://localhost:5000
```

Expected terminal result:

```bash
Server running on port 5000
✅ PostgreSQL Connected
```

---

# TEST APPLICATION

## Frontend

Open:

```text
http://localhost:5173
```

## Backend

Open:

```text
http://localhost:5000
```

Expected result:

```text
API Running...
```
