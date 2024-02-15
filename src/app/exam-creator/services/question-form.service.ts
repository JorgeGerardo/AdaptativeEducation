import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { IQuestionForm } from 'src/app/models/QuestionForm.model';
import { Asignature } from 'src/app/models/asignature.model';
import { ImageQuestion, MultipleQuestion, QuestionDownloadDTO } from 'src/app/models/questions.model';



@Injectable()
export class QuestionFormService {
  constructor(private formBuilder: FormBuilder) {}

  create() {
    const form = this.formBuilder.group<IQuestionForm>({
      questionInstruction: ['', [Validators.required]],
      asignature: ['', [Validators.required]],
      difficultLevelRow: [0, [Validators.required, Validators.min(0)]],
      difficultLevelColumn: [
        0,
        [Validators.required, Validators.min(0), Validators.max(5)],
      ],
      correctAnswer: ['', [Validators.required]],
      type: ['multiple', [Validators.required]],
      posibleAnswers: this.formBuilder.group({
        answerA: ['', [Validators.required]],
        answerB: ['', Validators.required],
        answerC: ['', Validators.required],
      }),
      images: this.formBuilder.group({
        imageA: ['', [isUrlImageInvaild]],
        imageB: ['', [Validators.required, isUrlImageInvaild]],
        imageC: ['', [Validators.required, isUrlImageInvaild]],
      })
    },
    {
      validators: answersRepited,
      updateOn: 'change'
    }
    );
    return form;
  } 

  createWithInitialValues(question: QuestionDownloadDTO) {
    var dataMultipleQuestion: MultipleQuestion;
    var dataImageQuestion: ImageQuestion;
    console.log('create with initial values');
    if ('images' in question) {
      dataImageQuestion = question as ImageQuestion;
      console.log('Image question: ', dataImageQuestion);  

      console.log('datos: ' , Object.values(question));
      
      return this.formBuilder.group<IQuestionForm>({
        questionInstruction: [question.questionInstruction, [Validators.required]],
        asignature: [question.asignature, [Validators.required]],
        difficultLevelRow: [question.difficultLevelRow, [Validators.required, Validators.min(0)]],
        difficultLevelColumn: [
          question.difficultLevelColumn,
          [Validators.required, Validators.min(0), Validators.max(5)],
        ],
        correctAnswer: [question.correctAnswer, [Validators.required]],
        type: [question.type, [Validators.required]],
        posibleAnswers: this.formBuilder.group({
          answerA: ['', [Validators.required]],
          answerB: ['', Validators.required],
          answerC: ['', Validators.required],
        }),
        images: this.formBuilder.group({
          imageA: [dataImageQuestion.images[0], [isUrlImageInvaild]],
          imageB: [dataImageQuestion.images[1], [Validators.required, isUrlImageInvaild]],
          imageC: [dataImageQuestion.images[2], [Validators.required, isUrlImageInvaild]],
        })
      },
      {
        validators: answersRepited,
        updateOn: 'change'
      }
      );
  

    }
    else {
      dataMultipleQuestion = question as MultipleQuestion;
      console.log('Multiple question: ' , );

      return this.formBuilder.group<IQuestionForm>({
        questionInstruction: [dataMultipleQuestion.questionInstruction, [Validators.required]],
        asignature: [dataMultipleQuestion.asignature, [Validators.required]],
        difficultLevelRow: [dataMultipleQuestion.difficultLevelRow, [Validators.required, Validators.min(0)]],
        difficultLevelColumn: [
          dataMultipleQuestion.difficultLevelColumn,
          [Validators.required, Validators.min(0), Validators.max(5)],
        ],
        correctAnswer: ['', [Validators.required]],
        type: [dataMultipleQuestion.type, [Validators.required]],
        posibleAnswers: this.formBuilder.group({
          answerA: [dataMultipleQuestion.posibleAnwers[0], [Validators.required]],
          answerB: [dataMultipleQuestion.posibleAnwers[1], Validators.required],
          answerC: [dataMultipleQuestion.posibleAnwers[2], Validators.required],
        }),
        images: this.formBuilder.group({
          imageA: ['', [isUrlImageInvaild]],
          imageB: ['', [Validators.required, isUrlImageInvaild]],
          imageC: ['', [Validators.required, isUrlImageInvaild]],
        })
      },
      {
        validators: answersRepited,
        updateOn: 'change'
      }
      );

    }
  } 


  
}

export function isUrlImageInvaild(control: AbstractControl) {
  const url = control.value;
  const pattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|webp))$/i;
  return pattern.test(url) ? null : { invalidUrl: true };
}

export function answersRepited(control: AbstractControl) {
  const type = control.get('type')?.value;
  let values: any[] = [];

  if (type === 'multiple') {
    values = ['answerA', 'answerB', 'answerC'].map(answer => control.get('posibleAnswers')?.get(answer)?.value);
  } else {
    values = ['imageA', 'imageB', 'imageC'].map(image => control.get('images')?.get(image)?.value);
  }

  const uniqueValues = new Set(values);
  if (uniqueValues.size !== values.length) {
    // Si los valores no son únicos, se retorna un error.
    return {repitAnswers: true};
  }

  // Si todos los valores son únicos, se retorna null.
  return null;
}