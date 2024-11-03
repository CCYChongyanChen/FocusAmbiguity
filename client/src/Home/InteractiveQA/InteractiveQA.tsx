import React, { useState, useEffect } from "react";
import { AmbData, InteractiveQAProps } from "../../types";

// Import the components for different screens
import InteractiveQALanding from "./InteractiveQALanding"; // Assume this component exists
import InteractiveQAUpdated from "./InteractiveQAUpdated"; // Assume this component exists

const InteractiveQA: React.FC<InteractiveQAProps> = ({
  id,
  parentFetch,
  isAmbiguous,
}) => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasUpdates, setHasUpdates] = useState<boolean>(false);
  const [originalQuestions, setOriginalQuestions] = useState<string[]>([]);

  // Base URL from environment variable
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const fetchQuestions = () => {
    fetch(`${API_BASE_URL}/api/users/${id}?ambiguous=${isAmbiguous}`)
      .then((response) => response.json())
      .then((data: AmbData) => {
        setQuestions(data.questions);
        setOriginalQuestions(data.original_questions);
        setSelectedQuestion(data.selected_questions);
        setLoading(false);

        console.log("Questions:", data.questions);

        // Check if questions have been updated
        if (data.selected_questions.length > 0) {
          setHasUpdates(true); // Mark as updated
          parentFetch(); // Fetch the updated data
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
    console.log(questions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isAmbiguous]);

  // Conditional rendering based on loading and updates
  if (loading) {
    return <div>Loading...</div>; // Show loading spinner or placeholder
  }

  if (!hasUpdates) {
    // No selected questions yet, render the landing page
    return (
      <InteractiveQALanding
        id={id}
        questions={questions}
        fetchQuestions={fetchQuestions}
        isAmbiguous={isAmbiguous}
      />
    );
  } else {
    // Questions have been updated, render the updated questions screen
    return (
      <InteractiveQAUpdated
        id={id}
        questions={questions}
        originalQuestions={originalQuestions}
        selectedQuestion={selectedQuestion}
        setSelectedQuestion={setSelectedQuestion}
        fetchQuestions={fetchQuestions}
        isAmbiguous={isAmbiguous}
      />
    );
  }
};

export default InteractiveQA;
