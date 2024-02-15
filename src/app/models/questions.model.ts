export interface MultipleQuestion extends Question {
  posibleAnwers: [string, string, string]
}

export interface ImageQuestion extends Question {
  images: [string, string, string];
}

//To upload models:
export interface MultipleQuestionUploadDTO
  extends Omit<MultipleQuestion, 'id'> {}

export interface ImageQuestionUploadDTO extends Omit<ImageQuestion, 'id'> {}

// To upload to database:
export type QuestionUploadDTO =
  | MultipleQuestionUploadDTO
  | ImageQuestionUploadDTO;


  // To download to database:
export type QuestionDownloadDTO = MultipleQuestion | ImageQuestion;

// Abstract model:
export interface Question {
  id: string | null;
  questionInstruction: string;
  asignature: string;
  difficultLevelRow: number;
  difficultLevelColumn: number;
  correctAnswer: string;
  type: 'multiple' | 'image';
}

export enum CollectionsDB {
  Asignatures = 'Asignatures',
  Questions = 'Questions',
}