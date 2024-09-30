import { Component, OnInit, viewChild, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../../material/material.module';
import { MedicService } from '../../services/medic.service';
import { Medic } from '../../model/medic';
import { MedicDialogComponent } from './medic-dialog/medic-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-medic',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './medic.component.html',
  styleUrl: './medic.component.css',
})
export class MedicComponent implements OnInit {
  dataSource: MatTableDataSource<Medic>;
  columnDefinition = [
    { def: 'idMedic', label: 'ID', hide: true },
    { def: 'name', label: 'First', hide: false },
    { def: 'lastname', label: 'Last', hide: false },
    // { def: 'photoUrl', label: 'Person ID', hide: false },
    { def: 'NPI', label: 'Medic ID', hide: false },
    { def: 'actions', label: 'Actions', hide: false },
  ];

  constructor(
    private medicService: MedicService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  getDisplayedColumns() {
    return this.columnDefinition.filter((cd) => !cd.hide).map((cd) => cd.def);
  }
  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim();
  }

  ngOnInit(): void {
    this.medicService.findAll().subscribe((data) => {
      this.initTable(data);
    });
    this.medicService
      .getMedicChange()
      .subscribe((data) => this.initTable(data));
    this.medicService
      .getMessagehange()
      .subscribe((data) =>
        this._snackBar.open(data, 'INFO', { duration: 2000 })
      );
  }
  /**
   *
   * @param data from data source
   *  Initialize Material Table
   */
  private initTable(data: Medic[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  delete(id: number) {
    console.log(id);
    this.medicService
      .delete(id)
      .pipe(switchMap(() => this.medicService.findAll()))
      .subscribe((data) => {
        this.medicService.setMedicChange(data);
        this.medicService.setMessageChange(`${id}: Deleted`);
      });
  }
  openDialog(medic?: any) {
    console.log('entre');
    this._dialog.open(MedicDialogComponent, {
      width: '750px',
      data: medic,
      disableClose: true,
    });
  }
}
