const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const url = require("url");
const https = require("https");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors()); // Enable CORS for the frontend
app.use(bodyParser.json()); // Parse JSON bodies
app.use(express.static(path.join(__dirname, "build"))); // Serve static files
app.use("/images", express.static(path.join(__dirname, "public/images")));

// Load data once at startup
const loadData = (filePath) => {
  try {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading data from ${filePath}:`, error);
    return null;
  }
};

const ambigousDataFilePath = path.join(__dirname, "data/ivc-ambigous.json");
const unambigousDataFilePath = path.join(__dirname, "data/ivc-unambigous.json");

// Store the loaded data in memory
const ambigousData = loadData(ambigousDataFilePath);
const unambigousData = loadData(unambigousDataFilePath);

// In-memory buffers to store changes
let ambigousDataBuffer = {};
let unambigousDataBuffer = {};

// Interval (in milliseconds) for flushing the buffers to disk
const FLUSH_INTERVAL = 60000; // 60 seconds

app.get("/fetch-image", (req, res) => {
  let imageUrl = req.query.url; // Get the image URL from the query parameter

  // check if the

  if (!imageUrl) {
    return res.status(400).send("Image URL is required");
  }

  if (imageUrl.startsWith("http://")) {
    imageUrl = imageUrl.replace("http://", "https://");
  }
  const parsedUrl = url.parse(imageUrl);
  console.log(`image_URL:${imageUrl}`);

  // Check if the URL is valid
  if (!parsedUrl.protocol || !parsedUrl.host) {
    return res.status(400).send("Invalid image URL");
  }

  // Fetch the image, bypassing SSL certificate validation
  https
    .get(imageUrl, { rejectUnauthorized: false }, (response) => {
      let data = "";

      // Accumulate the binary data
      response.setEncoding("binary");
      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        // Send the image data to the client
        res.writeHead(200, { "Content-Type": "image/jpeg" });
        res.end(data, "binary");
      });
    })
    .on("error", (err) => {
      console.error("Error fetching image:", err);
      res.status(500).send("Error fetching image");
    });
});

// Helper function to update the buffer
const bufferUpdate = (data, ambiguous, index) => {
  const buffer =
    ambiguous === "true" ? ambigousDataBuffer : unambigousDataBuffer;
  buffer[index] = data; // Store or overwrite the entry by index
};

// Periodic flush function to write buffered changes to the file
const flushBuffers = () => {
  if (Object.keys(ambigousDataBuffer).length > 0) {
    flushData(ambigousData, ambigousDataFilePath);
  }

  if (Object.keys(unambigousDataBuffer).length > 0) {
    flushData(unambigousData, unambigousDataFilePath);
  }
};

// Function to write the buffered data to the file
const flushData = (buffer, filePath) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(buffer, null, 2));
  } catch (error) {
    console.error(`Error writing data to ${filePath}:`, error);
  }
};

// // Load data once at startup
// const ambigousData = loadDataFromLog(ambigousDataFilePath);
// const unambigousData = loadDataFromLog(unambigousDataFilePath);

// Set interval to periodically flush buffers
setInterval(flushBuffers, FLUSH_INTERVAL);

// API Routes
app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

app.get("/api/users", (req, res) => {
  const data = req.query.ambiguous === "true" ? ambigousData : unambigousData;
  res.json({
    length: data.length,
  });
});

app.get("/api/users/:id", (req, res) => {
  const data = req.query.ambiguous === "true" ? ambigousData : unambigousData;
  const userIndex = parseInt(req.params.id);
  const user = data[userIndex];
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

app.put("/api/users/:id/selectedQuestions", (req, res) => {
  const data = req.query.ambiguous === "true" ? ambigousData : unambigousData;
  const userIndex = parseInt(req.params.id);
  if (userIndex !== -1) {
    data[userIndex].selected_questions = req.body.selected_questions;
    bufferUpdate(data[userIndex], req.query.ambiguous, userIndex);
    res.json(data[userIndex]);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

app.put("/api/users/:id/modifyQuestion", (req, res) => {
  const data = req.query.ambiguous === "true" ? ambigousData : unambigousData;
  const userIndex = parseInt(req.params.id);
  if (userIndex !== -1) {
    const questionIndex = req.body.index;
    if (questionIndex < data[userIndex].questions.length) {
      data[userIndex].questions[questionIndex] = req.body.question;
    } else {
      data[userIndex].questions.push(req.body.question);
    }
    bufferUpdate(data[userIndex], req.query.ambiguous, userIndex);
    res.json(data[userIndex]);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

app.put("/api/users/:id/discardQuestions", (req, res) => {
  const data = req.query.ambiguous === "true" ? ambigousData : unambigousData;
  const userIndex = parseInt(req.params.id);
  if (userIndex !== -1) {
    const questionIndex = req.body.index;
    data[userIndex].questions[questionIndex] =
      data[userIndex].original_questions[questionIndex];
    bufferUpdate(data[userIndex], req.query.ambiguous, userIndex);
    res.json(data[userIndex]);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

app.put("/api/users/:id/selectedParts", (req, res) => {
  console.log("recieved");
  const data = req.query.ambiguous === "true" ? ambigousData : unambigousData;
  const userIndex = parseInt(req.params.id);
  if (userIndex !== -1) {
    data[userIndex].selected_parts_polygons = req.body.selected_parts_polygons;
    bufferUpdate(data[userIndex], req.query.ambiguous, userIndex);
    res.json(data[userIndex]);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

app.put("/api/users/:id/selectedObjects", (req, res) => {
  const data = req.query.ambiguous === "true" ? ambigousData : unambigousData;
  const userIndex = parseInt(req.params.id);
  if (userIndex !== -1) {
    data[userIndex].selected_objects_polygons =
      req.body.selected_objects_polygons;
    bufferUpdate(data[userIndex], req.query.ambiguous, userIndex);
    res.json(data[userIndex]);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

app.put("/api/users/:id/unSelectAll", (req, res) => {
  const data = req.query.ambiguous === "true" ? ambigousData : unambigousData;
  const userIndex = parseInt(req.params.id);
  if (userIndex !== -1) {
    data[userIndex].selected_parts_polygons = [];
    data[userIndex].selected_objects_polygons = [];
    bufferUpdate(data[userIndex], req.query.ambiguous, userIndex);
    res.json(data[userIndex]);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Catch-all route to serve the React app's index.html (for React Router)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./build", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
