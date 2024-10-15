import React, { useEffect, useRef, useState } from "react";
import "../Home.css"; // Importing the CSS
import "./InteractiveSVG.css"; // Importing the CSS
import * as d3 from "d3";
import { AmbData, InteractiveSVGProps } from "../../types";
import InteractiveSVGLanding from "./InteractiveSVGLanding";
import InteractiveSVGUpdated from "./InteractiveSVGUpdated";

const InteractiveSVG: React.FC<InteractiveSVGProps> = ({ id }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [hasUpdates, setHasUpdates] = useState<boolean>(false);

  useEffect(() => {
    // Function to fetch questions from the backend
    const fetchQuestions = () => {
      fetch(`http://localhost:4000/api/users/${id}`)
        .then((response) => response.json())
        .then((data: AmbData) => {
          setLoading(false);

          // Check if questions have been updated
          if (
            data.selectedQuestions.length > 0 ||
            data.selectedMasks.length > 0
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

    fetchQuestions();

    // Polling the backend every 30 seconds to check for updates
    const intervalId = setInterval(fetchQuestions, 500); // Poll every 30 seconds

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, [id]);

  if (loading) {
    return <div>Loading...</div>; // Show loading spinner or placeholder
  }

  if (!hasUpdates) {
    return <InteractiveSVGLanding id={id} />;
  } else {
    return <InteractiveSVGUpdated id={id} />;
  }
};

export default InteractiveSVG;
