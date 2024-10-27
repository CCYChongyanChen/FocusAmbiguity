import React, { useEffect, useState } from "react";
import "../Home.css"; // Importing the CSS
import "./InteractiveSVG.css"; // Importing the CSS
import { AmbData, InteractiveSVGProps } from "../../types";
import InteractiveSVGLanding from "./InteractiveSVGLanding";
import InteractiveSVGUpdated from "./InteractiveSVGUpdated";

const InteractiveSVG: React.FC<InteractiveSVGProps> = ({
  id,
  parentFetch,
  updated,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [hasUpdates, setHasUpdates] = useState<boolean>(false);

  const fetchQuestions = () => {
    fetch(`https://focusambiguity-f3d2d4c819b3.herokuapp.com/api/users/${id}`)
      .then((response) => response.json())
      .then((data: AmbData) => {
        setLoading(false);
        parentFetch();
        // Check if questions have been updated
        if (
          data.selected_questions.length > 0 ||
          data.selected_parts_polygons.length > 0 ||
          data.selected_objects_polygons.length > 0
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

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, updated]);

  if (loading) {
    return <div>Loading...</div>; // Show loading spinner or placeholder
  }

  if (!hasUpdates) {
    return (
      <InteractiveSVGLanding
        id={id}
        parentFetch={fetchQuestions}
        updated={false}
      />
    );
  } else {
    return (
      <InteractiveSVGUpdated
        id={id}
        parentFetch={fetchQuestions}
        updated={false}
      />
    );
  }
};

export default InteractiveSVG;
