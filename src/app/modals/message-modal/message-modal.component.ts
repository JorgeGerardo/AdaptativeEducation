import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ModalInputData, ModalOutputData, ModalType } from 'src/app/models/modal.model';

@Component({
  selector: 'app-message-modal',
  templateUrl: './message-modal.component.html',
  styleUrls: ['./message-modal.component.scss'],
})
export class MessageModalComponent {
  message: string;
  type:ModalType = 'Acept';
  private returnValue:ModalOutputData = {};

  constructor(
    private router:Router,
    private dialogRef: DialogRef<ModalOutputData>,
    @Inject(DIALOG_DATA) private inputData: ModalInputData
  ) {
    if (inputData) {
      this.message = inputData.message;
      this.type = inputData.type;
    }
    else console.log('its null');
  }


  closeMe(){
    this.returnValue.response = false;
    this.dialogRef.close(this.returnValue);
  }

  acept(){
    this.returnValue.response = true;
    this.dialogRef.close(this.returnValue);
  }

  cancel(){
    this.closeMe();
  }

  goHome(){
    this.router.navigateByUrl('/');
    this.closeMe();
  }
}