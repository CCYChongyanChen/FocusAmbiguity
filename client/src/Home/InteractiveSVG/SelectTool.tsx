import "../Home.css"; // Importing the CSS
import "./InteractiveSVG.css"; // Importing the CSS
import { SelectToolsProps } from "../../types";
import Button from "@mui/material/Button";

const SelectTools: React.FC<SelectToolsProps> = ({
  hideAllLabel,
  setHideAllLabel,
}) => {
  const unhideAllComponent = () => {
    return (
      <Button
        variant="contained"
        sx={{
          bgcolor: "#F9D68E",
          color: "black",
          width: "20%",
          fontFamily: "Open Sans",
          fontSize: "clamp(5px, 1vw, 10px)",
          fontWeight: 600,
        }}
        onClick={() => {
          setHideAllLabel(!hideAllLabel);
        }}
      >
        hide/show image labels
      </Button>
    );
  };

  return (
    <div className="submitButtonContainer submitButtonContainerSVG2 undoText">
      {unhideAllComponent()}
    </div>
  );
};

export default SelectTools;
