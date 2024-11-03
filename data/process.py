import json
import os

# Path to your JSON file
data_file_path = "ivc-unambigous.json"

# Read the JSON data
with open(data_file_path, "r", encoding="utf-8") as file:
    data = json.load(file)

# Iterate over each entry in the data
for entry in data:
    # Check if 'questions' exists and 'original_questions' is missing, and add if needed
    if "questions" in entry and "original_questions" not in entry:
        entry["original_questions"] = entry["questions"][:]

    # Check if 'imageURL' exists and starts with 'http'
    if "imageURL" in entry and entry["imageURL"].startswith("http://"):
        entry["imageURL"] = entry["imageURL"].replace("http://", "https://", 1)

# Write the updated data back to the JSON file
with open(data_file_path, "w", encoding="utf-8") as file:
    json.dump(data, file, indent=2, ensure_ascii=False)

print(
    "Updated JSON file: added original_questions where missing and changed all imageURLs to start with https."
)
