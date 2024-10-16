import React, { useState, useEffect } from "react";
import "./Home.css"; // Importing the CSS
import InteractiveSVG from "./InteractiveSVG/InteractiveSVG";
import InteractiveQA from "./InteractiveQA/InteractiveQA";
import { Button } from "@mui/material";
import { AmbData } from "../types";

const Home: React.FC = () => {
  const [dataId, setDataId] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(true);
  const [hasUpdates, setHasUpdates] = useState<boolean>(false);

  const [maximumLength, setMaximumLength] = useState<number>(0);

  useEffect(() => {
    // Function to fetch questions from the backend
    const fetchQuestions = () => {
      fetch(`http://localhost:4000/api/users/${dataId}`)
        .then((response) => response.json())
        .then((data: AmbData) => {
          setLoading(false);
          // Check if questions have been updated
          if (
            data.selected_questions.length > 0 &&
            data.selected_parts_polygons.length > 0
          ) {
            setHasUpdates(true); // Mark as updated
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
      fetch(`http://localhost:4000/api/users/`)
        .then((response) => response.json())
        .then((data: AmbData[]) => {
          setMaximumLength(data.length);
        })
        .catch((error) => {
          console.error("Error fetching questions:", error);
          setLoading(false);
        });
    };

    fetchQuestions();
    fetchLength();

    // Polling the backend every 30 seconds to check for updates
    const intervalId = setInterval(fetchQuestions, 1000); // Poll every 30 seconds

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, [dataId]);

  if (loading) {
    return <div>Loading...</div>; // Show loading spinner or placeholder
  }

  if (!hasUpdates) {
    return (
      <div className="container">
        <div className="lowerContainer lowerContainer2">
          <p>IMG ID: ivc-{String(dataId).padStart(3, "0")}</p>
        </div>
        <div className="upperContainer">
          <InteractiveSVG id={dataId} />
          <InteractiveQA id={dataId} />
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
          <InteractiveSVG id={dataId} />
          <InteractiveQA id={dataId} />
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
              if (dataId + 1 === maximumLength) {
                console.log(dataId);
                console.log(maximumLength);
                setDataId(0);
              } else {
                console.log(dataId);
                setDataId(dataId + 1);
              }
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
