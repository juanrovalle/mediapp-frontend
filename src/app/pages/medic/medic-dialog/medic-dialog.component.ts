import { Component, Inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { Medic } from '../../../model/medic';
import { SpecialityService } from '../../../services/speciality.service';
import { Speciality } from '../../../model/speciality';
import { MedicService } from '../../../services/medic.service';
import { switchMap } from 'rxjs';
@Component({
  selector: 'app-medic-dialog',
  standalone: true,
  imports: [MaterialModule, FormsModule],
  templateUrl: './medic-dialog.component.html',
  styleUrl: './medic-dialog.component.css',
})
export class MedicDialogComponent implements OnInit {
  medic: Medic;
  specialities: Speciality[];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Medic,
    private specialityService: SpecialityService,
    private medicService: MedicService,
    private _dialogRef: MatDialogRef<MedicDialogComponent>
  ) {}

  ngOnInit(): void {
    this.medic = { ...this.data };
    this.specialityService.findAll().subscribe((data) => {
      this.specialities = data;
    });
  }
  operate() {
    console.log('entre');
    if (this.medic != null && this.medic.idMedic > 0) {
      //UPDATE
      this.medicService
        .update(this.medic.idMedic, this.medic)
        .pipe(switchMap(() => this.medicService.findAll()))
        .subscribe((data) => {
          this.medicService.setMedicChange(data);
          this.medicService.setMessageChange('UPDATED!');
        });
    } else {
      //  insert
      this.medicService
        .save(this.medic)
        .pipe(switchMap(() => this.medicService.findAll()))
        .subscribe((data) => {
          this.medicService.setMedicChange(data);
          this.medicService.setMessageChange('Inserted!');
        });
    }
    this.close();
  }

  close() {
    this._dialogRef.close();
  }
}
