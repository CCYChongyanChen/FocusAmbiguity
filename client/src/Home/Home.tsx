import React, { useState, useEffect, useRef } from "react";
import "./Home.css"; // Importing the CSS
import InteractiveSVG from "./InteractiveSVG/InteractiveSVG";
import InteractiveQA from "./InteractiveQA/InteractiveQA";
import { useSearchParams } from "react-router-dom";
import { Button } from "@mui/material";
import { AmbData } from "../types";
import { timeout } from "d3";

const Home: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [hasUpdates, setHasUpdates] = useState<boolean>(false);
  const [QAHasUpdate, setQAHasUpdate] = useState<boolean>(false);
  const [maximumLength, setMaximumLength] = useState<number>(0);
  const initialUserIndex = parseInt(searchParams.get("userIndex") || "0");
  const [dataId, setDataId] = useState<number>(initialUserIndex);
  const [isAmbiguous, setIsAmbiguous] = useState<boolean>(false); // New state for ambiguity
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [selectedObjectsPolygons, setSelectedObjectsPolygons] = useState<
    number[]
  >([]);
  const [selectedPartsPolygons, setSelectedPartsPolygons] = useState<number[]>(
    [],
  );
  const [selectedQuestionsAmbigous, setSelectedQuestionsAmbigous] = useState<
    number[]
  >([]);
  const [selectedObjectsPolygonsAmbigous, setSelectedObjectsPolygonsAmbigous] =
    useState<number[]>([]);

  const [selectedPartsPolygonsAmbigous, setSelectedPartsPolygonsAmbigous] =
    useState<number[]>([]);

  const [startTime, setStartTime] = useState<Date | null>(null); // Track start time

  const [questions, setQuestions] = useState<string[]>([]);
  const [ambigousQuestions, setAmbigousQuestions] = useState<string[]>([]);

  const [buttonLabel, setButtonLabel] = useState<string>("Next");
  const [buttonAction, setButtonAction] = useState<() => void>(() => () => {});
  // Base URL from environment variable
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  // Define refs for each hidden input
  const dataIdRef = useRef<HTMLInputElement>(null);
  const isAmbiguousRef = useRef<HTMLInputElement>(null);
  const selectedQuestionsRef = useRef<HTMLInputElement>(null);
  const selectedObjectsPolygonsRef = useRef<HTMLInputElement>(null);
  const selectedPartsPolygonsRef = useRef<HTMLInputElement>(null);
  const selectedQuestionsAmbigousRef = useRef<HTMLInputElement>(null);
  const selectedObjectsPolygonsAmbigousRef = useRef<HTMLInputElement>(null);
  const selectedPartsPolygonsAmbigousRef = useRef<HTMLInputElement>(null);
  const assignmentIdRef = useRef<HTMLInputElement>(null);
  const workerIdRef = useRef<HTMLInputElement>(null);
  const hitIdRef = useRef<HTMLInputElement>(null);
  const userTimeRef = useRef<HTMLInputElement>(null);

  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [labelsParts, setLabelsParts] = useState<string[]>([]);
  const [labelsObjects, setLabelsObjects] = useState<string[]>([]);

  const fetchQuestions = () => {
    fetch(`${API_BASE_URL}/api/users/${dataId}?ambiguous=${isAmbiguous}`)
      .then((response) => response.json())
      .then((data: AmbData) => {
        setLoading(false);
        if (data.selected_questions.length > 0 && !isAmbiguous) {
          setQAHasUpdate(true); // Mark as updated
          setSelectedObjectsPolygons(data.selected_objects_polygons);
          setSelectedPartsPolygons(data.selected_parts_polygons);
          setSelectedQuestions(data.selected_questions);
          setQuestions(data.questions);
          setLabelsParts(data.parts_labels);
          setLabelsObjects(data.objects_labels);
        } else if (data.selected_questions.length > 0 && isAmbiguous) {
          setQAHasUpdate(true);
          setSelectedObjectsPolygonsAmbigous(data.selected_objects_polygons);
          setSelectedPartsPolygonsAmbigous(data.selected_parts_polygons);
          setSelectedQuestionsAmbigous(data.selected_questions);
          setAmbigousQuestions(data.questions);
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

  const calculateTotalTime = () => {
    if (startTime) {
      const endTime = new Date();
      const timeDifference = Math.floor(
        (endTime.getTime() - startTime.getTime()) / 1000,
      ); // in seconds
      console.log(`Total time spent: ${timeDifference} seconds`);
      return timeDifference;
    }
    return 0;
  };

  const fetchLength = () => {
    fetch(`${API_BASE_URL}/api/users/?ambiguous=${isAmbiguous}`)
      .then((response) => response.json())
      .then((data: AmbData[]) => {
        setMaximumLength(data.length);
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
        setLoading(false);
      });
  };
  const AmTurkForm = () => {
    return (
      <form
        action="https://workersandbox.mturk.com/mturk/externalSubmit"
        method="post"
        id="mturk_form"
      >
        <input type="hidden" ref={assignmentIdRef} name="assignmentId" />
        <input type="hidden" ref={workerIdRef} name="workerId" />
        <input type="hidden" ref={hitIdRef} name="hitId" />
        <input
          type="hidden"
          name="turkSubmitTo"
          value="https://workersandbox.mturk.com"
        />
        <input type="hidden" ref={dataIdRef} name="dataId" value={dataId} />
        <input
          type="hidden"
          ref={selectedQuestionsRef}
          name="selected_questions"
          value="[]"
        />
        <input
          type="hidden"
          ref={selectedObjectsPolygonsRef}
          name="selected_objects_polygons"
          value="[]"
        />
        <input
          type="hidden"
          ref={selectedPartsPolygonsRef}
          name="selected_parts_polygons"
          value="[]"
        />
        <input
          type="hidden"
          ref={selectedQuestionsAmbigousRef}
          name="selected_questions_ambiguous"
          value="[]"
        />
        <input
          type="hidden"
          ref={selectedObjectsPolygonsAmbigousRef}
          name="selected_objects_polygons_ambiguous"
          value="[]"
        />
        <input
          type="hidden"
          ref={selectedPartsPolygonsAmbigousRef}
          name="selected_parts_polygons_ambiguous"
          value="[]"
        />
        <input
          type="hidden"
          ref={userTimeRef}
          name="user_answer_time"
          value="0"
        />
      </form>
    );
  };

  useEffect(() => {
    fetchQuestions();
    fetchLength();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataId, isAmbiguous]);

  useEffect(() => {
    setStartTime(new Date()); // Record start time when component mounts
  }, []);

  useEffect(() => {
    if (
      !isAmbiguous &&
      (selectedObjectsPolygons.length > 0 ||
        selectedPartsPolygons.length > 0) &&
      selectedQuestions.length > 0
    ) {
      setButtonLabel("Next");
      setButtonDisabled(false);
      setButtonAction(() => () => setIsAmbiguous(true));
    } else if (
      isAmbiguous &&
      (selectedObjectsPolygonsAmbigous.length > 0 ||
        selectedPartsPolygonsAmbigous.length > 0) &&
      selectedQuestionsAmbigous.length > 0
    ) {
      setButtonLabel("Submit Form");
      setButtonDisabled(false);
      setButtonAction(() => handleSubmit);
    } else {
      setButtonDisabled(true);
      setButtonLabel("Next");
      setButtonAction(
        () => () => alert("Please complete the selections in both sections."),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isAmbiguous,
    selectedQuestions,
    selectedObjectsPolygons,
    selectedPartsPolygons,
    selectedQuestionsAmbigous,
    selectedObjectsPolygonsAmbigous,
    selectedPartsPolygonsAmbigous,
  ]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleSubmit = () => {
    const totalTimeSpent = calculateTotalTime();
    userTimeRef.current!.value = totalTimeSpent.toString();
    console.log("Submitting form...");
    console.log("Total time spent:", totalTimeSpent);
    // Set ref values for selected data
    selectedQuestionsRef.current!.value = JSON.stringify({
      index: selectedQuestions,
      questions: questions[selectedQuestions[0]],
    });
    selectedObjectsPolygonsRef.current!.value = JSON.stringify(
      selectedObjectsPolygons,
    );
    selectedPartsPolygonsRef.current!.value = JSON.stringify(
      selectedPartsPolygons,
    );
    dataIdRef.current!.value = dataId.toString();

    selectedQuestionsAmbigousRef.current!.value = JSON.stringify({
      index: selectedQuestionsAmbigous,
      questions: ambigousQuestions[selectedQuestionsAmbigous[0]],
    });

    selectedObjectsPolygonsAmbigousRef.current!.value = JSON.stringify(
      selectedObjectsPolygonsAmbigous,
    );

    selectedPartsPolygonsAmbigousRef.current!.value = JSON.stringify(
      selectedPartsPolygonsAmbigous,
    );

    // Set ref values for URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    if (assignmentIdRef.current) {
      console.log(urlParams.get("assignmentId"));
      assignmentIdRef.current.value =
        urlParams.get("assignmentId") || "ASSIGNMENT_ID_NOT_AVAILABLE";
    }
    if (workerIdRef.current) {
      console.log(urlParams.get("workerId"));
      workerIdRef.current.value =
        urlParams.get("workerId") || "WORKER_ID_NOT_AVAILABLE";
    }
    if (hitIdRef.current) {
      console.log(urlParams.get("hitId"));
      hitIdRef.current.value = urlParams.get("hitId") || "HIT_ID_NOT_AVAILABLE";
    }
    timeout(() => {
      console.log("Submitting form...");
      (document.getElementById("mturk_form") as HTMLFormElement).submit();
    }, 1000);
    // (document.getElementById("mturk_form") as HTMLFormElement).submit();
  };

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
          isAmbiguous={isAmbiguous}
        />
        <InteractiveQA
          id={dataId}
          parentFetch={fetchQuestions}
          isAmbiguous={isAmbiguous}
        />
      </div>

      {AmTurkForm()}

      <div className="lowerContainer">
        <div className="lowerContainerLeft">
          <div className="lowerContainerLeftUp">
            <div className="leftUpItem">
              <p>Objects: {labelsObjects.join(", ")}</p>
            </div>
            <div className="leftUpItem">
              <p>Parts: {labelsParts.join(", ")}</p>
            </div>
          </div>{" "}
        </div>
        <div className="lowerContainerRight">
          <div className="lowerContainerLeftDown">
            {isAmbiguous && (
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#F9D68E",
                  color: "black",
                  width: "100%",
                  height: "100%",
                  fontFamily: "Open Sans",
                  fontWeight: 600,
                }}
                onClick={() => {
                  setIsAmbiguous(false);
                  fetchQuestions();
                }}
              >
                Previous
              </Button>
            )}
          </div>
          <div className="lowerContainerLeftDown">
            <Button
              variant="contained"
              sx={{
                bgcolor: "#F9D68E",
                color: "black",
                fontFamily: "Open Sans",
                fontWeight: 600,
                fontSize: "0.8rem",
              }}
              disabled={buttonDisabled}
              onClick={buttonAction}
            >
              {buttonLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
