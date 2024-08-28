import { Component, inject } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PatientService } from '../../../services/patient.service';
import { Patient } from '../../../model/patient';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-patient-edit',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, RouterLink],
  templateUrl: './patient-edit.component.html',
  styleUrl: './patient-edit.component.css',
})
export class PatientEditComponent {
  id!: number;
  form!: FormGroup;
  isEditMode: boolean;
  constructor(
    private route: ActivatedRoute,
    private service: PatientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      idPatient: new FormControl(0),
      firstName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(70),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(70),
      ]),
      dni: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.pattern('[0-9]+')),
      email: new FormControl('', Validators.email),
    });

    this.route.params.subscribe((data) => {
      this.id = data['id'];
      this.isEditMode = data['id'] != null;
      this.initForm();
    });
  }

  private initForm() {
    if (this.isEditMode) {
      this.service.findById(this.id).subscribe((data) => {
        this.form = new FormGroup({
          idPatient: new FormControl(data.idPatient),
          firstName: new FormControl(data.firstName),
          lastName: new FormControl(data.lastName),
          dni: new FormControl(data.dni),
          address: new FormControl(data.address),
          phone: new FormControl(data.phone),
          email: new FormControl(data.email),
        });
      });
    }
  }
  operate() {
    const patient: Patient = new Patient();
    patient.idPatient = this.form.value.idPatient;
    patient.firstName = this.form.value.firstName;
    patient.lastName = this.form.value.lastName;
    patient.dni = this.form.value.dni;
    patient.address = this.form.value.address;
    patient.phone = this.form.value.phone;
    patient.email = this.form.value.email;
    //  update approach # 1 
    if (this.isEditMode) {
      this.service.update(this.id, patient).subscribe(() => {
        this.service.findAll().subscribe((data) => {
          this.service.setPatientChange(data);
          this.service.setMessageChange('Updated');
        });
      });
    } else {
      // insert  approach # 2
      this.service
        .save(patient)
        .pipe(
          switchMap((data) => {
            return this.service.findAll();
          })
        )
        .subscribe((data) => {
          this.service.setPatientChange(data);
          this.service.setMessageChange('Created');
        });
    }
    this.router.navigate(['pages/patient']);
  }
}
