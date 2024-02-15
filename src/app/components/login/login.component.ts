import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  isFormInvalid = true;
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private authentication: AuthenticationService,
    private router: Router
  ) {
    this.form.valueChanges.subscribe((v) => {
      if (this.emailInvalid || this.passwordInvalid) {
        this.isFormInvalid = true;
      } else this.isFormInvalid = false;
    });
  }

  // Geters:
  public get emailInvalid() {
    const field = this.form.get('email');
    return field?.invalid && field.touched;
  }
  public get passwordInvalid() {
    const field = this.form.get('password');
    return field?.invalid && field.touched;
  }

  async trySingIn() {
    const email = this.form.get('email');
    const password = this.form.get('password');

    if (email?.value && password?.value) {
      const loggedCorrect = await this.authentication.login(
        email.value,
        password.value
      );
      if (loggedCorrect) this.router.navigateByUrl('/home');
      else console.log('desastroso');
    }
  }
}
