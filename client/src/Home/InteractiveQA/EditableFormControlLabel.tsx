import React, { useState } from "react";
import {
  TextField,
  IconButton,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import { EditableFormControlLabelProps } from "../../types";
import { putQuestion } from "./changeForm";

const EditableFormControlLabel: React.FC<EditableFormControlLabelProps> = ({
  id,
  editing,
  index,
  selectedQuestion,
  formHandler,
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
    putQuestion(id, index, inputValue);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

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
        <FormControlLabel
          control={<Checkbox />}
          label={labelValue}
          key={index}
          onChange={(e) => formHandler(e, index)}
        />
      )}
      <IconButton onClick={handleEditClick} size="small">
        {isEditing ? <CheckIcon /> : <EditIcon />}
      </IconButton>
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
