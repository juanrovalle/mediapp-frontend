import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { SpecialityService } from '../../services/speciality.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Speciality } from '../../model/speciality';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-speciality',
  standalone: true,
  imports: [MaterialModule, RouterLink, RouterOutlet],
  templateUrl: './speciality.component.html',
  styleUrl: './speciality.component.css',
})
export class SpecialityComponent implements OnInit {
delete(arg0: any) {
throw new Error('Method not implemented.');
}
  dataSource: Speciality[];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  columnDefinition = [
    { def: 'idSpeciality', label: 'ID', hide: true },
    { def: 'name', label: 'First', hide: false },
    { def: 'description', label: 'Last', hide: false },
    { def: 'actions', label: 'Actions', hide: false },
  ];
 

  constructor(
    private specialityService: SpecialityService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.specialityService.findAll().subscribe(data=>{
      this.dataSource = data;
    })
  }


  getDisplayedColumns() {
    return this.columnDefinition.filter((cd) => !cd.hide).map((cd) => cd.def);
  }
  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim();
  }

  operate(){}

  close(){}
}
