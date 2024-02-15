import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  navLinks: NavLinks[] = [
    { name: 'Inicio', route: '/home' },
    { name: 'Crear pregunta', route: '/exam-creator/question' },
    { name: 'Asignaturas', route: '/exam-creator/asignature' },
    // { name: 'Login', route: '/login' },
    { name: 'Tabla de preguntas', route: '/exam-creator/question-table' },
  ];

  isLogged = false;
  constructor(
    private authentication: AuthenticationService,
    private router: Router
  ) {
    authentication.loggedState$.subscribe((v) => {
      this.isLogged = v;
    });
  }

  closeSesion() {}

  login() {
    this.router.navigate(['/login']);
  }

  singOut() {
    this.authentication.logOut();
  }
}

type NavLinks = {
  route: string;
  name: string;
};