import "../Home.css"; // Importing the CSS
import "./InteractiveSVG.css"; // Importing the CSS
import * as d3 from "d3";
import { SelectToolsProps } from "../../types";
import Button from "@mui/material/Button";

const SelectTools: React.FC<SelectToolsProps> = ({
  hidedPolygon,
  setHidedPolygon,
  setAllPolygonVisible,
}) => {
  const undoLasthideComponent = () => {
    if (hidedPolygon.length === 0) {
      return (
        <Button
          variant="contained"
          disabled
          sx={{
            width: "20%",
            fontFamily: "Open Sans",
            fontSize: "9px",
            fontWeight: 600,
          }}
        >
          {" "}
          Undo Last Hide
        </Button>
      );
    } else {
      return (
        <Button
          variant="contained"
          sx={{
            bgcolor: "#F9D68E",
            color: "black",
            width: "20%",
            fontFamily: "Open Sans",
            fontSize: "9px",
            fontWeight: 600,
          }}
          onClick={() => {
            if (hidedPolygon.length > 0) {
              const lastHidden = hidedPolygon.pop();
              if (lastHidden) {
                lastHidden.style("display", "block");
              }
              setHidedPolygon([...hidedPolygon]);
            }
          }}
        >
          {" "}
          Undo Last Hide
        </Button>
      );
    }
  };

  const unhideAllComponent = () => {
    if (hidedPolygon.length === 0) {
      return (
        <Button
          variant="contained"
          disabled
          sx={{
            width: "20%",
            fontFamily: "Open Sans",
            fontSize: "11px",
            fontWeight: 600,
          }}
        >
          Unhide All
        </Button>
      );
    } else {
      return (
        <Button
          variant="contained"
          sx={{
            bgcolor: "#F9D68E",
            color: "black",
            width: "20%",
            fontFamily: "Open Sans",
            fontSize: "11px",
            fontWeight: 600,
          }}
          onClick={() => {
            setAllPolygonVisible();
            setHidedPolygon([]);
          }}
        >
          Unhide All
        </Button>
      );
    }
  };

  return (
    <div className="submitButtonContainer submitButtonContainerSVG2 undoText">
      {undoLasthideComponent()}
      {unhideAllComponent()}
    </div>
  );
};

export default SelectTools;
