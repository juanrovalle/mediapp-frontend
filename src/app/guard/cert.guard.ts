import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { LoginService } from '../services/login.service';
import { MenuService } from '../services/menu.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment.development';
import { map } from 'rxjs';
import { Menu } from '../model/menu';

export const certGuard = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const loginService = inject(LoginService);
  const menuService = inject(MenuService);
  const router = inject(Router);
  const token = sessionStorage.getItem(environment.TOKEN_NAME);

  //- Check if the user is logged

  if (!loginService.isLogged()) {
    loginService.logout();
    return false;
  }

  // - Check JWT TOKEN IS VALID

  if (!token || new JwtHelperService().isTokenExpired(token)) {
    loginService.logout();
    return false;
  }

  // - Check if you have permission to this route

  //3) VERIFICAR SI TIENES EL ROL NECESARIO PARA ACCEDER A ESTE RECURSO
  //url -> /pages/patient
  const helper = new JwtHelperService();

  if (!helper.isTokenExpired(token)) {
    //3) VERIFICAR SI TIENES EL ROL NECESARIO PARA ACCEDER A ESTE RECURSO
    //url -> /pages/patient
    const url = state.url;
    const username = helper.decodeToken(token).sub;

    return menuService.getMenusByUser(username).pipe(
      map((data: Menu[]) => {
        menuService.setMenuChange(data);

        let count = 0;
        for (let m of data) {
          if (url.startsWith(m.url)) {
            count++;
            break;
          }
        }

        if (count > 0) {
          return true;
        } else {
          router.navigate(['/pages/not-403']);
          return false;
        }
      })
    );
  } else {
    loginService.logout();
    return false;
  }
};
