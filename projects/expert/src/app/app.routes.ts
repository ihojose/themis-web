import { Routes } from '@angular/router';
import { AuthenticationComponent } from "./components/authentication/authentication.component";
import { ExpertComponent } from "./components/expert/expert.component";
import { WelcomeComponent } from "./components/welcome/welcome.component";
import { ConsultComponent } from "./components/consult/consult.component";
import { AdminComponent } from "./components/admin/admin.component";
import { AdminRolesComponent } from "./components/admin-roles/admin-roles.component";
import { AdminAccountsComponent } from "./components/admin-accounts/admin-accounts.component";
import { AdminLawsComponent } from "./components/admin-laws/admin-laws.component";
import { AdminArticlesComponent } from "./components/admin-articles/admin-articles.component";
import { AdminDecisitionTreeComponent } from "./components/admin-decisition-tree/admin-decisition-tree.component";
import { AdminVerdictsComponent } from "./components/admin-verdicts/admin-verdicts.component";

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
  }, {
    path: 'admin',
    component: AdminComponent,
    title: 'Administración',
    children: [ {
      path: 'roles',
      component: AdminRolesComponent,
      title: 'Roles'
    }, {
      path: 'accounts',
      component: AdminAccountsComponent,
      title: 'Administración de cuentas'
    }, {
      path: 'law',
      component: AdminLawsComponent,
      title: 'Administración de Leyes'
    }, {
      path: 'law/article',
      component: AdminArticlesComponent,
      title: 'Administración de artículos de las leyes'
    }, {
      path: 'tree',
      component: AdminDecisitionTreeComponent,
      title: 'Árbol de decisión'
    }, {
      path: 'verdict',
      component: AdminVerdictsComponent,
      title: 'Veredictos'
    } ]
  } ]
}, {
  path: '**',
  redirectTo: 'expert',
  pathMatch: 'full'
} ];
