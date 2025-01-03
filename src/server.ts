import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./lib/db";
import indexRouter from "./routers";
import path from "path";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "src/uploads")));
app.use(cors());

// Routing
app.use(indexRouter);

app.get("/", (req, res) => {
  res.send("CIRCLE APP - API");
});

// Koneksi Prisma DB
(async () => {
  await db.$connect();
  console.log("Database connected");
})();

// Ekspor handler untuk Vercel
export default app;
