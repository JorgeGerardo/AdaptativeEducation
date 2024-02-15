import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { QuestionCreatorService } from '../../services/question-creator.service';
import {
  ImageQuestionUploadDTO,
  MultipleQuestionUploadDTO,
  QuestionUploadDTO,
} from 'src/app/models/questions.model';
import { AsignatureService } from '../../services/asignature.service';
import { Asignature } from 'src/app/models/asignature.model';
import { QuestionFormService } from '../../services/question-form.service';
import { EQuestionFields } from 'src/app/models/QuestionForm.model';
import { ModalRequestService } from 'src/app/services/modal-request.service';
import { fromEvent, throttleTime } from 'rxjs';
import { isUrlImageInvaild } from '../../services/question-form.service';
import { FieldPath } from '@angular/fire/firestore';


@Component({
  selector: 'app-question-creator',
  templateUrl: './question-creator.component.html',
  styleUrls: ['./question-creator.component.scss'],
})
export class QuestionCreatorComponent implements OnInit, AfterViewInit {
  @ViewChild('addQuestion') btnAddQuestion: ElementRef<HTMLButtonElement>;
  questionForm: FormGroup;
  asignatures: Asignature[] = [];
  selectedOption: string = '';
  defaultType = 'multiple';
  formValid = false;
  isMultipleQuestion = true;
  QuestionFields = EQuestionFields;
  answerRepited:boolean | undefined = false;

  constructor(
    private modalRequestService: ModalRequestService,
    private asignatureService: AsignatureService,
    private questionCreatorService: QuestionCreatorService,
    private questionFormService: QuestionFormService,
  ) {
    this.questionForm = this.questionFormService.create();

    this.questionForm.get('type')?.valueChanges.subscribe((type) => {
      this.onTypeChange(type);
      if (type === 'multiple') this.isMultipleQuestion = true;
      else this.isMultipleQuestion = false;
    });
    this.onTypeChange(this.defaultType);

    this.questionForm.valueChanges.subscribe((v) => {
      if (this.questionForm.valid) this.formValid = true;
      else this.formValid = false;
      this.answerRepited = this.isAnswerTouched;
    });
  }

  isFieldInvalid(fieldName: EQuestionFields) {
    const field = this.questionForm.get(fieldName);
    return field?.invalid && field?.touched;
  }

  isFormGroupFieldInvalid(groupName: string, fieldName: string) {
    const field = this.questionForm.get(groupName)?.get(fieldName);
    return field?.invalid && field?.touched;
  }

  ngAfterViewInit() {
    fromEvent(this.btnAddQuestion.nativeElement, 'click')
      .pipe(throttleTime(2500))
      .subscribe(() => {
        this.agregar();
      });
  }

  async agregar() {
    const question = this.extractQuestion();
    const res = await this.questionCreatorService.addQuestion(question);
    if (res)
      this.modalRequestService.showDialog({
        message: 'Agregado correctamente.',
        type: 'Confirm',
      });
    else
      this.modalRequestService.showDialog({
        message: 'Ha ocurrido un error.',
        type: 'Confirm',
      });
  }

  test() {
    const res = this.questionForm.hasError('repitAnswers');
    console.log('res: ', res);
  }

  
  public get isAnswerTouched() {
    const res = this.questionForm.hasError('repitAnswers');
    var answerA:boolean|undefined = false;
    var answerB:boolean|undefined = false;
    var answerC:boolean|undefined = false;

    if (this.defaultType === 'multiple') {
      answerA = this.questionForm.get('posibleAnswers')?.get('answerA')?.touched;
      answerB = this.questionForm.get('posibleAnswers')?.get('answerB')?.touched;
      answerC = this.questionForm.get('posibleAnswers')?.get('answerC')?.touched;
    }
    else{
      answerA = this.questionForm.get('images')?.get('imageA')?.touched;
      answerB = this.questionForm.get('images')?.get('imageB')?.touched;
      answerC = this.questionForm.get('images')?.get('imageC')?.touched;
    }
  
    // Contar cuántos campos han sido tocados
    const touchedCount = [answerA, answerB, answerC].filter(Boolean).length;
    // return res && answerA && answerB && answerC;
    return res && touchedCount >= 2;
  }
  

