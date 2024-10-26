import React from "react";
import { useState } from "react";
import { InteractiveLabelingProps } from "../../types";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import "../Home.css"; // Importing the CSS
import "./InteractiveQA.css"; // Importing the CSS
import Button from "@mui/material/Button";
import Pagination from "@mui/material/Pagination";
import { putSelectedQuestion, deleteSelectedQuestion } from "./changeForm";

const InteractiveQAUpdated: React.FC<InteractiveLabelingProps> = ({
  id,
  questions,
  selectedQuestion,
  fetchQuestions,
}) => {
  const [questionIndex, setQuestionIndex] = useState<number>(1);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setQuestionIndex(value);
  };
  return (
    <div className="section section2">
      <div className="subsection subsection1">
        <div className="questionBox">
          <p className="question">
            Step 1: Please select, edit, or create an ambiguous question. There
            should be an ambiguity regarding what visual contents the question
            asks about.{" "}
          </p>
        </div>

        <div className="answerBox">
          <FormGroup>
            {questions.map((question, index) => (
              <FormControlLabel
                key={index}
                control={<Checkbox />}
                checked={selectedQuestion.includes(index)}
                disabled
                label={`Q${index + 1}: ${question}`} // Assuming the API returns a field `text` for each question
              />
            ))}
          </FormGroup>
        </div>

        <div className="submitButtonContainer">
          <Button
            variant="contained"
            sx={{
              bgcolor: "#F9D68E",
              color: "black",
              width: "10%",
              fontFamily: "Open Sans",
              fontWeight: 600,
            }}
            onClick={() => {
              console.log(
                "Delete question:",
                selectedQuestion[questionIndex - 1],
              );
              deleteSelectedQuestion(id).then(() => {
                fetchQuestions();
              });
            }}
          >
            Modify
          </Button>
        </div>
      </div>
      <div className="subsection subsection2">
        <div className="questionBox">
          <p className="question">
            Step 2: Please refer to the interactive canvas on the left.{" "}
          </p>
        </div>

        <div className="questionBox questionBoxPart2">
          <p className="question">
            Select on all the regions the question "
            <span key={questionIndex} className="question question-blue">
              {questions[selectedQuestion[questionIndex - 1]]}
            </span>
            " is referring to.
          </p>
        </div>

        <div className="questionBox questionBoxPart3">
          <Pagination
            count={selectedQuestion.length}
            page={questionIndex}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default InteractiveQAUpdated;
