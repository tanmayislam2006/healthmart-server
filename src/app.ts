import express, { Application } from "express";
import cors from 'cors'
const app: Application = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.APP_URL,
    credentials: true,
  }),
);
app.get("/", (req, res) => {
  res.send("Health Mart Server Is Running");
});
export default app;
