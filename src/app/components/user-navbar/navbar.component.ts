import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-user-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class UserNavbarComponent {
  isOpen = false;
  isOpen2 = false;
  isLogged = false;
  constructor(private router: Router, private authentication:AuthenticationService) {
    this.authentication.loggedState$.subscribe(v => this.isLogged = v);
  }

  closeSesion(){
    this.authentication.logOut();
  }
}