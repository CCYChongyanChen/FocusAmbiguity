import json
import os

# Path to your JSON file
data_file_paths = ["ivc-unambigous.json", "ivc-ambigous.json"]

for data_file_path in data_file_paths:
    # Read the JSON data
    with open(data_file_path, "r", encoding="utf-8") as file:
        data = json.load(file)
        print(len(data))

    # Iterate over each entry in the data
    for entry in data:
        # Check if 'questions' exists and 'original_questions' is missing, and add if needed
        if "questions" in entry and "original_questions" not in entry:
            entry["original_questions"] = entry["questions"][:]

        entry["selected_questions"] = []

        # Check if 'imageURL' exists and starts with 'http'
        if "imageURL" in entry and entry["imageURL"].startswith("http://"):
            entry["imageURL"] = entry["imageURL"].replace("http://", "https://", 1)

        # check all entry start with selected_ and make them empty
        for key in entry.keys():
            if key.startswith("selected_"):
                entry[key] = []

    # split into files with 50 entries each
    data_split = [data[i : i + 50] for i in range(0, len(data), 50)]
    for i, data in enumerate(data_split):
        with open(
            f"{data_file_path.split('.')[0]}-{i}.json", "w", encoding="utf-8"
        ) as file:
            json.dump(data, file, indent=2, ensure_ascii=False)

    print(
        "Updated JSON file: added original_questions where missing and changed all imageURLs to start with https."
    )
