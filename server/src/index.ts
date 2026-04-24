import cors from "cors";
import "dotenv/config";
import express from "express";
import path from "path";
import { JsonRepo } from "./data/jsonRepo";
import { QuotaTracker } from "./middleware/quota";
import { VectorStore } from "./rag/store";
import { adminRouter } from "./routes/admin";
import { chatRouter } from "./routes/chat";
import { eventsRouter } from "./routes/events";

const app = express();
const PORT = Number(process.env.PORT || 3001);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000";
const DATA_DIR = path.resolve(process.env.DATA_DIR || "./data");
const KNOWLEDGE_FILE = path.resolve(
  process.env.KNOWLEDGE_FILE || path.join(DATA_DIR, "knowledge.json"),
);
const COUNTERS_FILE = path.join(DATA_DIR, "counters.json");
const NODE_ENV = process.env.NODE_ENV || "development";

const repo = new JsonRepo(DATA_DIR);
const store = new VectorStore(KNOWLEDGE_FILE);
const quota = new QuotaTracker(COUNTERS_FILE);
void store.load();
void quota.load();

const allowedOrigins = CLIENT_ORIGIN.split(",").map((o) => o.trim()).filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (NODE_ENV !== "production") {
        cb(null, true);
        return;
      }
      if (!origin) {
        cb(new Error("origin required"));
        return;
      }
      if (allowedOrigins.includes(origin)) {
        cb(null, true);
        return;
      }
      cb(new Error(`origin ${origin} not allowed`));
    },
    credentials: false,
  }),
);
app.use(express.json({ limit: "64kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile" });
});

app.use("/api", chatRouter(repo, store, quota, DATA_DIR));
app.use("/api", eventsRouter(repo));
app.use("/api", adminRouter(repo, quota));

app.listen(PORT, () => {
  console.log(
    `[chatbot-server] listening on :${PORT} | env=${NODE_ENV} | origins=${allowedOrigins.join(",")} | data=${DATA_DIR}`,
  );
});
