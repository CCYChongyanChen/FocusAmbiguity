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

// Helper function to read the JSON file
const readData = (ambiguous, index) => {
  // each json file contains 50 items, find the correct file to read
  let hash = Math.floor(index / 50);
  let dataFilePath = "";
  ambiguous = ambiguous === "true";
  if (ambiguous) {
    dataFilePath = path.join(__dirname, `data/ivc-ambigous-${hash}.json`);
  } else {
    dataFilePath = path.join(__dirname, `data/ivc-unambigous-${hash}.json`);
  }
  const data = fs.readFileSync(dataFilePath);
  return JSON.parse(data);
};

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

// Helper function to write to the JSON file
const writeData = (data, ambiguous, index) => {
  // each json file contains 50 items, find the correct file to read
  let hash = Math.floor(index / 50);
  let dataFilePath = "";
  ambiguous = ambiguous === "true";
  if (ambiguous) {
    dataFilePath = path.join(__dirname, `data/ivc-ambigous-${hash}.json`);
  } else {
    dataFilePath = path.join(__dirname, `data/ivc-unambigous-${hash}.json`);
  }
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "build")));

// API Routes
app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

app.get("/api/users", (req, res) => {
  // this is a dirty number, but it is the only way to get the length of the data
  res.json({
    length: 2549,
  });
});

app.put("/api/users/:id/selectedQuestions", (req, res) => {
  const data = readData(req.query.ambiguous, parseInt(req.params.id));
  const userIndex = parseInt(req.params.id) % 50;
  console.log("userIndex", userIndex);
  if (userIndex !== -1) {
    data[userIndex].selected_questions = req.body.selected_questions;
    writeData(data, req.query.ambiguous, parseInt(req.params.id));
    res.json(data[userIndex]);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

app.get("/api/users/:id", (req, res) => {
  const data = readData(req.query.ambiguous, parseInt(req.params.id));
  const userIndex = parseInt(req.params.id) % 50;
  const user = data[userIndex];
  // const user = data[parseInt(req.params.id)];
  // const ambiguous = data[req.params.isambiguous];
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

app.put("/api/users/:id/modifyQuestion", (req, res) => {
  console.log("Request received on /api/users/:id/modifyQuestion");
  const data = readData(req.query.ambiguous, parseInt(req.params.id));
  const userIndex = parseInt(req.params.id) % 50;
  if (userIndex !== -1) {
    let length = data[userIndex].questions.length;
    if (req.body.index < length) {
      data[userIndex].questions[req.body.index] = req.body.question;
      writeData(data, req.query.ambiguous, parseInt(req.params.id));
      res.json(data[userIndex]);
    } else {
      data[userIndex].questions.push(req.body.question);
      writeData(data, req.query.ambiguous, parseInt(req.params.id));
      res.json(data[userIndex]);
    }
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

app.put("/api/users/:id/discardQuestions", (req, res) => {
  console.log("Request received on /api/users/:id/discardQuestions");
  const data = readData(req.query.ambiguous, parseInt(req.params.id));
  const userIndex = parseInt(req.params.id) % 50;
  if (userIndex !== -1) {
    const questionIndex = req.body.index;
    console.log("questionIndex", questionIndex);
    data[userIndex].questions[questionIndex] =
      data[userIndex].original_questions[questionIndex];
    writeData(data, req.query.ambiguous, parseInt(req.params.id));
    res.json(data[userIndex]);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

app.put("/api/users/:id/selectedParts", (req, res) => {
  const data = readData(req.query.ambiguous, parseInt(req.params.id));
  const userIndex = parseInt(req.params.id) % 50;
  if (userIndex !== -1) {
    data[userIndex].selected_parts_polygons = req.body.selected_parts_polygons;
    writeData(data, req.query.ambiguous, parseInt(req.params.id));
    res.json(data[userIndex]);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

app.put("/api/users/:id/selectedObjects", (req, res) => {
  const data = readData(req.query.ambiguous, parseInt(req.params.id));
  const userIndex = parseInt(req.params.id) % 50;
  if (userIndex !== -1) {
    data[userIndex].selected_objects_polygons =
      req.body.selected_objects_polygons;
    writeData(data, req.query.ambiguous, parseInt(req.params.id));
    res.json(data[userIndex]);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

app.put("/api/users/:id/unSelectAll", (req, res) => {
  const data = readData(req.query.ambiguous, parseInt(req.params.id));
  const userIndex = parseInt(req.params.id) % 50;
  if (userIndex !== -1) {
    data[userIndex].selected_parts_polygons = [];
    data[userIndex].selected_objects_polygons = [];
    writeData(data, req.query.ambiguous, parseInt(req.params.id));
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
