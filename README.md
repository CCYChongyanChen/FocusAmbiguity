# Ambiguity in VQA 
This is the crowdsourcing code for manuscript title that we yet not decided, but let's hope that we can be able to submit it to CVPR 2025.

## Installation
1. Install Docker

### Usage
```bash
docker compose up # to start the server

docker compose down # to stop the server
```
Now React app will be running on `localhost:3000` and node.js(express.js) server will be running on `localhost:5000`.

Sorry that we choose :4000 as Mac seems have some issue with :5000 port.

### Data Collection
- All collected data will be stored in `server/data` folder.
##### Data Format
- id: image id
- imageURL: image path that stored in `server/public/images` folder
- questions: list of questions that will be asked to the user
- selectedQuestions: list of indexes of questions that selected by the user and that another user will be using them to select matching objects in the image. 
- TODO: add masks, and user selected objects contours to the data format.
```json
[
  {
    "id": 0,
    "imageURL": "images/ivc-ambigous-000.jpg",
    "questions": [
      "What parts of the image might be involved in ensuring visibility 000?",
      "What parts of the image might be involved in animals 000?",
      "What parts of the image might be involved in animal sitting in the trees 000?",
      "What parts of the image might be involved in ensuring security 000?",
      "What parts of the image could we do without 000?"
    ],
    "selectedQuestions": [
      2,
      3
    ], 
  }, ...
]
```