import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalRequestService } from 'src/app/services/modal-request.service';
import { QuestionCreatorService } from '../../services/question-creator.service';
import {
  ImageQuestion,
  ImageQuestionUploadDTO,
  MultipleQuestion,
  MultipleQuestionUploadDTO,
  QuestionDownloadDTO,
  QuestionUploadDTO,
} from 'src/app/models/questions.model';
import { AsignatureService } from '../../services/asignature.service';
import { Asignature } from 'src/app/models/asignature.model';
import { QuestionFormService, isUrlImageInvaild } from '../../services/question-form.service';
import { FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { EQuestionFields } from 'src/app/models/QuestionForm.model';
import { fromEvent, throttleTime } from 'rxjs';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.scss'],
})
export class EditQuestionComponent implements OnInit, AfterViewInit{
  @ViewChild('btnUpdate') btnUpdate: ElementRef<HTMLButtonElement>;
  questionForm: FormGroup = this.questionFormService.create();
  asignatures: Asignature[] = [];
  selectedOption: string = '';
  defaultType = 'multiple';
  formValid = false;
  isMultipleQuestion = true;
  QuestionFields = EQuestionFields;
  currentId = '';
  question: QuestionDownloadDTO;
  multiQuestion: MultipleQuestion;
  imageQuestion: ImageQuestion;
  answerRepited:boolean | undefined = false;


  constructor(
    private modalRequestService: ModalRequestService,
    private asignatureService:AsignatureService,
    private questionCreatorService: QuestionCreatorService,
    private questionFormService: QuestionFormService,
    private activatedRoute: ActivatedRoute,
  ) {
    activatedRoute.paramMap.subscribe(async (v) => {
      const id = v.get('id');
      if (id !== null) this.currentId = id;
      else this.errorId();

      if (id!==null) {
        const pregunta = await this.questionCreatorService.getQuestionById(id)
        console.log('la pregunta es: ...', pregunta);
        if (pregunta !== null) {
          this.question = pregunta;
          const asig:Asignature = {name: this.question.asignature, id: ''}
          // this.questionForm.get('asignature')?.setValue(asig);
        }
      }

    });

  }

  test(){
    console.log('values si:', this.isAnswerTouched);
  }

  isFieldInvalid(fieldName: EQuestionFields) {
    const field = this.questionForm.get(fieldName);
    return field?.invalid && field?.touched;
  }

  isFormGroupFieldInvalid(groupName: string, fieldName: string) {
    const field = this.questionForm.get(groupName)?.get(fieldName);
    return field?.invalid && field?.touched;
  }


  ngAfterViewInit(): void {
    fromEvent(this.btnUpdate.nativeElement, 'click')
      .pipe(throttleTime(2500))
      .subscribe(() => {
        this.update();
      });

  }

  async update(){
    const q = this.extractQuestion();
    if (q.type === 'image') {
      var x: ImageQuestion = q as ImageQuestion;
      console.log('image: ',x);
      // x.id = this.currentId;
      const res = await this.questionCreatorService.updateQuestion(x, this.currentId);
      console.log('image res: ' ,res);
    }
    else{
      const y:MultipleQuestion = q as MultipleQuestion;
      console.log('Multiple: ', y);
      // y.id = this.currentId;
      const res = await this.questionCreatorService.updateQuestion(y, this.currentId);
      console.log('multi res: ', res);
    }

  }



  async ngOnInit() {
    const res = await this.questionCreatorService.getQuestionById(this.currentId);
    if (res === null) {
      return;
    }

    this.question = res;
    if (this.question.type === 'multiple') {
      this.isMultipleQuestion = true
    } else this.isMultipleQuestion = false;

    if (this.question === null) this.errorId();
    else {
      if ('posibleAnwers' in this.question) {
        this.multiQuestion = this.question;
        console.log(this.multiQuestion);
      } else if ('images' in this.question) {
        this.imageQuestion = this.question;
        console.log(this.imageQuestion);
      }
    }

    this.questionForm = this.questionFormService.createWithInitialValues(this.question);

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


    this.asignatures = await this.asignatureService.getDocAsignatures();
    this.questionForm.get('asignature')?.setValue(this.question.asignature);
  }


  public get isAnswerTouched() {
    const res = this.questionForm.hasError('repitAnswers');
    return res;
  }

  

  errorId() {
    this.modalRequestService.showDialog({
      message: 'No se obtuvieron resultados con los datos proporcionados.',
      type: 'Error',
    });
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

}