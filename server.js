const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for the frontend
app.use(bodyParser.json()); // Parse JSON bodies
app.use("/images", express.static(path.join(__dirname, "public/images")));

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const dataFilePath = path.join(__dirname, "data/ivc-ambigous.json");

// Helper function to read the JSON file
const readData = () => {
  const data = fs.readFileSync(dataFilePath);
  return JSON.parse(data);
};

// Helper function to write to the JSON file
const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "build")));

// API Routes
app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

app.get("/api/users", (req, res) => {
  const data = readData();
  res.json(data);
});

app.get("/api/users/:id", (req, res) => {
  const data = readData();
  const user = data[parseInt(req.params.id)];
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

app.put("/api/users/:id/selectedQuestions", (req, res) => {
  const data = readData();
  const userIndex = parseInt(req.params.id);

  if (userIndex !== -1) {
    data[userIndex].selected_questions = req.body.selected_questions;
    writeData(data);
    res.json(data[userIndex]);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

app.put("/api/users/:id/modifyQuestion", (req, res) => {
  const data = readData();
  const userIndex = parseInt(req.params.id);
  if (userIndex !== -1) {
    let length = data[userIndex].questions.length;
    if (req.body.index < length) {
      data[userIndex].questions[req.body.index] = req.body.question;
      writeData(data);
      res.json(data[userIndex]);
    } else {
      data[userIndex].questions.push(req.body.question);
      writeData(data);
      res.json(data[userIndex]);
    }
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

app.delete("/api/users/:id/selectedQuestions", (req, res) => {
  const data = readData();
  const userIndex = parseInt(req.params.id);

  if (userIndex !== -1) {
    data[userIndex].selected_questions = [];
    writeData(data);
    res.json(data[userIndex]);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

app.put("/api/users/:id/selectedParts", (req, res) => {
  const data = readData();
  const userIndex = parseInt(req.params.id);
  if (userIndex !== -1) {
    data[userIndex].selected_parts_polygons = req.body.selected_parts_polygons;
    writeData(data);
    res.json(data[userIndex]);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

app.put("/api/users/:id/selectedObjects", (req, res) => {
  const data = readData();
  const userIndex = parseInt(req.params.id);
  if (userIndex !== -1) {
    data[userIndex].selected_objects_polygons =
      req.body.selected_objects_polygons;
    writeData(data);
    res.json(data[userIndex]);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Catch-all route to serve the React app's index.html (for React Router)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
