require("dotenv").config();

const source = process.env.MONGODB_URI;

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const eventsRoutes = require("./routes/events");

const app = express();

const PORT = parseInt(process.env.PORT, 10) || 5000;

// console.log(source);

// Middleware
app.use(
  cors({
    origin: ["https://gloria-hyav.onrender.com/"], // exact frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/events", eventsRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/belal/", (req, res) => {
  res.send("HOLA AMIGO");
  console.log(`went to belal page`);
});
mongoose
  .connect(source)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () =>
      console.log(`Server running on port http://localhost:${PORT}`)
    );
  })
  .catch((error) => console.error("Error connecting to MongoDB:", error));
