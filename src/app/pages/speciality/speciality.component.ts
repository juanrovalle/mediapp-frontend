import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { SpecialityService } from '../../services/speciality.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Speciality } from '../../model/speciality';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup } from '@angular/forms';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-speciality',
  standalone: true,
  imports: [MaterialModule, RouterLink, RouterOutlet],
  templateUrl: './speciality.component.html',
  styleUrl: './speciality.component.css',
})
export class SpecialityComponent implements OnInit {
  dataSource: MatTableDataSource<Speciality>;
  form!: FormGroup;
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
    private _snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // First run
    this.specialityService.findAll().subscribe((data) => {
      this.initMatTable(data);
    });
    // Other times run
    this.specialityService.getSpecialtyChange().subscribe((data) => {
      this.initMatTable(data);
    });

    this.specialityService.getMessagehange().subscribe((data) => {
      this.showSnackMessage(data);
    });
  }

  private initMatTable(data: Speciality[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getDisplayedColumns() {
    return this.columnDefinition.filter((cd) => !cd.hide).map((cd) => cd.def);
  }
  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim();
  }
  private showSnackMessage(data: string): void {
    this._snackBar.open(data, 'Info', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }

  hideChildren() {
    return this.activatedRoute.children.length > 0;
  }

  delete(id: number) {
    this.specialityService
      .delete(id)
      .pipe(switchMap(() => this.specialityService.findAll()))
      .subscribe((data) => {
        this.specialityService.setSpecialtyChange(data);
        this.specialityService.setMessageChange(`Speciality id: ${id} Deleted.` )
      });
  }
}
