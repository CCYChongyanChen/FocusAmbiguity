import React, { useEffect, useState } from "react";
import FormGroup from "@mui/material/FormGroup";
import "../Home.css"; // Importing the CSS
import "./InteractiveQA.css"; // Importing the CSS
import { InteractiveQALandingProps } from "../../types";
import { putSelectedQuestion } from "./changeForm";
import EditableFormControlLabel from "./EditableFormControlLabel";

const InteractiveQALanding: React.FC<InteractiveQALandingProps> = ({
  id,
  questions,
  fetchQuestions,
  isAmbiguous,
}) => {
  const [selectedQuestion, setSelectedQuestion] = useState<number[]>([]);

  function formHandler(e: any, index: number) {
    const { checked } = e.target;
    if (checked) {
      // empty the selectedQuestion array if the question is already selected
      if (selectedQuestion.length > 0) {
        setSelectedQuestion([]);
      }
      setSelectedQuestion([...selectedQuestion, index]);
    } else {
      setSelectedQuestion(selectedQuestion.filter((i) => i !== index));
    }
  }

  // if isAmbiguous say Step 1: Please select, edit, or create an ambiguous question. There
  // should be an ambiguity regarding what visual contents the question asks about.

  const text = isAmbiguous ? (
    <p>
      Step 1: Please select, edit, or create a focus{" "}
      <span className="question-red">ambiguous</span> question.
    </p>
  ) : (
    <p>
      Step 1: Please select, edit, or create a focus{" "}
      <span className="question-blue">unambiguous</span> question.
    </p>
  );

  useEffect(() => {
    if (selectedQuestion.length > 0) {
      putSelectedQuestion(selectedQuestion, id, isAmbiguous).then(() => {
        fetchQuestions();
      });
    }
    //eslint-disable-next-line
  }, [selectedQuestion, id, isAmbiguous]);
  return (
    <div className="section section2">
      <div className="subsection subsection1">
        <div className="questionBox">
          <p className="question">{text}</p>
        </div>

        <div className="answerBox">
          <FormGroup>
            {questions.map((question, index) => (
              <EditableFormControlLabel
                key={index}
                id={id}
                editing={false}
                index={index}
                originalQuestions={[""]}
                selectedQuestion={question}
                isSelected={selectedQuestion.includes(index)}
                formHandler={formHandler}
                fetchQuestions={fetchQuestions}
                isAmbiguous={isAmbiguous}
              />
            ))}

            <EditableFormControlLabel
              key={questions.length}
              id={id}
              editing={false}
              index={questions.length}
              originalQuestions={[""]}
              selectedQuestion={""}
              isSelected={selectedQuestion.includes(questions.length)}
              formHandler={formHandler}
              fetchQuestions={fetchQuestions}
              isAmbiguous={isAmbiguous}
            />
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
