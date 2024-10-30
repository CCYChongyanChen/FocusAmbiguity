// src/types.ts

import { index } from "d3";

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
  objects_labels: string[];
  parts_labels: string[];
  // selectedMasks: number[];
};

// You can add more common types or interfaces here as needed
export type InteractiveSVGProps = {
  id: number;
  parentFetch: () => void;
  updated: boolean;
};

export type InteractiveQAProps = {
  id: number;
  parentFetch: () => void;
};

export type InteractiveQALandingProps = {
  id: number;
  questions: string[];
  fetchQuestions: () => void;
};

export type EditableFormControlLabelProps = {
  id: number;
  editing: boolean;
  index: number;
  selectedQuestion: string;
  formHandler: (event: React.ChangeEvent<any>, index: number) => void;
};

export type InteractiveLabelingProps = {
  id: number;
  questions: string[];
  selectedQuestion: number[];
  fetchQuestions: () => void;
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
