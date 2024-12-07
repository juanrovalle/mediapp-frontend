import { Routes } from '@angular/router';
import { PatientComponent } from './patient/patient.component';
import { MedicComponent } from './medic/medic.component';
import { PatientEditComponent } from './patient/patient-edit/patient-edit.component';
import { SpecialityComponent } from './speciality/speciality.component';
import { SpecialityEditComponent } from './speciality-edit/speciality-edit.component';
import { ConsultWizardComponent } from './consult-wizard/consult-wizard.component';
import { ReportComponent } from './report/report.component';
import { SearchComponent } from './search/search.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { certGuard } from '../guard/cert.guard';
import { Not403Component } from './not403/not403.component';
import { Not404Component } from './not404/not404.component';
import { ExamComponent } from './exam/exam.component';

export const pageRoutes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [certGuard],
  },
  {
    path: 'patient',
    component: PatientComponent,
    children: [
      { path: 'new', component: PatientEditComponent },
      { path: 'edit/:id', component: PatientEditComponent },
    ],
  },
  {
    path: 'speciality',
    component: SpecialityComponent,
    children: [
      { path: 'new', component: SpecialityEditComponent },
      { path: 'edit/:id', component: SpecialityEditComponent },
    ],
  },
  { path: 'medic', component: MedicComponent },
  { path: 'consult-wizard', component: ConsultWizardComponent },
  { path: 'report', component: ReportComponent },
  { path: 'search', component: SearchComponent },
  { path: 'exams', component: ExamComponent },
  { path: 'not-403', component: Not403Component },
  { path: 'not-404', component: Not404Component },
];
