import { FormGroup, ValidatorFn } from '@angular/forms';

export interface IQuestionForm {
  questionInstruction: [string, ValidatorFn[]];
  asignature: [string, ValidatorFn[]];
  difficultLevelRow: [number, ValidatorFn[]];
  difficultLevelColumn: [number, ValidatorFn[]];
  correctAnswer: [string, ValidatorFn[]];
  type: [string, ValidatorFn[]];
  posibleAnswers: FormGroup;
  images: FormGroup;
}



export enum EQuestionFields {
  questionInstruction = 'questionInstruction',
  asignature = 'asignature',
  difficultLevelRow = 'difficultLevelRow',
  difficultLevelColumn = 'difficultLevelColumn',
  correctAnswer = 'correctAnswer',
  type = 'type',
  posibleAnswers = 'posibleAnswers',
  images = 'images',
  answerA = 'answerA',
  answerB = 'answerB',
  answerC = 'answerC',
}