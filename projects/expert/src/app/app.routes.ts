import { Routes } from '@angular/router';
import { AuthenticationComponent } from "./components/authentication/authentication.component";
import { ExpertComponent } from "./components/expert/expert.component";
import { WelcomeComponent } from "./components/welcome/welcome.component";
import { ConsultComponent } from "./components/consult/consult.component";

export const routes: Routes = [ {
  path: 'auth',
  component: AuthenticationComponent,
  title: 'Acceso de usuario'
}, {
  path: 'expert',
  component: ExpertComponent,
  children: [ {
    path: '',
    component: WelcomeComponent,
    title: 'Bienvenido a Themis'
  }, {
    path: 'consult',
    component: ConsultComponent,
    title: 'Consulta legal'
  } ]
}, {
  path: '**',
  redirectTo: 'expert',
  pathMatch: 'full'
} ];
