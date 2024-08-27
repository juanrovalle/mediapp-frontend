import { Component, inject } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PatientService } from '../../../services/patient.service';

@Component({
  selector: 'app-patient-edit',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, RouterLink],
  templateUrl: './patient-edit.component.html',
  styleUrl: './patient-edit.component.css',
})
export class PatientEditComponent {
  operate() {
    console.log('Operate');
  }
  id!: number;
  form: FormGroup;
  isEditMode: boolean;
  constructor(private route: ActivatedRoute, private service: PatientService) {}

  ngOninit(): void {
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

  opetate() {}
}
