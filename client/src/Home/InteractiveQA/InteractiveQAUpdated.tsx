import React, { useEffect } from "react";
import { useState } from "react";
import { InteractiveLabelingProps } from "../../types";
import FormGroup from "@mui/material/FormGroup";
import "../Home.css"; // Importing the CSS
import "./InteractiveQA.css"; // Importing the CSS
import Pagination from "@mui/material/Pagination";
import { putSelectedQuestion } from "./changeForm";
import EditableFormControlLabel from "./EditableFormControlLabel";

const InteractiveQAUpdated: React.FC<InteractiveLabelingProps> = ({
  id,
  questions,
  originalQuestions,
  selectedQuestion,
  setSelectedQuestion,
  fetchQuestions,
  isAmbiguous,
}) => {
  const [questionIndex, setQuestionIndex] = useState<number>(1);

  // when questions are updated, fetch the questions again
  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isAmbiguous]);

  function formHandler(e: any, index: number) {
    const { checked } = e.target;
    if (checked) {
      // empty the selectedQuestion array if the question is already selected
      if (selectedQuestion.length > 0) {
        putSelectedQuestion([index], id, isAmbiguous).then(() => {
          console.log("Selected questions:", index);
          fetchQuestions();
        });
      }
    } else {
      setSelectedQuestion(selectedQuestion.filter((i) => i !== index));
    }
  }

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setQuestionIndex(value);
  };

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

  return (
    <div className="section section2">
      <div className="subsection subsection1">
        <div className="questionBox">
          <div className="question">{text}</div>
        </div>

        <div className="answerBox">
          <FormGroup>
            {questions.map((question, index) => (
              <EditableFormControlLabel
                key={index}
                id={id}
                editing={false}
                index={index}
                originalQuestions={originalQuestions}
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
              originalQuestions={originalQuestions}
              selectedQuestion={""}
              isSelected={selectedQuestion.includes(questions.length)}
              formHandler={formHandler}
              fetchQuestions={fetchQuestions}
              isAmbiguous={isAmbiguous}
            />
          </FormGroup>
        </div>

        {/* <div className="submitButtonContainer">
          <Button
            variant="contained"
            sx={{
              bgcolor: "#F9D68E",
              color: "black",
              width: "25%",
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
            Restore Default Questoins
          </Button>
        </div> */}
      </div>
      {/* <div className="subsection subsection2">
        <div className="questionBox">
          <p className="question">
            Step 2: Please refer to the interactive canvas on the left.{" "}
          </p>
        </div>

        <div className="questionBox questionBoxPart2">
          <p className="question">
            Select on all the regions the question "
            <span
              key={questionIndex}
              className={`question ${
                isAmbiguous ? "question-red" : "question-blue"
              }`}
            >
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
        </div> */}
      {/* </div> */}
    </div>
  );
};

export default InteractiveQAUpdated;
