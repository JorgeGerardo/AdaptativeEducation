import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, throttleTime } from 'rxjs';
import {
  ImageQuestion,
  MultipleQuestion,
  Question,
  QuestionDownloadDTO,
} from 'src/app/models/questions.model';
import { DynamicQuestionService } from 'src/app/services/dynamic-question.service';
import { ModalRequestService } from 'src/app/services/modal-request.service';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss'],
})
export class ExamComponent implements OnInit, AfterViewInit{
  @ViewChild('nextQuestionBtn') nextQuestionBtn: ElementRef<HTMLButtonElement>;
  constructor(
    private dynamicQuestion: DynamicQuestionService,
    private router: Router,
  ) {}

  ngAfterViewInit() {
    fromEvent(this.nextQuestionBtn.nativeElement, 'click').pipe(throttleTime(2500)).subscribe(() => {this.nextQuestion()})
  }

  async ngOnInit() {
    this.updateQuestionsState();
  }

  async updateQuestionsState(){
    this.abstractQuestion = undefined;
    this.abstractQuestion = await this.getNextQuestion();

    if (this.abstractQuestion.type === 'multiple') {
      this.currentMultipleQuestion = this.abstractQuestion as MultipleQuestion;
      console.log('Multiple questionIs: ', this.currentMultipleQuestion);
    }
    else{
      this.currentImageQuestion = this.abstractQuestion as ImageQuestion;
      console.log('Image question is... ', this.currentImageQuestion);
    }
    this.cursor.type = this.abstractQuestion.type;
  }

  async test() {
    console.log('cursor (c,r): ', this.cursor.columnLevel,'-',this.cursor.rowLevel);
  }

  optionSelected = '';

  public getInciso(index: number) {
    return ['A', 'B', 'C', 'D'][index];
  }

  abstractQuestion: Question|undefined = undefined;

  currentImageQuestion: ImageQuestion|undefined = undefined;
  //  = {
  //   asignature: 'English',
  //   correctAnswer:
  //     'https://i.pinimg.com/564x/90/1b/65/901b65cdd46aeaf5b9aa3f824a64365c.jpg',
  //   difficultLevelColumn: 0,
  //   difficultLevelRow: 0,
  //   id: 'id',
  //   type: 'image',
  //   questionInstruction: 'Seleccione la foto qué es un tractor',
  //   images: [
  //     'https://phantom-marca.unidadeditorial.es/1440c439e09c8f96e6ee133c95878233/resize/828/f/jpg/assets/multimedia/imagenes/2023/06/23/16875339705009.jpg',
  //     'https://cdn.topgear.es/sites/navi.axelspringer.es/public/media/image/2020/08/galeria-prueba-bugatti-divo-2049299.jpg',
  //     'https://i.pinimg.com/564x/90/1b/65/901b65cdd46aeaf5b9aa3f824a64365c.jpg',
  //   ],
  // };

