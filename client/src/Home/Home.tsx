import React, { useState } from "react";
import "./Home.css"; // Importing the CSS
import InteractiveSVG from "./InteractiveSVG/InteractiveSVG";
import InteractiveQA from "./InteractiveQA/InteractiveQA";

const Home: React.FC = () => {
  const [dataId, setDataId] = useState<number>(0);

  return (
    <div className="container">
      <InteractiveSVG id={dataId} />
      <InteractiveQA id={dataId} />
    </div>
  );
};

export default Home;
