import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestionCreatorComponent } from './components/question-creator/question-creator.component';
import { AsignatureManagerComponent } from './components/asignature-manager/asignature-manager.component';
import { PrincipalComponentComponent } from './components/principal-component/principal-component.component';
import { EditQuestionComponent } from './components/edit-question/edit-question.component';
import { QuestionTableComponent } from './components/question-table/question-table.component';
import { QuestionViewerComponent } from './components/question-viewer/question-viewer.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'question-table'},
  {
    path: '',
    component: PrincipalComponentComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'question-table' },
      { path: 'question', component: QuestionCreatorComponent },
      { path: 'asignature', component: AsignatureManagerComponent },
      { path: 'edit/:id', component: EditQuestionComponent },
      { path: 'question-table', component: QuestionTableComponent },
      { path: 'question-view/:id', component: QuestionViewerComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExamCreatorRoutingModule {}
