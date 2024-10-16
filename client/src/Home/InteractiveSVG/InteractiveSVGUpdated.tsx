import React, { useEffect, useRef } from "react";
import "../Home.css"; // Importing the CSS
import "./InteractiveSVG.css"; // Importing the CSS
import * as d3 from "d3";
import { AmbData, InteractiveSVGProps } from "../../types";
import Button from "@mui/material/Button";
import SelectTools from "./SelectTool";
import { putSelectedMasks } from "./updateMask";

const InteractiveSVGUpdated: React.FC<InteractiveSVGProps> = ({ id }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [imageURL, setImageURL] = React.useState<string>("");
  const [imageDimensions, setImageDimensions] = React.useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });
  const [partsPolygon, setPartsPolygon] = React.useState<
    AmbData["parts_polygons"]["polygons"]
  >([]);
  const [partsPolygonHasHoles, setPartsPolygonHasHoles] = React.useState<
    AmbData["parts_polygons"]["has_holes"]
  >([]);
  const [selectedMask, setSelectedMask] = React.useState<
    AmbData["selected_parts_polygons"]
  >([]);
  const [selectedPolygon, setSelectedPolygon] = React.useState<
    d3.Selection<SVGPolygonElement, unknown, null, undefined>[]
  >([]);

  const [selectedPolygonIndex, setSelectedPolygonIndex] =
    React.useState<number>(-1);

  const [hidedPolygon, setHidedPolygon] = React.useState<
    d3.Selection<SVGPolygonElement, unknown, null, undefined>[][]
  >([]);

  // Fetch the JSON data on component mount
  const fetchQuestions = (id: number) => {
    const getDataURL = `http://localhost:4000/api/users/${id}`;
    console.log("Fetching data from:", getDataURL);
    fetch(getDataURL) // Fetching the JSON file from the ablic directory
      .then((response) => response.json())
      .then((data: AmbData) => {
        if (data) {
          console.log("Data fetched:", data);
          setImageURL(data.imageURL); // Set the image URL for this id

          // set image dimensions by load image
          const img = new Image();
          img.src = imageURL;
          img.onload = () => {
            setImageDimensions({
              width: img.width,
              height: img.height,
            });
          };
          setPartsPolygon(data.parts_polygons.polygons);
          setPartsPolygonHasHoles(data.parts_polygons.has_holes);
          setSelectedMask(data.selected_parts_polygons);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    fetchQuestions(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, imageURL]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "h" && selectedPolygon.length > 0) {
        // Hide the selected polygon when "h" is pressed
        selectedPolygon.forEach((polygon) => {
          if (polygon) {
            polygon.style("display", "none");
          }
        });
        setHidedPolygon((prevHidedPolygon) => [
          ...prevHidedPolygon,
          selectedPolygon,
        ]);
        setSelectedPolygon([]); // Deselect after hiding
        console.log("Selected polygon hidden");
      }
    };

    // Attach the event listener for keypress
    window.addEventListener("keydown", handleKeyPress);

    // Cleanup event listener when component is unmounted
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [selectedPolygon, hidedPolygon]);

  useEffect(() => {
    if (
      svgRef.current &&
      imageURL &&
      imageDimensions.width > 0 &&
      imageDimensions.height > 0 &&
      partsPolygon.length > 0
    ) {
      const svg = d3.select(svgRef.current);

      svg
        .attr(
          "viewBox",
          `0 0 ${imageDimensions.width} ${imageDimensions.height}`,
        )
        .attr("width", "90%"); // Make it responsive

      svg
        .append("image")
        .attr("href", imageURL) // Replace with the actual image path
        .attr("x", 0)
        .attr("y", 0);

      partsPolygon.forEach((parts, groupIndex) => {
        // parts is now an array of multiple segmentations (2D array)
        const polygons = parts.map((segmentations, partIndex) => {
          const points = [];
          for (let i = 0; i < segmentations.length; i += 2) {
            points.push([segmentations[i], segmentations[i + 1]]);
          }

          // convert the points to a string
          const pointsString = points.map((point) => point.join(",")).join(" ");

          // Append the polygon to the SVG
          return svg
            .append("polygon")
            .attr("points", pointsString)
            .attr("fill", "blue")
            .attr("stroke", "blue")
            .attr("opacity", 0.5)
            .attr("stroke-width", 2);
        });

        // Check if the group is already selected
        let isPrevSelected = selectedMask.includes(groupIndex);
        let isSelected = false;

        // Apply red fill for previously selected parts
        if (isPrevSelected) {
          polygons.forEach((polygon) => {
            polygon
              .attr("fill", "red")
              .attr("stroke", "red")
              .attr("opacity", 0.5);
          });
        }

        // Click handler for selecting/deselecting all parts in the group
        polygons.forEach((polygon) => {
          polygon.on("click", function () {
            if (isPrevSelected && !isSelected) {
              // If the group was previously selected but not currently selected, select all
              polygons.forEach((poly) => {
                poly
                  .attr("fill", "red")
                  .attr("opacity", 0.7)
                  .attr("stroke", "black")
                  .attr("stroke-dasharray", "5,5"); // Add dashed stroke (5px dash, 5px gap)
              });
              setSelectedPolygon(polygons);
              setSelectedPolygonIndex(groupIndex);
              isSelected = true;
            } else if (isPrevSelected && isSelected) {
              // Deselect the group
              polygons.forEach((poly) => {
                poly
                  .attr("fill", "red")
                  .attr("stroke", "red")
                  .attr("opacity", 0.5);
              });
              setSelectedPolygon([]);
              setSelectedPolygonIndex(-1);
              isSelected = false;
            } else if (!isPrevSelected && !isSelected) {
              // If the group was not previously selected, select all
              polygons.forEach((poly) => {
                poly
                  .attr("fill", "red")
                  .attr("opacity", 0.7)
                  .attr("stroke", "black")
                  .attr("stroke-dasharray", "5,5"); // Add dashed stroke (5px dash, 5px gap)
              });
              setSelectedPolygon(polygons);
              setSelectedPolygonIndex(groupIndex);
              isSelected = true;
            } else {
              // Deselect all polygons in the group
              polygons.forEach((poly) => {
                poly
                  .attr("fill", "blue")
                  .attr("stroke", "blue")
                  .attr("opacity", 0.5);
              });
              setSelectedPolygon([]);
              setSelectedPolygonIndex(-1);
              isSelected = false;
            }
          });
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageURL, imageDimensions, svgRef]);

  function confirmSelections() {
    // Send the selected masks to the backend
    console.log("Selected masks", selectedPolygonIndex);
    let newSelectedMask = [...selectedMask, selectedPolygonIndex];
    putSelectedMasks(newSelectedMask, id)
      .then(() => {
        // Once the data is successfully sent, fetch the updated mask data
        console.log("Masks updated. Fetching latest selected questions...");
        fetchQuestions(id); // Fetch the latest data again
      })
      .catch((error) => {
        console.error("Error updating masks:", error);
      });
  }

  const confirmSelectionButton = () => {
    if (
      selectedPolygonIndex === -1 ||
      selectedMask.includes(selectedPolygonIndex)
    ) {
      return (
        <Button
          variant="contained"
          disabled
          sx={{
            width: "34%",
            fontFamily: "Open Sans",
            fontWeight: 600,
          }}
        >
          Confirm Selections
        </Button>
      );
    } else {
      return (
        <Button
          variant="contained"
          sx={{
            bgcolor: "#F9D68E",
            color: "black",
            width: "34%",
            fontFamily: "Open Sans",
            fontWeight: 600,
          }}
          onClick={() => {
            confirmSelections();
          }}
        >
          Confirm Selections
        </Button>
      );
    }
  };

  return (
    <div className="section section1">
      <div className="counter">
        <p className="selectedMaskText">
          Number of parts selected: {selectedMask.length}
        </p>
      </div>
      <SelectTools
        hidedPolygon={hidedPolygon}
        setHidedPolygon={setHidedPolygon}
        setAllPolygonVisible={() => {
          d3.selectAll("polygon").style("display", "block");
        }}
      />
      <svg ref={svgRef}></svg>
      <div className="submitButtonContainer submitButtonContainerSVG">
        {confirmSelectionButton()}
      </div>
    </div>
  );
};

export default InteractiveSVGUpdated;
