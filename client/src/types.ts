// src/types.ts

// Define the AmbData type
// Define segmentation type which inherit in AmbData

type partsPolygon = {
  polygons: number[][][];
  has_holes: boolean[];
};

type partsMasks = {
  size: number[];
  counts: string;
};

export type AmbData = {
  id: number;
  imageURL: string;
  // width: number;
  // height: number;
  questions: string[];
  selected_questions: number[];
  parts_polygons: partsPolygon;
  parts_masks: partsMasks[];
  objects_polygons: number[][][];
  selected_parts_polygons: number[];
  selected_objects_polygons: number[];
  object_labels: string[];
  parts_labels: string[];
  // selectedMasks: number[];
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
  hidedPolygon: d3.Selection<SVGPolygonElement, unknown, null, undefined>[][];
  setHidedPolygon: React.Dispatch<
    React.SetStateAction<
      d3.Selection<SVGPolygonElement, unknown, null, undefined>[][]
    >
  >;
  setAllPolygonVisible: () => void; // Function to make all polygons visible
};
