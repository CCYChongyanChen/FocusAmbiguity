import React, { useEffect, useState } from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import "../Home.css"; // Importing the CSS
import "./InteractiveQA.css"; // Importing the CSS
import { InteractiveQALandingProps } from "../../types";
import Button from "@mui/material/Button";
import { putSelectedQuestion } from "./changeForm";

const InteractiveQALanding: React.FC<InteractiveQALandingProps> = ({
  id,
  questions,
}) => {
  const [selectedQuestion, setSelectedQuestion] = useState<number[]>([]);
  function formHandler(e: any, index: number) {
    const { checked } = e.target;
    if (checked) {
      setSelectedQuestion([...selectedQuestion, index]);
    } else {
      setSelectedQuestion(selectedQuestion.filter((i) => i !== index));
    }
  }

  const submitButton = () => {
    if (selectedQuestion.length === 0) {
      return (
        <Button
          variant="contained"
          disabled
          sx={{
            width: "10%",
            fontFamily: "Open Sans",
            fontWeight: 600,
          }}
        >
          Confirm
        </Button>
      );
    } else {
      return (
        <Button
          variant="contained"
          sx={{
            bgcolor: "#F9D68E",
            color: "black",
            width: "10%",
            fontFamily: "Open Sans",
            fontWeight: 600,
          }}
          onClick={() =>
            putSelectedQuestion(selectedQuestion, id).then(() => {
            })
          }
        >
          Confirm
        </Button>
      );
    }
  };

  useEffect(() => {
    console.log("Selected questions:", selectedQuestion);
  }, [selectedQuestion]);

  return (
    <div className="section section2">
      <div className="subsection subsection1">
        <div className="questionBox">
          <p className="question">
            Step 1: Please select the best question that is referring to
            multiple regions.{" "}
          </p>
        </div>

        <div className="answerBox">
          <FormGroup>
            {questions.map((question, index) => (
              <FormControlLabel
                key={index}
                control={<Checkbox />}
                label={`Q${index + 1}: ${question}`} // Assuming the API returns a field `text` for each question
                onChange={(e) => formHandler(e, index)}
              />
            ))}
          </FormGroup>
        </div>

        <div className="submitButtonContainer">{submitButton()}</div>
      </div>
      <div className="subsection subsection2 hide">
        <div className="questionBox">
          <p className="question hide">
            Step 2: Please refer to the interactive canvas on the left.{" "}
          </p>
        </div>
        <div className="questionBox questionBoxPart2">
          <p className="question hide bold">
            Step 1 have not finished, wait until finishing Step 1 to continue!
          </p>
        </div>
      </div>
    </div>
  );
};

export default InteractiveQALanding;
