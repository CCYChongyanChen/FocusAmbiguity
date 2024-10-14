// src/types.ts

// Define the AmbData type
export type AmbData = {
  id: number;
  imageURL: string;
  questions: string[];
  selectedQuestions: number[];
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

