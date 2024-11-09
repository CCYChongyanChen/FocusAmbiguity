import React, { useEffect, useState } from "react";
import "../Home.css"; // Importing the CSS
import "./InteractiveSVG.css"; // Importing the CSS
import { AmbData, InteractiveSVGProps } from "../../types";
import InteractiveSVGUpdated from "./InteractiveSVGUpdated";

const InteractiveSVG: React.FC<InteractiveSVGProps> = ({
  id,
  parentFetch,
  updated,
  isAmbiguous,
  selectedQuestion,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [hasUpdates, setHasUpdates] = useState<boolean>(false);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const fetchQuestions = () => {
    fetch(`${API_BASE_URL}/api/users/${id}?`)
      .then((response) => response.json())
      .then((data: AmbData) => {
        setLoading(false);
        parentFetch();
        // Check if questions have been updated
        if (data.selected_questions.length > 0) {
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

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, updated, isAmbiguous]);

  if (loading) {
    return <div>Loading...</div>; // Show loading spinner or placeholder
  }

  return (
    <InteractiveSVGUpdated
      id={id}
      parentFetch={fetchQuestions}
      updated={hasUpdates}
      isAmbiguous={isAmbiguous}
      selectedQuestion={selectedQuestion}
    />
  );
};

export default InteractiveSVG;
