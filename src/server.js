import express from "express";
import eventRoutes from "./routes/routes.js";
// import dotenv from "dotenv";
// dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());


app.use("/api/events", eventRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});