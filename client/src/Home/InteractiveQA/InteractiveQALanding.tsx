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
  fetchQuestions,
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

  useEffect(() => {
    console.log("Selected questions:", selectedQuestion);
    putSelectedQuestion(selectedQuestion, id).then(() => {
      fetchQuestions();
    });
    //eslint-disable-next-line
  }, [selectedQuestion, id]);

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

        {/* <div className="submitButtonContainer">{submitButton()}</div> */}
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
