import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SpecialityService } from '../../services/speciality.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Patient } from '../../model/patient';
import { Speciality } from '../../model/speciality';
import { switchMap } from 'rxjs';
@Component({
  selector: 'app-speciality-edit',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, RouterLink],
  templateUrl: './speciality-edit.component.html',
  styleUrl: './speciality-edit.component.css',
})
export class SpecialityEditComponent implements OnInit {
  id: number;
  form: FormGroup;
  isEdit: boolean;
  constructor(
    private route: ActivatedRoute,
    private specialityService: SpecialityService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.form = new FormGroup({
      idSpeciality: new FormControl(0),
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(70),
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(200),
      ]),
    });
    this.route.params.subscribe((data) => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    });
  }
  initForm() {
    if (this.isEdit) {
      this.specialityService.findById(this.id).subscribe((data) => {
        this.form = new FormGroup({
          idSpeciality: new FormControl(data.idSpeciality),
          name: new FormControl(data.name),
          description: new FormControl(data.description),
        });
      });
    }
  }

  operate() {
    const speciality = new Speciality();
    speciality.idSpeciality = this.form.value.idSpeciality;
    speciality.name = this.form.value.name;
    speciality.description = this.form.value.description;
    if (this.isEdit) {
      //Update
      this.specialityService
        .update(this.id, speciality)
        .pipe(switchMap(() => this.specialityService.findAll()))
        .subscribe((data) => {
          this.specialityService.setSpecialtyChange(data);
          this.specialityService.setMessageChange(`${this.id} Updated`);
        });
    } else {
      // Save Values
      this.specialityService
        .save(speciality)
        .pipe(switchMap(() => this.specialityService.findAll()))
        .subscribe((data) => {
          this.specialityService.setSpecialtyChange(data);
          this.specialityService.setMessageChange(`Specialty created:`);
        });
      {
      }
    }

    this.router.navigate(['pages/speciality']);
  }
}
