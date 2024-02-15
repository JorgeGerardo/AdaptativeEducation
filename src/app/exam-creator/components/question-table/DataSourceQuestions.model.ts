import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { QuestionDownloadDTO } from 'src/app/models/questions.model';

export class DataSourceQuetion extends DataSource<QuestionDownloadDTO> {
  data = new BehaviorSubject<QuestionDownloadDTO[]>([]);
  searchType$ = new BehaviorSubject<string>('General');

  private dataBackup: QuestionDownloadDTO[] = [];
  lenght = 0;
  connect(collectionViewer: CollectionViewer): Observable<readonly QuestionDownloadDTO[]> {
    return this.data;
  }
  disconnect() {}

  init(questions: QuestionDownloadDTO[]){
    this.data.next(questions);
    this.lenght = questions.length;
    this.dataBackup = questions;
  }

  deleteQuestion(question: QuestionDownloadDTO){
    const index = this.dataBackup.findIndex(q => question.id === q.id);
    if (index > -1) {
      this.dataBackup.splice(index,1);
      this.data.next(this.dataBackup);
    }
    else console.log('No se pudo compa');
  }

  find(searchQuery:string){
    searchQuery = searchQuery.toLocaleLowerCase();
    const matrixPosition = /^(\d{1,2})[-,](\d{1,2})$/;

    if (searchQuery == 'multiple' || searchQuery== 'image') {
      this.findByType(searchQuery);
    } else if (matrixPosition.test(searchQuery)) {
      const result = searchQuery.split(/[-,]/)
      if (result.length === 2) {
        const row = parseInt(result[0].trim(), 10);
        const col = parseInt(result[1].trim(), 10);
        this.findByRowCol(row, col);
      } 
    }
    else{
      this.generalSearch(searchQuery);
    }
  }

  private generalSearch(searchQuery:string){
    const search = this.dataBackup.filter(v => v.questionInstruction.toLowerCase().includes(searchQuery.toLowerCase()))
    this.data.next(search);  
    this.searchType$.next('General');
  }

  private findByRowCol(row:number, col:number){
    const search = this.dataBackup.filter(v => v.difficultLevelRow == row && v.difficultLevelColumn == col)
    this.data.next(search);  
    this.searchType$.next('Por posición matricial');  
  }

  private findByType(type: string){
    const search = this.dataBackup.filter(v => v.type == type);
    this.data.next(search);
    this.searchType$.next('Por tipo (fila, columna)');
  }



}