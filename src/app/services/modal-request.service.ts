import { Injectable } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { MessageModalComponent } from '../modals/message-modal/message-modal.component';
import { ModalInputData } from '../models/modal.model';

@Injectable({
  providedIn: 'root'
})
export class ModalRequestService {

  constructor(private dialog: Dialog) { }

  showDialog(modalInputData: ModalInputData, disableClose: boolean = true){
    const modal = this.dialog.open(MessageModalComponent, {
      disableClose: disableClose,
      data: modalInputData
    });
    return  modal.closed;
  }

  
}