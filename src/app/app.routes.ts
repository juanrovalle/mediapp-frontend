import { Routes } from '@angular/router';
import { PatientComponent } from './pages/patient/patient.component';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'pages',
    component: LayoutComponent,
    loadChildren: () => import('./pages/pages.routes').then(x => x.pageRoutes)
  },
//   {
//     path: 'admin',
//     component: LayoutComponent,
//     loadChildren: () => import('./admin/pages.routes').then(x => x.pageRoutes)
// },
];
