import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExamRoutingModule } from './exam-routing.module';
import { ExamComponent } from './components/exam/exam.component';
import { DialogModule } from '@angular/cdk/dialog';
import { ModalRequestService } from '../services/modal-request.service';


@NgModule({
  declarations: [
    ExamComponent
  ],
  imports: [
    CommonModule,
    ExamRoutingModule,
    DialogModule,
    
  ],
  providers: [ModalRequestService]
})
export class ExamModule { }