  currentMultipleQuestion: MultipleQuestion = {
    asignature: 'English',
    correctAnswer: 'El año fue en 1945.',
    difficultLevelColumn: 0,
    difficultLevelRow: 0,
    id: 'id',
    posibleAnwers: [
      'El año fue en 1945.',
      'El año fue en 1935. Pero se dice qué los españoles eran unos desgraciados. El año fue en 1935. Pero se dice qué los españoles eran unos desgraciados. El año fue en 1935. Pero se dice qué los españoles eran unos desgraciados. El año fue en 1935. Pero se dice qué los españoles eran unos desgraciados. El año fue en 1935. Pero se dice qué los españoles eran unos desgraciados. El año fue en 1935. Pero se dice qué los españoles eran unos desgraciados. El año fue en 1935. Pero se dice qué los españoles eran unos desgraciados.El año fue en 1935. Pero se dice qué los españoles eran unos desgraciados.El año fue en 1935. Pero se dice qué los españoles eran unos desgraciados.El año fue en 1935. Pero se dice qué los españoles eran unos desgraciados.2',
      'El año fue en 1935. Pero se dice qué los españoles eran unos desgraciados. El año fue en 1935. Pero se dice qué los españoles eran unos desgraciados. El año fue en 1935. Pero se dice qué los españoles eran unos desgraciados. El año fue en 1935. Pero se dice qué los españoles eran unos desgraciados. El año fue en 1935. Pero se dice qué los españoles eran unos desgraciados. El año fue en 1935. Pero se dice qué los españoles eran unos desgraciados. El año fue en 1935. Pero se dice qué los españoles eran unos desgraciados.El año fue en 1935. Pero se dice qué los españoles eran unos desgraciados.El año fue en 1935. Pero se dice qué los españoles eran unos desgraciados.El año fue en 1935. Pero se dice qué los españoles eran unos desgraciados.3',
    ],
    type: 'multiple',
    questionInstruction:
      'Considerando los avances recientes en la tecnología de inteligencia artificial y su creciente integración en diversos aspectos de nuestra vida cotidiana, ¿cuál crees que será el impacto a largo plazo de la IA en la sociedad, especialmente en términos de empleo, privacidad y seguridad, y cómo crees que deberíamos prepararnos como sociedad para estos cambios?',
  };

  cursor = {
    //Current
    rowLevel: 0,
    columnLevel: 0,
    currentQuestionNumber: 1,

    // Extra options
    optionSelected: false,
    type: 'image',
    //Limits
    rowUpLimit: 5,
    rowDownLimit: 0,
    columnLimit: 5,
  };

  nextQuestion(){
    console.log('next question');
    const previousQuestionIsCorrect = this.verifyAnswer();

    this.setCursorToNextQuestion(previousQuestionIsCorrect);
    this.updateQuestionsState();
  }
  
  verifyAnswer() {
    console.log('verifyring');
    if (this.currentMultipleQuestion.correctAnswer === this.optionSelected) return true;

    if (this.currentImageQuestion?.correctAnswer === this.optionSelected)
      return true;

      console.log('IS incorrect');
    return false;
  }

  showReloadButton: boolean[] = [];

  reloadImage(imageUrl: string, index: number) {
    if (index !== -1 && this.currentImageQuestion !== undefined) {
      this.currentImageQuestion.images[index] =
        imageUrl + '?timestamp=' + Date.now();
      this.showReloadButton[index] = false;
    }
  }

  
  increment(increment:boolean){
    if (increment) {
      if (this.cursor.rowUpLimit >= this.cursor.rowLevel+1)
        this.cursor.rowLevel = this.cursor.rowLevel+1;
      
      // console.log('Incrementoo: ',this.cursor.rowLevel);
    }
    else{
      if (this.cursor.rowDownLimit <= this.cursor.rowLevel-1)
        this.cursor.rowLevel = this.cursor.rowLevel-1;
      // console.log('Decremento: ',this.cursor.rowLevel);
    }

    if (this.cursor.columnLimit != this.cursor.columnLevel) {
      this.cursor.columnLevel = this.cursor.columnLevel+1;
      // console.log('column: ', this.cursor.columnLevel);
    }
    else{
      //TODO: Finished
      
      alert('Usted ha terminado la prueba.')
      this.router.navigateByUrl('/home');
      console.log('finished');
    }
  }
  
  async getNextQuestion(){
    const res = await this.dynamicQuestion.getQuestionsByDifficulty(
      this.cursor.columnLevel,
      this.cursor.rowLevel
    );
    console.log('res: ', res);
    return res[0];
  }
  

  setCursorToNextQuestion(isQuestionCorrect: boolean) {
    this.optionSelected = '';

    this.increment(isQuestionCorrect);

    console.log('column level: ', this.cursor.columnLevel);
    console.log('row level: ', this.cursor.rowLevel);
  }
}
