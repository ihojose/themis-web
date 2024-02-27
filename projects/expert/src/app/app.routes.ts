import { Routes } from '@angular/router';
import { AuthenticationComponent } from "./components/authentication/authentication.component";

export const routes: Routes = [ {
  path: 'auth',
  component: AuthenticationComponent,
  title: 'Acceso de usuario'
} ];
