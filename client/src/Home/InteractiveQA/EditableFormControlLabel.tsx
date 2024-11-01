import React, { useEffect, useState } from "react";
import { TextField, IconButton, FormControlLabel, Radio } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import UndoIcon from "@mui/icons-material/Undo";
import { EditableFormControlLabelProps } from "../../types";
import { deleteSelectedQuestion, putQuestion } from "./changeForm";

const EditableFormControlLabel: React.FC<EditableFormControlLabelProps> = ({
  id,
  editing,
  index,
  originalQuestions,
  selectedQuestion,
  isSelected,
  formHandler,
  fetchQuestions,
}) => {
  const [isEditing, setIsEditing] = useState(editing);
  const [labelValue, setLabelValue] = useState(selectedQuestion);
  const [inputValue, setInputValue] = useState(labelValue);

  const handleEditClick = () => {
    if (isEditing) {
      // Save the edited value
      setLabelValue(inputValue);
    }
    setIsEditing(!isEditing);
    putQuestion(id, index, inputValue).then(() => {
      fetchQuestions();
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  // when ID changes, update the label value
  useEffect(() => {
    setLabelValue(selectedQuestion);
    setInputValue(selectedQuestion);
  }, [selectedQuestion, isEditing]);

  const FormControl = () => {
    // if question is selected then return disabled FormControlLabel
    if (isSelected)
      return (
        <FormControlLabel
          control={<Radio checked={true} />}
          label={labelValue}
          key={index}
          onChange={(e) => formHandler(e, index)}
          disabled
        />
      );
    else
      return (
        <FormControlLabel
          control={<Radio />}
          label={labelValue}
          key={index}
          onChange={(e) => formHandler(e, index)}
        />
      );
  };

  function undoButton() {
    if (originalQuestions[index] !== selectedQuestion) {
      return (
        <IconButton
          onClick={() => {
            deleteSelectedQuestion(id).then(() => {
              fetchQuestions();
            });
          }}
          size="small"
        >
          <UndoIcon />
        </IconButton>
      );
    } else {
      return null;
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {isEditing ? (
        <TextField
          value={inputValue}
          onChange={handleInputChange}
          size="small"
          variant="outlined"
          fullWidth
        />
      ) : (
        <FormControl />
      )}
      <IconButton onClick={handleEditClick} size="small">
        {isEditing ? <CheckIcon /> : <EditIcon />}
      </IconButton>

      {undoButton()}
    </div>
  );
};

export default EditableFormControlLabel;

// <FormControlLabel
//   key={index}
//   control={<Checkbox />}
//   label={`Q${index + 1}: ${question}`} // Assuming the API returns a field `text` for each question
//   onChange={(e) => formHandler(e, index)}
// />;