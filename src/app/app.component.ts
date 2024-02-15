import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
@Component({
  selector: 'app-root',
  template: `
    <div class="w-screen h-screen">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AppComponent {
  constructor(private authentication: AuthenticationService) {}
}
