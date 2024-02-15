import { Component, OnInit } from '@angular/core';
import { QuestionDownloadDTO } from 'src/app/models/questions.model';
import { DataSourceQuetion } from './DataSourceQuestions.model';
import { QuestionCreatorService } from '../../services/question-creator.service';
import { ModalRequestService } from 'src/app/services/modal-request.service';
import { ModalOutputData } from 'src/app/models/modal.model';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-question-table',
  templateUrl: './question-table.component.html',
  styleUrls: ['./question-table.component.scss'],
})
export class QuestionTableComponent implements OnInit {
  cols = ['questionInstruction','type', 'row', 'col', 'options'];
  inputSearch = new FormControl('', { nonNullable: true });
  searchType:string;

  questions: DataSourceQuetion = new DataSourceQuetion();
  constructor(
    private questionCreatorService: QuestionCreatorService,
    private modalRequestService: ModalRequestService
  ) {}

  async ngOnInit() {
    const data = await this.questionCreatorService.getQuestions();
    this.questions.init(data);

    this.inputSearch.valueChanges
      .pipe(debounceTime(500))
      .subscribe((searchQuery) => this.questions.find(searchQuery));

    this.questions.searchType$.subscribe(v => this.searchType=v);
  }

  splitString(instruction: string) {
    return instruction.length >= 40
      ? instruction.substring(0, 38) + '...'
      : instruction;
  }

  async deleteQuestion(question: QuestionDownloadDTO) {
    this.modalRequestService
      .showDialog({
        message: '¿Esta seguro que desea eliminar la pregunta?',
        type: 'Acept',
      })
      .subscribe(async (v) => {
        const x = v as ModalOutputData;
        if (!x.response) return;

        const res = await this.questionCreatorService.deleteQuestion(question);

        if (res) {
          this.modalRequestService.showDialog({
            message: 'Se ha eliminado correctamente.',
            type: 'Confirm',
          });
          this.questions.deleteQuestion(question);
          //TODO: Send to update datasource
        } else
          this.modalRequestService.showDialog({
            message: 'Ha ocurrido un error.',
            type: 'Confirm',
          });
      });
  }
}
