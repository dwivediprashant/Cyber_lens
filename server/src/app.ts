import express from "express";
import cors from "cors";
import resolveOwner from "./utils/resolveOwner";
import { authenticateUserOptional } from "./middleware/authenticateUser";
import resolveRuntimeOwner from "./middleware/resolveRuntimeOwner";
import newsRouter from "./routes/news";
import lookupRouter from "./routes/lookup";
import historyRouter from "./routes/history";
import analyticsRouter from "./routes/analytics";
import router from "./routes";
import { runNewsScraper } from "./services/newsScraper";

const app = express();

const corsOrigin = process.env.CORS_ORIGIN;

if (!corsOrigin) {
  throw new Error("CORS_ORIGIN must be set in environment");
}

app.use(express.json());

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "X-Client-ID", "Authorization"],
  }),
);

app.use(resolveOwner);
app.use(authenticateUserOptional);
app.use(resolveRuntimeOwner);

// TEMPORARY MIDDLEWARE TO PRINT THE OWNER TYPE
// app.use((req, _res, next) => {
//   const owner = req.owner;

//   if (owner?.type === "user") {
//     console.info(`[owner] user ${owner.id}`);
//   } else if (owner?.type === "anonymous") {
//     console.info(`[owner] anonymous ${owner.id}`);
//   } else {
//     console.info("[owner] unresolved");
//   }

//   next();
// });

app.get("/", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/", router);
app.use("/lookup", lookupRouter);
app.use("/history", historyRouter);
app.use("/analytics", analyticsRouter);
app.use("/", router);
app.use("/news", newsRouter);

export default app;
