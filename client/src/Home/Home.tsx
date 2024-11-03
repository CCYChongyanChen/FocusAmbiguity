import React, { useState, useEffect, useRef } from "react";
import "./Home.css"; // Importing the CSS
import InteractiveSVG from "./InteractiveSVG/InteractiveSVG";
import InteractiveQA from "./InteractiveQA/InteractiveQA";
import { useSearchParams } from "react-router-dom";
import { Button } from "@mui/material";
import { AmbData } from "../types";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";

const Home: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [hasUpdates, setHasUpdates] = useState<boolean>(false);
  const [QAHasUpdate, setQAHasUpdate] = useState<boolean>(false);
  const [maximumLength, setMaximumLength] = useState<number>(0);
  const initialUserIndex = parseInt(searchParams.get("userIndex") || "0");
  const [dataId, setDataId] = useState<number>(initialUserIndex);
  const [isAmbiguous, setIsAmbiguous] = useState<boolean>(true); // New state for ambiguity
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [selectedObjectsPolygons, setSelectedObjectsPolygons] = useState<
    number[]
  >([]);
  const [selectedPartsPolygons, setSelectedPartsPolygons] = useState<number[]>(
    [],
  );
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  // Define refs for each hidden input
  const dataIdRef = useRef<HTMLInputElement>(null);
  const isAmbiguousRef = useRef<HTMLInputElement>(null);
  const selectedQuestionsRef = useRef<HTMLInputElement>(null);
  const selectedObjectsPolygonsRef = useRef<HTMLInputElement>(null);
  const selectedPartsPolygonsRef = useRef<HTMLInputElement>(null);
  const assignmentIdRef = useRef<HTMLInputElement>(null);
  const workerIdRef = useRef<HTMLInputElement>(null);
  const hitIdRef = useRef<HTMLInputElement>(null);

  const AntSwitch = styled(Switch)(({ theme }) => ({
    // Styled switch code here
  }));

  const fetchQuestions = () => {
    fetch(`${API_BASE_URL}/api/users/${dataId}?ambiguous=${isAmbiguous}`)
      .then((response) => response.json())
      .then((data: AmbData) => {
        setLoading(false);
        if (
          data.selected_questions.length > 0 &&
          data.selected_parts_polygons.length > 0
        ) {
          setHasUpdates(true); // Mark as updated
          setSelectedObjectsPolygons(data.selected_objects_polygons);
          setSelectedPartsPolygons(data.selected_parts_polygons);
          setSelectedQuestions(data.selected_questions);
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
          ref={isAmbiguousRef}
          name="isAmbiguous"
          value={isAmbiguous ? "true" : "false"}
        />
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
      </form>
    );
  };

  const handleSubmit = () => {
    console.log("Submitting form");
    console.log(selectedQuestions);
    console.log(selectedObjectsPolygons);
    console.log(selectedPartsPolygons);
    // Set ref values for selected data
    if (selectedQuestionsRef.current) {
      selectedQuestionsRef.current.value = JSON.stringify(selectedQuestions);
    }
    if (selectedObjectsPolygonsRef.current) {
      selectedObjectsPolygonsRef.current.value = JSON.stringify(
        selectedObjectsPolygons,
      );
    }
    if (selectedPartsPolygonsRef.current) {
      selectedPartsPolygonsRef.current.value = JSON.stringify(
        selectedPartsPolygons,
      );
    }
    if (dataIdRef.current) {
      dataIdRef.current.value = String(dataId);
    }
    if (isAmbiguousRef.current) {
      isAmbiguousRef.current.value = isAmbiguous ? "true" : "false";
    }

    // Set ref values for URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    if (assignmentIdRef.current) {
      console.log(urlParams.get("assignmentId"));
      assignmentIdRef.current.value =
        urlParams.get("assignmentId") || "ASSIGNMENT_ID_NOT_AVAILABLE";
    }
    if (workerIdRef.current) {
      workerIdRef.current.value =
        urlParams.get("workerId") || "WORKER_ID_NOT_AVAILABLE";
    }
    if (hitIdRef.current) {
      hitIdRef.current.value = urlParams.get("hitId") || "HIT_ID_NOT_AVAILABLE";
    }

    setTimeout(() => {
      (document.getElementById("mturk_form") as HTMLFormElement).submit();
    }, 1000);
  };

  useEffect(() => {
    fetchQuestions();
    fetchLength();
  }, [dataId, isAmbiguous]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <div className="lowerContainer lowerContainer2">
        <h1>IMG ID: ivc-{String(dataId).padStart(3, "0")}</h1>
      </div>
      <div className="lowerContainer">
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Typography>unambiguous</Typography>
          <AntSwitch
            checked={isAmbiguous}
            onChange={(e) => setIsAmbiguous(e.target.checked)}
            inputProps={{ "aria-label": "ant design" }}
          />
          <Typography>ambiguous</Typography>
        </Stack>
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
            fetchQuestions();
            handleSubmit();
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default Home;
