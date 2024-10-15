// src/types.ts

// Define the AmbData type
// Define segmentation type which inherit in AmbData

type Segmentation = {
  segmentation: number[];
  area: number;
  iscrowd: boolean;
  image_id: number;
  bbox: number[];
  category_id: number;
};

export type AmbData = {
  id: number;
  imageURL: string;
  width: number;
  height: number;
  questions: string[];
  selectedQuestions: number[];
  masks: Segmentation[];
  selectedMasks: number[];
};

// You can add more common types or interfaces here as needed
export type InteractiveSVGProps = {
  id: number;
  width?: number;
  height?: number;
};

export type InteractiveQAProps = {
  id: number;
};

export type InteractiveQALandingProps = {
  id: number;
  questions: string[];
};

export type InteractiveLabelingProps = {
  id: number;
  questions: string[];
  selectedQuestion: number[];
};

export type SelectToolsProps = {
  hidedPolygon: d3.Selection<SVGPolygonElement, unknown, null, undefined>[];
  setHidedPolygon: React.Dispatch<
    React.SetStateAction<
      d3.Selection<SVGPolygonElement, unknown, null, undefined>[]
    >
  >;
  setAllPolygonVisible: () => void;  // Function to make all polygons visible
};
