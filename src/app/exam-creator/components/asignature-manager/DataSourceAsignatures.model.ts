import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';
import { Asignature } from 'src/app/models/asignature.model';

export class DataSourceAsignatures extends DataSource<Asignature> {
  data = new BehaviorSubject<Asignature[]>([]);
  private dataBackup: Asignature[] = [];
  lenght = 0;
  connect(collectionViewer: CollectionViewer): Observable<readonly Asignature[]> {
    return this.data;
  }
  disconnect() {}

  init(asignature: Asignature[]){
    this.data.next(asignature);
    this.lenght = asignature.length;
    this.dataBackup = asignature;
  }

  deleteAsignature(asignature: Asignature){
    const index = this.dataBackup.findIndex(q => asignature.id === q.id);
    if (index > -1) {
      this.dataBackup.splice(index,1);
      this.data.next(this.dataBackup);
    }
    else console.log('No se pudo compa');
  }

  addAsignature(asignature: Asignature){
    this.dataBackup.push(asignature);
    this.data.next(this.dataBackup);
  }

}