import { Component, OnInit, viewChild, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Patient } from '../../model/patient';
import { PatientService } from '../../services/patient.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ConsultDetail } from '../../model/consultDetail';
import { ExamService } from '../../services/exam.service';
import { Exam } from '../../model/exam';
import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MedicService } from '../../services/medic.service';
import { Medic } from '../../model/medic';
import { MatStepper } from '@angular/material/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardActions } from '@angular/material/card';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { ConsultListExamDTOI } from '../../model/consultListExamDTO';
import { Consult } from '../../model/consult';
import { format } from 'date-fns';
import { ConsultService } from '../../services/consult.service';
@Component({
  selector: 'app-consult-wizard',
  standalone: true,
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    CommonModule,
    FlexLayoutModule,
  ],
  templateUrl: './consult-wizard.component.html',
  styleUrl: './consult-wizard.component.css',
})
export class ConsultWizardComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  patients: Patient[];
  patients$: Observable<Patient[]>;

  minDate: Date = new Date();
  details: ConsultDetail[] = [];
  exams: Exam[];
  examsFiltered$: Observable<Exam[]>;
  examControl: FormControl = new FormControl();

  examsSelected: Exam[] = [];
  medics: Medic[];
  medicSelected: Medic;

  consultArray: number[] = [];
  consultSelected: number;

  @ViewChild('stepper') stepper: MatStepper;
  consults: any;

  constructor(
    private formBuilder: FormBuilder,
    private patientService: PatientService,
    private medicService: MedicService,
    private examService: ExamService,
    private consultService: ConsultService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.firstFormGroup = this.formBuilder.group({
      patient: [new FormControl(), Validators.required],
      consultDate: [new FormControl(new Date()), Validators.required],
      exam: [this.examControl, Validators.required],
      diagnosis: new FormControl('', Validators.required),
      treatment: new FormControl('', Validators.required),
    });

    this.secondFormGroup = this.formBuilder.group({});

    this.examsFiltered$ = this.examControl.valueChanges.pipe(
      map((val) => this.filterExams(val))
    );

    this.loadInitialData();
  }

  loadInitialData() {
    this.patients$ = this.patientService.findAll();
    this.examService.findAll().subscribe((data) => (this.exams = data));
    this.medicService.findAll().subscribe((data) => (this.medics = data));

    for (let i = 1; i <= 100; i++) {
      this.consultArray.push(i);
    }
  }

  filterExams(val: any) {
    if (val && val.idExam > 0) {
      return this.exams.filter(
        (el) =>
          (el.name &&
            el.name.toLowerCase().includes(val.nameExam?.toLowerCase())) ||
          (el.descriptionExam &&
            el.descriptionExam
              .toLowerCase()
              .includes(val.descriptionExam?.toLowerCase()))
      );
    } else {
      return this.exams.filter(
        (el) =>
          (el.name && el.name.toLowerCase().includes(val?.toLowerCase())) ||
          (el.descriptionExam &&
            el.descriptionExam.toLowerCase().includes(val?.toLowerCase()))
      );
    }
  }

  showExam(val: any) {
    return val ? val.name : val;
  }

  getDate(e: any) {
    console.log(e.value);
  }

  addDetail() {
    const det = new ConsultDetail();
    det.diagnosis = this.firstFormGroup.value['diagnosis'];
    det.treatment = this.firstFormGroup.value['treatment'];

    this.details.push(det);
  }

  removeDetail(index: number) {
    this.details.splice(index, 1);
  }

  selectMedic(m: Medic) {
    this.medicSelected = m;
  }

  selectedConsult(n: number) {
    this.consultSelected = n;
  }

  addExam() {
    const tmpExam = this.firstFormGroup.value['exam'].value;

    if (tmpExam != null) {
      this.examsSelected.push(tmpExam);
    } else {
      this._snackBar.open('Please Selec an Exam', 'INFO', { duration: 2000 });
    }
  }

  nextManualStep() {
    if (this.consultSelected > 0) {
      this.stepper.next();
      //next step
    } else {
      this._snackBar.open('Please Select the consultory', 'INFO', {
        duration: 2000,
      });
    }
  }

  get f() {
    return this.firstFormGroup.controls;
  }
  save() {
    const consult = new Consult();
    consult.patient = this.firstFormGroup.value['patient'];
    consult.medic = this.medicSelected;
    consult.details = this.details;
    consult.numConsult = `${this.consultSelected}`;
    consult.consultDate = format(this.firstFormGroup.value['consultDate'], "yyyy-MM-dd'T'HH:mm:ss") ;
    consult.idUser = 1;

    const dto: ConsultListExamDTOI = {
      consult: consult,
      listExam: this.examsSelected,
    };

    this.consultService.saveTransactional(dto).subscribe(() => {
      this._snackBar.open('CREATED!', 'INFO', { duration: 2000 });

      setTimeout(() => {
        this.cleanControls();
      },2000);
    });
  }
  cleanControls() {
    this.firstFormGroup.reset();
    this.stepper.reset();
    this.details = [];
    this.examsSelected = [];
    this.consultSelected = 0;
    this.medicSelected = null;
  }
}
