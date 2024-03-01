import { Routes } from '@angular/router';
import { AuthenticationComponent } from "./components/authentication/authentication.component";
import { ExpertComponent } from "./components/expert/expert.component";

export const routes: Routes = [ {
  path: 'auth',
  component: AuthenticationComponent,
  title: 'Acceso de usuario'
}, {
  path: 'expert',
  component: ExpertComponent,
  title: 'Bienvenido a Themis'
} ];
