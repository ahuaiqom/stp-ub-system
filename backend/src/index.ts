import dotenv from "dotenv";
dotenv.config();
import express, { type Request, type Response } from "express";
import cors from "cors";

import cookieParser from "cookie-parser";

import "./config/db";
import { ensureDbConnected } from "./config/db";

import authRoutes from "./routes/auth.routes";
import healthRoutes from "./routes/health.routes";
import publicRoutes from "./routes/public.routes";
import userRoutes from "./routes/user.routes";
import contractRoutes from "./routes/contract.routes";
import dataRoutes from "./routes/data.routes";
import queryRoutes from "./routes/query.routes";
import { errorHandler, notFound } from "./middlewares/error.middleware";
import { rateLimit } from "./middlewares/rateLimit.middleware";



const app = express();

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);
app.use(express.json({ limit: "3mb" }));
app.use(cookieParser());
app.use(rateLimit({ windowMs: 60_000, max: 600 }));

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "STP-UB API", version: "0.0.1" });
});

const apiPrefix = "/api";

app.use(`${apiPrefix}/health`,   healthRoutes);
app.use(`${apiPrefix}/auth`,     authRoutes);
app.use(`${apiPrefix}/public`,   publicRoutes);
app.use(`${apiPrefix}/users`,    userRoutes);
app.use(`${apiPrefix}/contract`, contractRoutes);
app.use(`${apiPrefix}/data`,     dataRoutes);
app.use(`${apiPrefix}/query`,    queryRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  void ensureDbConnected();
});
