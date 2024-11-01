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
  original_questions: string[]
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
  originalQuestions: string[];
  selectedQuestion: string;
  isSelected: boolean;
  formHandler: (event: React.ChangeEvent<any>, index: number) => void;
  fetchQuestions: () => void;
};

export type InteractiveLabelingProps = {
  id: number;
  questions: string[];
  originalQuestions: string[];
  selectedQuestion: number[];
  setSelectedQuestion: React.Dispatch<React.SetStateAction<number[]>>;
  fetchQuestions: () => void;
};

export type SelectToolsProps = {
  hideAllLabel: boolean;
  setHideAllLabel: React.Dispatch<React.SetStateAction<boolean>>;
};
