import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { TestComponent } from './components/test/test.component';
import { loggedGuard } from './Guards/logged.guard';

const routes: Routes = [
  {path: '',pathMatch: 'full', redirectTo: 'home' },
  {path: 'test', component:TestComponent},
  {path: 'home', component:HomeComponent},
  {path: 'login', component:LoginComponent},
  {path: 'exam', loadChildren: () => import('./exam/exam.module').then(m => m.ExamModule),
  canActivate: [loggedGuard]
  },
  {path: 'exam-creator', loadChildren: () => import('./exam-creator/exam-creator.module').then(m => m.ExamCreatorModule),
    canActivate: [loggedGuard]
  },
  {path: '**', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }