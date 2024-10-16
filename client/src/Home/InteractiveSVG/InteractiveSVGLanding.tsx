import React, { useEffect, useRef } from "react";
import "../Home.css"; // Importing the CSS
import "./InteractiveSVG.css"; // Importing the CSS
import * as d3 from "d3";
import { AmbData, InteractiveSVGProps } from "../../types";

const InteractiveSVGLanding: React.FC<InteractiveSVGProps> = ({ id }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [imageURL, setImageURL] = React.useState<string>("");
  const [imageDimensions, setImageDimensions] = React.useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  // Fetch the JSON data on component mount
  useEffect(() => {
    console.log("Fetching data for id:", id);
    const getDataURL = `http://localhost:4000/api/users/${id}`;
    fetch(getDataURL) // Fetching the JSON file from the public directory
      .then((response) => response.json())
      .then((data: AmbData) => {
        if (data) {
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
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [id, imageURL]);

  useEffect(() => {
    if (
      svgRef.current &&
      imageURL &&
      imageDimensions.width > 0 &&
      imageDimensions.height > 0
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
    }
  }, [imageURL, imageDimensions, svgRef]);

  return (
    <div className="section section1">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default InteractiveSVGLanding;
