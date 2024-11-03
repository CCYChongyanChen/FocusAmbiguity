import React, { useState, useEffect } from "react";
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
  const [searchParams, setSearchParams] = useSearchParams();

  const [loading, setLoading] = useState<boolean>(true);
  const [hasUpdates, setHasUpdates] = useState<boolean>(false);
  const [QAHasUpdate, setQAHasUpdate] = useState<boolean>(false);

  const [maximumLength, setMaximumLength] = useState<number>(0);
  const initialUserIndex = parseInt(searchParams.get("userIndex") || "0");
  const [dataId, setDataId] = useState<number>(initialUserIndex);

  const [isAmbiguous, setIsAmbiguous] = useState<boolean>(true); // New state for ambiguity

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 28,
    height: 16,
    padding: 0,
    display: "flex",
    "&:active": {
      "& .MuiSwitch-thumb": {
        width: 15,
      },
      "& .MuiSwitch-switchBase.Mui-checked": {
        transform: "translateX(9px)",
      },
    },
    "& .MuiSwitch-switchBase": {
      padding: 2,
      "&.Mui-checked": {
        transform: "translateX(12px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          opacity: 1,
          backgroundColor: "#1890ff",
          ...theme.applyStyles("dark", {
            backgroundColor: "#177ddc",
          }),
        },
      },
    },
    "& .MuiSwitch-thumb": {
      boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
      width: 12,
      height: 12,
      borderRadius: 6,
      transition: theme.transitions.create(["width"], {
        duration: 200,
      }),
    },
    "& .MuiSwitch-track": {
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor: "rgba(0,0,0,.25)",
      boxSizing: "border-box",
      ...theme.applyStyles("dark", {
        backgroundColor: "rgba(255,255,255,.35)",
      }),
    },
  }));

  // Function to fetch questions from the backend
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

  useEffect(() => {
    fetchQuestions();
    fetchLength();
    console.log(isAmbiguous);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataId, isAmbiguous]);

  useEffect(() => {
    // Set the user index from query params when the component mounts or query changes
    if (!isNaN(initialUserIndex)) {
      setDataId(initialUserIndex);
    }
    fetchQuestions();
    fetchLength();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialUserIndex, isAmbiguous]);

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
            isAmbiguous={isAmbiguous}
          />
          <InteractiveQA
            id={dataId}
            parentFetch={fetchQuestions}
            isAmbiguous={isAmbiguous}
          />
        </div>
        <div className="lowerContainer">
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Typography>unambiguous</Typography>
            <AntSwitch
              checked={isAmbiguous}
              onChange={(e) => setIsAmbiguous(e.target.checked)} // Toggle state based on switch
              inputProps={{ "aria-label": "ant design" }}
            />
            <Typography>ambiguous</Typography>
          </Stack>
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
            isAmbiguous={isAmbiguous}
          />
          <InteractiveQA
            id={dataId}
            parentFetch={fetchQuestions}
            isAmbiguous={isAmbiguous}
          />
        </div>
        <div className="lowerContainer">
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Typography>unambiguous</Typography>
            <AntSwitch
              checked={isAmbiguous}
              onChange={(e) => setIsAmbiguous(e.target.checked)} // Toggle state based on switch
              inputProps={{ "aria-label": "ant design" }}
            />
            <Typography>ambiguous</Typography>
          </Stack>
        </div>
      </div>
    );
  }
};

export default Home;
