import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionCreatorService } from '../../services/question-creator.service';
import {
  ImageQuestion,
  MultipleQuestion,
  QuestionDownloadDTO,
} from 'src/app/models/questions.model';
import { ModalRequestService } from 'src/app/services/modal-request.service';

@Component({
  selector: 'app-question-viewer',
  templateUrl: './question-viewer.component.html',
  styleUrls: ['./question-viewer.component.scss'],
})
export class QuestionViewerComponent implements OnInit {
  id = '';

  question: QuestionDownloadDTO | null = null;
  multiQuestion: MultipleQuestion | null = null;
  imageQuestion: ImageQuestion | null = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private modalRequestService: ModalRequestService,
    private questionCreatorService: QuestionCreatorService
  ) {
    activatedRoute.paramMap.subscribe((v) => {
      const id = v.get('id');
      console.log(id);
      if (id !== null) {
        this.id = id;
      }
    });
  }

  async ngOnInit() {
    this.question = await this.questionCreatorService.getQuestionById(this.id);
    if (this.question === null) this.errorId();
    else {
      if ('posibleAnwers' in this.question) {
        console.log('is multiple');
        this.multiQuestion = this.question;
        console.log('multiple question => ',this.multiQuestion);
      } else if ('images' in this.question) {
        console.log('Its image');
        this.imageQuestion = this.question;
        console.log('imageQuestion => ',this.imageQuestion);
      }
    }
  }

  errorId() {
    this.question?.asignature;
    this.modalRequestService.showDialog({
      message: 'No se obtuvieron resultados con los datos proporcionados.',
      type: 'Error',
    });
  }
}
