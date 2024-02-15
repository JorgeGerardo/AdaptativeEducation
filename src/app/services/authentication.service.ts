import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { getAuth, onAuthStateChanged } from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private loggedState = new BehaviorSubject<boolean>(false);
  public loggedState$ = this.loggedState.asObservable();
  static logState = false;

  constructor(private auth: Auth) {
    this.setAuthStateChangedCallback();
    this.checkLoginState();
  }

  private setAuthStateChangedCallback() {
    this.auth.beforeAuthStateChanged(async (user) => {
      if (user) {
        this.loggedState.next(true);
      } else this.loggedState.next(false);
    });

    this.loggedState$.subscribe((v) => (AuthenticationService.logState = v));

    
    
  }

  async checkLoginState() {
    if (await this.isUserLogged()) {
      console.log('Log successfully');
      this.loggedState.next(true);
    } else {
      console.log('Not log');
      this.loggedState.next(false);
    }
  }

  async isUserLogged(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) resolve(true);
        else resolve(false);
      });
    });
  }

  isUserLogged$(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) observer.next(true);
        else observer.next(false);
        observer.complete();
      });
    });
  }

  async login(email: string, password: string) {
    var loggedCorrect = false;
    await signInWithEmailAndPassword(this.auth, email, password).then(
      async (solve) => {
        loggedCorrect = true;
        this.loggedState.next(true);
      },
      async (rejected) => {
        loggedCorrect = false;
        this.loggedState.next(false);
      }
    );
    return loggedCorrect;
  }

  async logOut() {
    signOut(this.auth).then((solve) => {
      this.loggedState.next(false);
    });
  }
}
