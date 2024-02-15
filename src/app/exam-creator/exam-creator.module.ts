import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExamCreatorRoutingModule } from './exam-creator-routing.module';
import { QuestionCreatorComponent } from './components/question-creator/question-creator.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AsignatureManagerComponent } from './components/asignature-manager/asignature-manager.component';
import { QuestionCreatorService } from './services/question-creator.service';
import { AsignatureService } from './services/asignature.service';
import { NavbarComponent } from './components/tools-navbar/navbar.component';
import { PrincipalComponentComponent } from './components/principal-component/principal-component.component';
import {CdkTableModule} from '@angular/cdk/table'
import { QuestionFormService } from './services/question-form.service';
import {DialogModule } from '@angular/cdk/dialog'
import { ModalRequestService } from '../services/modal-request.service';
import { EditQuestionComponent } from './components/edit-question/edit-question.component';
import { QuestionTableComponent } from './components/question-table/question-table.component';
import { QuestionViewerComponent } from './components/question-viewer/question-viewer.component';
import { MessageModalComponent } from '../modals/message-modal/message-modal.component';

@NgModule({
  declarations: [
    QuestionCreatorComponent,
    AsignatureManagerComponent,
    NavbarComponent,
    PrincipalComponentComponent,
    EditQuestionComponent,
    QuestionTableComponent,
    QuestionViewerComponent
  ],
  imports: [
    CommonModule,
    ExamCreatorRoutingModule,
    ReactiveFormsModule,
    CdkTableModule,
    DialogModule,
  ],
  providers: [QuestionCreatorService, AsignatureService, QuestionFormService, ModalRequestService]
})
export class ExamCreatorModule { }
