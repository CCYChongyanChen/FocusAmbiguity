const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 4000;

// Middleware
app.use(cors()); // Enable CORS for the frontend
app.use(bodyParser.json()); // Parse JSON bodies
app.use("/images", express.static(path.join(__dirname, "public/images")));

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

app.get("/", (req, res) => {
  res.send("Welcome to the Users API!");
});
// GET: Retrieve all data from the JSON file
app.get("/api/users", (req, res) => {
  const data = readData();
  res.json(data);
});

// GET: Retrieve a single user by ID
app.get("/api/users/:id", (req, res) => {
  const data = readData();
  const user = data.find((user) => user.id === parseInt(req.params.id));
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// PUT: Update an existing user by ID
app.put("/api/users/:id", (req, res) => {
  const data = readData();
  const userIndex = data.findIndex(
    (user) => user.id === parseInt(req.params.id),
  );

  if (userIndex !== -1) {
    data[userIndex].selectedQuestions = req.body.selectedQuestions;
    writeData(data);
    res.json(data[userIndex]);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
