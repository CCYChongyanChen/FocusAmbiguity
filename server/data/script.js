const fs = require("fs");
const path = require("path");

// Path to your JSON file
const dataFilePath = path.join(__dirname, "ivc-ambigous.json");

// Read the JSON file
const data = JSON.parse(fs.readFileSync(dataFilePath, "utf-8"));

// Iterate over each entry in the data
data.forEach((entry) => {
  // if (!entry.original_questions && entry.questions) {
  //   // If original_questions is missing, set it to a copy of questions
  //   entry.original_questions = [...entry.questions];
  // }

  if (!entry.selected_questions) {
    entry.selected_questions = [];
  }
});

// Write the updated data back to the file
fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf-8");

console.log("Updated JSON file to include original_questions where missing.");
