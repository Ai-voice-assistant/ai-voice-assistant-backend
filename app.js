import dotenv from "dotenv";
dotenv.config();

import { deleteUser, getAllUser, login, signup, verify } from "./controllers/auth.js";

import cors from "cors";
import express from "express";
import { sendMail } from "./lib/sendMail.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to application.",
    status: 200,
  });
});

app.post("/signup", signup);
app.post("/login", login);
app.post("/verify", verify);
app.delete("/user/delete",deleteUser)
app.get('/users',getAllUser)

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}.`);
});
app.use((req, res, next) => {
  res.status(404).json({
    message:
      "Ohh you are lost, read the API documentation to find your way back home :)",
  });
});
