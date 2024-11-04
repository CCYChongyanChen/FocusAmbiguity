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
  isAmbiguous,
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
    if (inputValue.length !== 0) {
      putQuestion(id, index, inputValue, isAmbiguous).then(() => {
        fetchQuestions();
      });
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  // when ID changes, update the label value
  useEffect(() => {
    setLabelValue(selectedQuestion);
    setInputValue(selectedQuestion);
  }, [selectedQuestion, isEditing, isAmbiguous]);

  const FormControl = () => {
    // if question is selected then return disabled FormControlLabel
    if (isSelected)
      return (
        <div style={{ height: "5vh" }}>
          <FormControlLabel
            control={
              <Radio
                checked={true}
                sx={{ fontSize: "clamp(4px, 2vh, 18px)" }}
              />
            }
            label={labelValue}
            key={index}
            onChange={(e) => formHandler(e, index)}
            sx={{
              "& .MuiFormControlLabel-label": {
                fontSize: "clamp(10px, 1.8vh, 20px)", // Responsive font size for FormControlLabel
              },
            }}
            disabled
          />
        </div>
      );
    else
      return (
        <div style={{ height: "5vh" }}>
          <FormControlLabel
            control={<Radio sx={{ fontSize: "clamp(4px, 2vh, 18px)" }} />}
            label={labelValue}
            key={index}
            onChange={(e) => formHandler(e, index)}
            sx={{
              "& .MuiFormControlLabel-label": {
                fontSize: "clamp(10px, 1.8vh, 20px)", // Responsive font size for FormControlLabel
              },
            }}
          />
        </div>
      );
  };

  function undoButton() {
    if (originalQuestions[index] !== selectedQuestion) {
      return (
        <IconButton
          onClick={() => {
            console.log("Undoing question", index);
            deleteSelectedQuestion(id, index, isAmbiguous).then(() => {
              fetchQuestions();
            });
          }}
          size="small"
        >
          <UndoIcon sx={{ fontSize: "clamp(4px, 2vh, 18px)" }} />
        </IconButton>
      );
    } else {
      return null;
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "center", height: "5vh" }}>
      {isEditing ? (
        <TextField
          value={inputValue}
          onChange={handleInputChange}
          size="small"
          variant="outlined"
          sx={{
            "& .MuiInputBase-input": {
              fontSize: "clamp(10px, 1vw, 16px)", // Responsive font size for TextField input
            },
          }}
          fullWidth
        />
      ) : (
        <FormControl />
      )}
      <IconButton onClick={handleEditClick} size="small">
        {isEditing ? (
          <CheckIcon sx={{ fontSize: "clamp(4px, 2vh, 18px)" }} />
        ) : (
          <EditIcon sx={{ fontSize: "clamp(4px, 2vh, 18px)" }} />
        )}
      </IconButton>

      {undoButton()}
    </div>
  );
};

export default EditableFormControlLabel;
