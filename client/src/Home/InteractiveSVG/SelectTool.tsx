import "../Home.css"; // Importing the CSS
import "./InteractiveSVG.css"; // Importing the CSS
import { SelectToolsProps } from "../../types";
import Button from "@mui/material/Button";

const SelectTools: React.FC<SelectToolsProps> = ({
  hideAllLabel,
  setHideAllLabel,
  unSelectAll,
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

  const unSelectAllButton = () => {
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
          unSelectAll();
        }}
      >
        Unselect All
      </Button>
    );
  };

  return (
    <div className="submitButtonContainer submitButtonContainerSVG2 undoText">
      {unhideAllComponent()}
      {unSelectAllButton()}
    </div>
  );
};

export default SelectTools;
