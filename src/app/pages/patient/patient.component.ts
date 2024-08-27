import { Component, OnInit, ViewChild } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../model/patient';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterModule],
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.css',
})
export class PatientComponent implements OnInit {
  patients: Patient[] = [];
  dataSource = new MatTableDataSource<Patient>();
  // displayedColumns: string[] = ['idPatient', 'firstName', 'lastName', 'dni'];
  columnDefinition = [
    { def: 'idPatient', label: 'ID', hide: true },
    { def: 'firstName', label: 'First', hide: false },
    { def: 'lastName', label: 'Last', hide: false },
    { def: 'dni', label: 'Person ID', hide: false },
    { def: 'actions', label: 'Actuibs  ID', hide: false },
  ];
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private PatientService: PatientService) {}

  ngOnInit(): void {
    this.PatientService.findAll().subscribe(
      (data) =>{ (this.dataSource = new MatTableDataSource(data))
      this.dataSource.sort = this.sort
      this.dataSource.paginator= this.paginator
      }
    );
    this.dataSource.sort = this.sort
  }
  getDisplayedColumns() {
    return this.columnDefinition.filter((cd) => !cd.hide).map((cd) => cd.def);
  }
  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim();
  }
  
}
