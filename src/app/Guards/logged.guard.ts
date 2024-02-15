import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { ModalRequestService } from '../services/modal-request.service';

export const loggedGuard: CanActivateFn = (route, segments) => {
  const state = inject(AuthenticationService);
  const router = inject(Router);
  const modal = inject(ModalRequestService);

  return state.isUserLogged$().pipe(
    map(v => {
      if (!v) {
        router.navigateByUrl('/login');
        modal.showDialog({message: "Necesita iniciar sesión", type: 'Confirm'})
      }
      return v;
    })
  );
}