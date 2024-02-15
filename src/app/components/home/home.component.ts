import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  isUserLogged = false;
  constructor(private authentication: AuthenticationService) {
    this.authentication.loggedState$.subscribe((v) => (this.isUserLogged = v));
  }
}
