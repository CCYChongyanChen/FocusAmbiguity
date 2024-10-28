import React, { useEffect, useRef } from "react";
import "../Home.css"; // Importing the CSS
import "./InteractiveSVG.css"; // Importing the CSS
import * as d3 from "d3";
import { AmbData, InteractiveSVGProps } from "../../types";
import Button from "@mui/material/Button";
import { putSelectedObject, putSelectedParts } from "./updateMask";

const InteractiveSVGUpdated: React.FC<InteractiveSVGProps> = ({
  id,
  parentFetch,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [imageURL, setImageURL] = React.useState<string>("");
  const [imageDimensions, setImageDimensions] = React.useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });
  const [partsPolygon, setPartsPolygon] = React.useState<
    AmbData["parts_polygons"]["polygons"]
  >([]);
  // const [partsPolygonHasHoles, setPartsPolygonHasHoles] = React.useState<
  //   AmbData["parts_polygons"]["has_holes"]
  // >([]);
  const [objectsPolygon, setObjectsPolygon] = React.useState<
    AmbData["objects_polygons"]
  >([]);
  const [selectedParts, setSelectedParts] = React.useState<
    AmbData["selected_parts_polygons"]
  >([]);
  const [selectedObjects, setSelectedObjects] = React.useState<
    AmbData["selected_objects_polygons"]
  >([]);
  // const [selectedPolygon, setSelectedPolygon] = React.useState<
  //   d3.Selection<SVGPolygonElement, unknown, null, undefined>[]
  // >([]);

  const [selectedPolygonIndex, setSelectedPolygonIndex] =
    React.useState<number>(-1);

  const [selectedObjectPolygonIndex, setSelectedObjectPolygonIndex] =
    React.useState<number>(-1);

  // const [selectedObjectPolygon, setSelectedObjectPolygon] = React.useState<
  //   d3.Selection<SVGPolygonElement, unknown, null, undefined>[]
  // >([]);

  // Fetch the JSON data on component mount
  const fetchQuestions = (id: number) => {
    const getDataURL = `https://focusambiguity-f3d2d4c819b3.herokuapp.com/api/users/${id}`;
    console.log("Fetching data from:", getDataURL);
    fetch(getDataURL) // Fetching the JSON file from the ablic directory
      .then((response) => response.json())
      .then((data: AmbData) => {
        if (data) {
          setImageURL(
            `https://focusambiguity-f3d2d4c819b3.herokuapp.com/fetch-image?url=${encodeURIComponent(
              data.imageURL,
            )}`,
          );
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
          // setPartsPolygonHasHoles(data.parts_polygons.has_holes);
          setSelectedParts(data.selected_parts_polygons);
          setSelectedObjects(data.selected_objects_polygons);
          setObjectsPolygon(data.objects_polygons);
        }
        // console.log("Selected parts:", selectedParts);
        // console.log("Selected objects:", selectedObjects);
        // console.log(selectedParts.length + selectedObjects.length);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    fetchQuestions(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, imageURL]);

  // useEffect(() => {
  //   const handleKeyPress = (event: KeyboardEvent) => {
  //     if (event.key === "h") {
  //       if (selectedPolygon.length > 0) {
  //         // Hide the selected polygon when "h" is pressed
  //         selectedPolygon.forEach((polygon) => {
  //           if (polygon) {
  //             polygon.style("display", "none");
  //           }
  //         });
  //         setHidedPolygon((prevHidedPolygon) => [
  //           ...prevHidedPolygon,
  //           selectedPolygon,
  //         ]);
  //         setSelectedPolygon([]); // Deselect after hiding
  //         console.log("Selected parts polygon hidden");
  //       } else if (selectedObjectPolygon.length > 0) {
  //         // Hide the selected polygon when "h" is pressed
  //         selectedObjectPolygon.forEach((polygon) => {
  //           if (polygon) {
  //             polygon.style("display", "none");
  //           }
  //         });
  //         setHidedPolygon((prevHidedPolygon) => [
  //           ...prevHidedPolygon,
  //           selectedObjectPolygon,
  //         ]);
  //         setSelectedObjectPolygon([]); // Deselect after hiding
  //         console.log("Selected object polygon hidden");
  //       }
  //     }
  //   };

  //   // Attach the event listener for keypress
  //   window.addEventListener("keydown", handleKeyPress);

  //   // Cleanup event listener when component is unmounted
  //   return () => {
  //     window.removeEventListener("keydown", handleKeyPress);
  //   };
  // }, [selectedPolygon, hidedPolygon, selectedObjectPolygon]);

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

      objectsPolygon.forEach((objects, groupIndex) => {
        console.log("Objects:", objects);
        // parts is now an array of multiple segmentations (2D array)
        const polygons = objects.map((segmentations, partIndex) => {
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
            .attr("fill", "grey")
            .attr("stroke", "grey")
            .attr("opacity", 0.5)
            .attr("stroke-width", 2);
        });

        // Check if the group is already selected
        let isPrevSelected = selectedObjects.includes(groupIndex);
        let isSelected = false;

        // Apply red fill for previously selected parts
        if (isPrevSelected) {
          polygons.forEach((polygon) => {
            polygon
              // .attr("fill", "red")
              .attr("stroke", "red")
              .attr("opacity", 0.5);
          });
        }

        polygons.forEach((polygon) => {
          polygon.on("click", function () {
            console.log("Object clicked");
            console.log("Selected object polygon index:", groupIndex);
            if (isPrevSelected && !isSelected) {
              console.log("Object selected");
              // If the group was previously selected but not currently selected, select all
              polygons.forEach((poly) => {
                poly
                  .attr("fill", "red")
                  .attr("opacity", 0.7)
                  .attr("stroke", "black")
                  .attr("stroke-dasharray", "10,5"); // Add dashed stroke (10px dash, 5px gap)
              });
              // setSelectedObjectPolygon(polygons);
              setSelectedObjectPolygonIndex(groupIndex);
              // setSelectedPolygon([]);
              setSelectedPolygonIndex(-1);
              isSelected = true;
            } else if (isPrevSelected && isSelected) {
              console.log("Object selected");
              // Deselect the group
              polygons.forEach((poly) => {
                poly
                  .attr("fill", "grey")
                  .attr("stroke", "red")
                  .attr("opacity", 0.5);
              });
              // setSelectedPolygon([]);
              setSelectedObjectPolygonIndex(-1);
              isSelected = false;
            } else if (!isPrevSelected && !isSelected) {
              console.log("Object not selected");
              // If the group was not previously selected, select all
              polygons.forEach((poly) => {
                poly
                  .attr("fill", "red")
                  .attr("opacity", 0.7)
                  .attr("stroke", "black")
                  .attr("stroke-dasharray", "5,5"); // Add dashed stroke (5px dash, 5px gap)
              });
              // setSelectedObjectPolygon(polygons);
              setSelectedObjectPolygonIndex(groupIndex);
              // setSelectedPolygon([]);
              setSelectedPolygonIndex(-1);
              isSelected = true;
            } else {
              console.log("Object deselected");
              // Deselect all polygons in the group
              polygons.forEach((poly) => {
                poly
                  .attr("fill", "grey")
                  .attr("stroke", "grey")
                  .attr("opacity", 0.5);
              });
              // setSelectedObjectPolygon([]);
              setSelectedObjectPolygonIndex(-1);
              isSelected = false;
            }
          });
        });
      });

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
            .attr("fill", "transparent")
            .attr("stroke", "blue")
            .attr("opacity", 0.5)
            .attr("stroke-width", 2);
        });

        // Check if the group is already selected
        let isPrevSelected = selectedParts.includes(groupIndex);
        let isSelected = false;

        // Apply red fill for previously selected parts
        if (isPrevSelected) {
          polygons.forEach((polygon) => {
            polygon.attr("stroke", "red").attr("opacity", 0.5);
          });
        }

        // Click handler for selecting/deselecting all parts in the group
        polygons.forEach((polygon) => {
          polygon.on("click", function () {
            if (isPrevSelected && !isSelected) {
              console.log("Object clicked");
              // If the group was previously selected but not currently selected, select all
              polygons.forEach((poly) => {
                poly
                  .attr("fill", "red")
                  .attr("opacity", 0.7)
                  .attr("stroke", "black")
                  .attr("stroke-dasharray", "5,5"); // Add dashed stroke (5px dash, 5px gap)
              });
              // setSelectedPolygon(polygons);
              setSelectedPolygonIndex(groupIndex);
              // setSelectedObjectPolygon([]);
              setSelectedObjectPolygonIndex(-1);
              isSelected = true;
            } else if (isPrevSelected && isSelected) {
              console.log("Object selected");
              // Deselect the group
              polygons.forEach((poly) => {
                poly
                  .attr("fill", "transparent")
                  .attr("stroke", "red")
                  .attr("opacity", 0.5)
                  .attr("stroke-dasharray", "0,0"); // Add dashed stroke (5px dash, 5px gap)
              });
              // setSelectedPolygon([]);
              setSelectedPolygonIndex(-1);
              isSelected = false;
            } else if (!isPrevSelected && !isSelected) {
              console.log("Object not selected");
              // If the group was not previously selected, select all
              polygons.forEach((poly) => {
                poly
                  .attr("fill", "red")
                  .attr("opacity", 0.7)
                  .attr("stroke", "black")
                  .attr("stroke-dasharray", "5,5"); // Add dashed stroke (5px dash, 5px gap)
              });
              // setSelectedPolygon(polygons);
              setSelectedPolygonIndex(groupIndex);
              // setSelectedObjectPolygon([]);
              setSelectedObjectPolygonIndex(-1);
              isSelected = true;
            } else {
              console.log("Object deselected");
              // Deselect all polygons in the group
              polygons.forEach((poly) => {
                poly
                  .attr("fill", "transparent")
                  .attr("stroke", "blue")
                  .attr("opacity", 0.5);
              });
              // setSelectedPolygon([]);
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
    if (selectedPolygonIndex !== -1) {
      let newSelectedparts = [...selectedParts, selectedPolygonIndex];
      putSelectedParts(newSelectedparts, id)
        .then(() => {
          // Once the data is successfully sent, fetch the updated mask data
          console.log("Parts updated. Fetching latest selected questions...");
          fetchQuestions(id); // Fetch the latest data again
          parentFetch(); // update parent
        })
        .catch((error) => {
          console.error("Error updating parts:", error);
        });
    }

    if (selectedObjectPolygonIndex !== -1 && selectedPolygonIndex === -1) {
      let newSelectedObjects = [...selectedObjects, selectedObjectPolygonIndex];
      putSelectedObject(newSelectedObjects, id)
        .then(() => {
          // Once the data is successfully sent, fetch the updated mask data
          console.log("Objects updated. Fetching latest selected questions...");
          fetchQuestions(id); // Fetch the latest data again
          parentFetch(); // update parent
        })
        .catch((error) => {
          console.error("Error updating objects:", error);
        });
    }

    setSelectedPolygonIndex(-1);
    setSelectedObjectPolygonIndex(-1);
    // setSelectedPolygon([]);
    // setSelectedObjectPolygon([]);
  }

  const confirmSelectionButton = () => {
    if (
      (selectedPolygonIndex === -1 && selectedObjectPolygonIndex === -1) ||
      selectedObjects.includes(selectedPolygonIndex) ||
      selectedParts.includes(selectedObjectPolygonIndex)
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
          Number of parts selected:{" "}
          {selectedParts.length + selectedObjects.length}
        </p>
      </div>
      {/* <SelectTools
        hidedPolygon={hidedPolygon}
        setHidedPolygon={setHidedPolygon}
        setAllPolygonVisible={() => {
          d3.selectAll("polygon").style("display", "block");
        }}
      /> */}
      <svg ref={svgRef}></svg>
      <div className="submitButtonContainer submitButtonContainerSVG">
        {confirmSelectionButton()}
      </div>
    </div>
  );
};

export default InteractiveSVGUpdated;
