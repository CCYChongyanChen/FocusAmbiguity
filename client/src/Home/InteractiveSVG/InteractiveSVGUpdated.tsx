import React, { useEffect, useRef } from "react";
import "../Home.css"; // Importing the CSS
import "./InteractiveSVG.css"; // Importing the CSS
import * as d3 from "d3";
import { AmbData, InteractiveSVGProps } from "../../types";
import { putSelectedObject, putSelectedParts } from "./updateMask";
import SelectTools from "./SelectTool";

const InteractiveSVGUpdated: React.FC<InteractiveSVGProps> = ({
  id,
  parentFetch,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const svgRefParts = useRef<SVGSVGElement | null>(null);
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

  const [objectsClass, setObjectsClass] = React.useState<
    AmbData["objects_labels"]
  >([]);

  const [partsClass, setPartsClass] = React.useState<AmbData["parts_labels"]>(
    [],
  );

  const [hideAllLabel, setHideAllLabel] = React.useState<boolean>(false);

  // const [selectedObjectPolygon, setSelectedObjectPolygon] = React.useState<
  //   d3.Selection<SVGPolygonElement, unknown, null, undefined>[]
  // >([]);

  // Fetch the JSON data on component mount

  const segmentationColors = [
    "#FF6F61",
    "#6B5B95",
    "#88B04B",
    "#F7CAC9",
    "#92A8D1",
    "#955251",
    "#B565A7",
    "#009B77",
    "#DD4124",
    "#45B8AC",
    "#EFC050",
    "#5B5EA6",
    "#9B2335",
    "#DFCFBE",
    "#BC243C",
    "#C3447A",
    "#D65076",
    "#E15D44",
    "#7FCDCD",
    "#9C9A40",
    "#6C4F3D",
    "#00A591",
    "#2A4B7C",
    "#E94B3C",
    "#6C7A89",
    "#F0EAD6",
    "#9E1030",
    "#6B4423",
    "#F7786B",
    "#91A8D0",
  ];

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
          setObjectsClass(data.objects_labels);
          setPartsClass(data.parts_labels);
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
    confirmSelections();
    fetchQuestions(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPolygonIndex, selectedObjectPolygonIndex]);

  useEffect(() => {
    if (
      svgRef.current &&
      imageURL &&
      imageDimensions.width > 0 &&
      imageDimensions.height > 0 &&
      partsPolygon.length > 0
    ) {
      const svgObject = d3.select(svgRef.current);
      const svgParts = d3.select(svgRefParts.current);

      svgObject
        .attr(
          "viewBox",
          `0 0 ${imageDimensions.width} ${imageDimensions.height}`,
        )
        .attr("width", "90%"); // Make it responsive

      svgObject
        .append("image")
        .attr("href", imageURL) // Replace with the actual image path
        .attr("x", 0)
        .attr("y", 0);

      svgParts
        .attr(
          "viewBox",
          `0 0 ${imageDimensions.width} ${imageDimensions.height}`,
        )
        .attr("width", "90%"); // Make it responsive

      svgParts
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
          return svgObject
            .append("polygon")
            .attr("points", pointsString)
            .attr("fill", "transparent")
            .attr("stroke", "white")
            .attr("opacity", 0.5)
            .attr("stroke-dasharray", "100,0"); // Add dashed stroke (5px dash, 5px gap)
        });

        // // construct points array of [number, number] from segmentations array
        const points: [number, number][] = [];
        const segmentations = objects[0];
        for (let i = 0; i < segmentations.length; i += 2) {
          points.push([segmentations[i], segmentations[i + 1]]);
        }

        const [cx, cy] = d3.polygonCentroid(points);

        console.log(hideAllLabel);

        if (!hideAllLabel) {
          svgObject
            .append("text")
            .attr("x", cx)
            .attr("y", cy)
            .text(objectsClass[groupIndex])
            .attr("text-anchor", "middle")
            .attr("font-size", "14px")
            .attr("fill", "white")
            .attr("font-weight", "bold");
        }

        // Check if the group is already selected
        let isPrevSelected = selectedObjects.includes(groupIndex);
        let isSelected = false;

        // Apply red fill for previously selected parts
        if (isPrevSelected) {
          polygons.forEach((polygon) => {
            polygon
              .attr("fill", segmentationColors[groupIndex])
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
                  .attr("fill", segmentationColors[groupIndex])
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
                poly.attr("stroke", "red").attr("opacity", 0.5);
              });
              // setSelectedPolygon([]);
              setSelectedObjectPolygonIndex(-1);
              isSelected = false;
            } else if (!isPrevSelected && !isSelected) {
              console.log("Object not selected");
              // If the group was not previously selected, select all
              polygons.forEach((poly) => {
                poly
                  .attr("fill", segmentationColors[groupIndex])
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
                  .attr("fill", "transparent")
                  .attr("stroke", "white")
                  .attr("opacity", 1)
                  .attr("stroke-dasharray", "150,0"); // Add dashed stroke (5px dash, 5px gap)
              });
              // setSelectedObjectPolygon([]);
              setSelectedObjectPolygonIndex(-1);
              isSelected = false;
            }
          });
        });
      });

      const calculatePolygonArea = (points: number[][]) => {
        let area = 0;
        for (let i = 0; i < points.length; i++) {
          const [x1, y1] = points[i];
          const [x2, y2] = points[(i + 1) % points.length];
          area += x1 * y2 - x2 * y1;
        }
        return Math.abs(area / 2);
      };

      const sortedParts: {
        parts: number[][];
        groupIndex: number;
        avgArea: number;
      }[] = partsPolygon
        .map((parts, groupIndex) => {
          const areas = parts.map((segmentations) => {
            const points: [number, number][] = [];
            for (let i = 0; i < segmentations.length; i += 2) {
              points.push([segmentations[i], segmentations[i + 1]]);
            }
            return calculatePolygonArea(points); // Calculate area for each polygon
          });
          const avgArea =
            areas.reduce((sum, area) => sum + area, 0) / areas.length; // Calculate average area
          return { parts, groupIndex, avgArea }; // Store original groupIndex with parts
        })
        .sort((a, b) => b.avgArea - a.avgArea); // Sort by average area descending

      sortedParts.forEach((parts, groupIndex) => {
        // parts is now an array of multiple segmentations (2D array)
        const polygons = parts.parts.map(
          (segmentations: number[], partIndex: number) => {
            const points = [];
            for (let i = 0; i < segmentations.length; i += 2) {
              points.push([segmentations[i], segmentations[i + 1]]);
            }

            // convert the points to a string
            const pointsString = points
              .map((point) => point.join(","))
              .join(" ");

            // Append the polygon to the SVG
            return svgParts
              .append("polygon")
              .attr("points", pointsString)
              .attr("fill", segmentationColors[groupIndex])
              .attr("stroke", "black")
              .attr("opacity", 0.5)
              .attr("stroke-dasharray", "30,5"); // Add dashed stroke (5px dash, 5px gap)
          },
        );

        // construct points array of [number, number] from segmentations array
        const points: [number, number][] = [];
        const segmentations = parts.parts[0];
        for (let i = 0; i < segmentations.length; i += 2) {
          points.push([segmentations[i], segmentations[i + 1]]);
        }

        const [cx, cy] = d3.polygonCentroid(points);

        if (!hideAllLabel) {
          svgParts
            .append("text")
            .attr("x", cx)
            .attr("y", cy)
            .text(partsClass[parts.groupIndex])
            .attr("text-anchor", "middle")
            .attr("font-size", "14px")
            .attr("fill", "white")
            .attr("font-weight", "medium");
        }

        // Check if the group is already selected
        let isPrevSelected = selectedParts.includes(parts.groupIndex);
        let isSelected = false;

        // Apply red fill for previously selected parts
        if (isPrevSelected) {
          polygons.forEach((polygon) => {
            polygon
              .attr("fill", segmentationColors[groupIndex])
              .attr("stroke", "white")
              .attr("stroke-dasharray", "10,5")
              .attr("opacity", 0.8);
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
                  .attr("fill", segmentationColors[groupIndex])
                  .attr("opacity", 0.7)
                  .attr("stroke", "black")
              });
              // setSelectedPolygon(polygons);
              setSelectedPolygonIndex(parts.groupIndex);
              // setSelectedObjectPolygon([]);
              setSelectedObjectPolygonIndex(-1);
              isSelected = true;
            } else if (isPrevSelected && isSelected) {
              console.log("Object selected");
              // Deselect the group
              polygons.forEach((poly) => {
                poly
                  .attr("stroke", segmentationColors[groupIndex])
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
                  .attr("fill", segmentationColors[groupIndex])
                  .attr("opacity", 0.7)
                  .attr("stroke", "black")
                  .attr("stroke-dasharray", "5,5"); // Add dashed stroke (5px dash, 5px gap)
              });
              // setSelectedPolygon(polygons);
              setSelectedPolygonIndex(parts.groupIndex);
              // setSelectedObjectPolygon([]);
              setSelectedObjectPolygonIndex(-1);
              isSelected = true;
            } else {
              console.log("Object deselected");
              // Deselect all polygons in the group
              polygons.forEach((poly) => {
                poly
                  .attr("fill", segmentationColors[groupIndex])
                  .attr("stroke", "white")
                  .attr("opacity", 0.5)
                  .attr("stroke-dasharray", "10,5"); // Add dashed stroke (5px dash, 5px gap)
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
  }, [imageURL, imageDimensions, svgRef, hideAllLabel, svgRefParts]);

  function confirmSelections() {
    console.log("Confirming selections...");
    if (
      selectedPolygonIndex !== -1 &&
      !selectedParts.includes(selectedPolygonIndex)
    ) {
      console.log("selected parts", selectedParts);
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

    if (
      selectedObjectPolygonIndex !== -1 &&
      selectedPolygonIndex === -1 &&
      !selectedObjects.includes(selectedObjectPolygonIndex)
    ) {
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

    if (
      selectedObjects.includes(selectedObjectPolygonIndex) ||
      selectedParts.includes(selectedPolygonIndex)
    ) {
      console.log("Already selected, now deselecting...");
      if (selectedPolygonIndex !== -1) {
        let newSelectedparts = selectedParts.filter(
          (part) => part !== selectedPolygonIndex,
        );
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
      } else if (selectedObjectPolygonIndex !== -1) {
        let newSelectedObjects = selectedObjects.filter(
          (object) => object !== selectedObjectPolygonIndex,
        );
        putSelectedObject(newSelectedObjects, id)
          .then(() => {
            // Once the data is successfully sent, fetch the updated mask data
            console.log(
              "Objects updated. Fetching latest selected questions...",
            );
            fetchQuestions(id); // Fetch the latest data again
            parentFetch(); // update parent
          })
          .catch((error) => {
            console.error("Error updating objects:", error);
          });
      } else {
        console.log("Error in deselecting...");
      }
    }

    setSelectedPolygonIndex(-1);
    setSelectedObjectPolygonIndex(-1);
    // setSelectedPolygon([]);
    // setSelectedObjectPolygon([]);
  }

  // const confirmSelectionButton = () => {
  //   if (
  //     (selectedPolygonIndex === -1 && selectedObjectPolygonIndex === -1) ||
  //     selectedObjects.includes(selectedPolygonIndex) ||
  //     selectedParts.includes(selectedObjectPolygonIndex)
  //   ) {
  //     return (
  //       <Button
  //         variant="contained"
  //         disabled
  //         sx={{
  //           width: "34%",
  //           fontFamily: "Open Sans",
  //           fontWeight: 600,
  //         }}
  //       >
  //         Confirm Selections
  //       </Button>
  //     );
  //   } else {
  //     return (
  //       <Button
  //         variant="contained"
  //         sx={{
  //           bgcolor: "#F9D68E",
  //           color: "black",
  //           width: "34%",
  //           fontFamily: "Open Sans",
  //           fontWeight: 600,
  //         }}
  //         onClick={() => {
  //           confirmSelections();
  //         }}
  //       >
  //         Confirm Selections
  //       </Button>
  //     );
  //   }
  // };

  return (
    <div className="section section1">
      <SelectTools
        hideAllLabel={hideAllLabel}
        setHideAllLabel={setHideAllLabel}
      />
      <svg ref={svgRef}></svg>
      <svg ref={svgRefParts}></svg>
    </div>
  );
};

export default InteractiveSVGUpdated;