  getCorrectAnswer() {
    const optionSelected = this.questionForm.get('correctAnswer')?.value;
    if (this.defaultType === 'multiple') {
      const posibleAnswers = this.questionForm.get('posibleAnswers');
      return posibleAnswers?.get(`answer${optionSelected}`)?.value;
    } else {
      const images = this.questionForm.get('images');
      return images?.get(`image${optionSelected}`)?.value;
    }
  }

  extractQuestion() {
    const formValue = this.questionForm.value;
    
    let question: QuestionUploadDTO;

    const newAbstractQuestion = {
      questionInstruction: formValue.questionInstruction,
      asignature: formValue.asignature,
      difficultLevelRow: formValue.difficultLevelRow,
      difficultLevelColumn: formValue.difficultLevelColumn,
      type: formValue.type,
      correctAnswer: this.getCorrectAnswer() as string,
    };

    if (formValue.type === 'multiple')
      return {
        ...newAbstractQuestion,
        posibleAnwers: Object.values(formValue.posibleAnswers),
      } as MultipleQuestionUploadDTO;
    else
      return {
        ...newAbstractQuestion,
        type: formValue.type,
        images: Object.values(formValue.images),
      } as ImageQuestionUploadDTO;
  }

  clean() {
    this.questionForm.reset();
    this.selectedOption = '';

    this.questionForm.get('type')?.setValue('multiple');
  }

  async ngOnInit() {
    this.asignatures = await this.asignatureService.getDocAsignatures();
  }

  onTypeChange(type: string) {
    const urlImageValidators = Validators.compose([
      Validators.required,
      isUrlImageInvaild,
    ]);

    if (type === 'multiple') {
      this.defaultType = 'multiple';
      this.questionForm.get('images')?.get('imageA')?.clearValidators();
      this.questionForm.get('images')?.get('imageB')?.clearValidators();
      this.questionForm.get('images')?.get('imageC')?.clearValidators();

      this.questionForm
        .get('posibleAnswers')
        ?.get('answerA')
        ?.setValidators([Validators.required]);
      this.questionForm
        .get('posibleAnswers')
        ?.get('answerB')
        ?.setValidators([Validators.required]);
      this.questionForm
        .get('posibleAnswers')
        ?.get('answerC')
        ?.setValidators([Validators.required]);
    } else if (type === 'image') {
      this.defaultType = 'image';
      this.questionForm
        .get('posibleAnswers')
        ?.get('answerA')
        ?.clearValidators();
      this.questionForm
        .get('posibleAnswers')
        ?.get('answerB')
        ?.clearValidators();
      this.questionForm
        .get('posibleAnswers')
        ?.get('answerC')
        ?.clearValidators();

      this.questionForm
        .get('images')
        ?.get('imageA')
        ?.setValidators(urlImageValidators);
      this.questionForm
        .get('images')
        ?.get('imageB')
        ?.setValidators(urlImageValidators);
      this.questionForm
        .get('images')
        ?.get('imageC')
        ?.setValidators(urlImageValidators);
    }

    this.questionForm.get('images')?.get('imageA')?.updateValueAndValidity();
    this.questionForm.get('images')?.get('imageB')?.updateValueAndValidity();
    this.questionForm.get('images')?.get('imageC')?.updateValueAndValidity();

    this.questionForm
      .get('posibleAnswers')
      ?.get('answerA')
      ?.updateValueAndValidity();
    this.questionForm
      .get('posibleAnswers')
      ?.get('answerB')
      ?.updateValueAndValidity();
    this.questionForm
      .get('posibleAnswers')
      ?.get('answerC')
      ?.updateValueAndValidity();
  }
}
