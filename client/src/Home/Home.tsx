import React, { useState, useEffect } from "react";
import "./Home.css"; // Importing the CSS
import InteractiveSVG from "./InteractiveSVG/InteractiveSVG";
import InteractiveQA from "./InteractiveQA/InteractiveQA";
import { useSearchParams } from "react-router-dom";
import { Button } from "@mui/material";
import { AmbData } from "../types";

const Home: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [loading, setLoading] = useState<boolean>(true);
  const [hasUpdates, setHasUpdates] = useState<boolean>(false);
  const [QAHasUpdate, setQAHasUpdate] = useState<boolean>(false);

  const [maximumLength, setMaximumLength] = useState<number>(0);
  const initialUserIndex = parseInt(searchParams.get("userIndex") || "0");
  const [dataId, setDataId] = useState<number>(initialUserIndex);

  // Function to fetch questions from the backend
  const fetchQuestions = () => {
    fetch(
      `https://focusambiguity-f3d2d4c819b3.herokuapp.com/api/users/${dataId}`,
    )
      .then((response) => response.json())
      .then((data: AmbData) => {
        setLoading(false);

        if (
          data.selected_questions.length > 0 &&
          data.selected_parts_polygons.length > 0
        ) {
          setHasUpdates(true); // Mark as updated
        } else if (data.selected_questions.length > 0) {
          setQAHasUpdate(true);
        } else {
          setHasUpdates(false); // Mark as not updated
        }
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
        setLoading(false);
      });
  };

  const fetchLength = () => {
    fetch(`https://focusambiguity-f3d2d4c819b3.herokuapp.com/api/users/`)
      .then((response) => response.json())
      .then((data: AmbData[]) => {
        setMaximumLength(data.length);
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchQuestions();
    fetchLength();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataId]);

   useEffect(() => {
     // Set the user index from query params when the component mounts or query changes
     if (!isNaN(initialUserIndex)) {
       setDataId(initialUserIndex);
     }
     fetchQuestions();
     fetchLength();
     // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [initialUserIndex]);


  if (loading) {
    return <div>Loading...</div>; // Show loading spinner or placeholder
  }

  if (!hasUpdates) {
    return (
      <div className="container">
        <div className="lowerContainer lowerContainer2">
          <h1>IMG ID: ivc-{String(dataId).padStart(3, "0")}</h1>
        </div>
        <div className="upperContainer">
          <InteractiveSVG
            id={dataId}
            parentFetch={fetchQuestions}
            updated={QAHasUpdate}
          />
          <InteractiveQA id={dataId} parentFetch={fetchQuestions} />
        </div>
        <div className="lowerContainer">
          <Button
            disabled
            variant="contained"
            sx={{
              fontFamily: "Open Sans",
            }}
          >
            Next Image
          </Button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="container">
        <div className="lowerContainer lowerContainer2">
          <h1>IMG ID: ivc-{String(dataId).padStart(3, "0")}</h1>
        </div>
        <div className="upperContainer">
          <InteractiveSVG
            id={dataId}
            parentFetch={fetchQuestions}
            updated={QAHasUpdate}
          />
          <InteractiveQA id={dataId} parentFetch={fetchQuestions} />
        </div>
        <div className="lowerContainer">
          <Button
            variant="contained"
            sx={{
              bgcolor: "#F9D68E",
              color: "black",
              width: "10%",
              fontFamily: "Open Sans",
              fontWeight: 600,
            }}
            onClick={() => {
              const newId = dataId + 1 === maximumLength ? 0 : dataId + 1;
              setDataId(newId);
              setSearchParams({ userIndex: newId.toString() }); // Update URL with new user index
            }}
          >
            Next Image
          </Button>
        </div>
      </div>
    );
  }
};

export default Home;
