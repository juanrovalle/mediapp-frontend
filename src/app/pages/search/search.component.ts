import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTabGroup } from '@angular/material/tabs';
import { format } from 'date-fns';
import { FilterConsultDTO } from '../../model/filterConsultDTO';
import { ConsultService } from '../../services/consult.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Consult } from '../../model/consult';
import { DatePipe, LowerCasePipe, UpperCasePipe } from '@angular/common';
import { SearchDialogComponent } from './search-dialog/search-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    UpperCasePipe,
    LowerCasePipe,
    DatePipe,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnInit {
  message: string;
  @ViewChild('tabGroup') tabGroup: MatTabGroup;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  form: FormGroup;
  dataSource: MatTableDataSource<Consult>;
  displayedColumns = ['patient', 'medic', 'date', 'actions'];

  constructor(
    private consultService: ConsultService,
    private _dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.form = new FormGroup({
      dni: new FormControl(),
      fullName: new FormControl(),
      startDate: new FormControl(),
      endDate: new FormControl(),
    });
  }

  search() {
    if (this.tabGroup.selectedIndex == 0) {
      // option1
      const dni = this.form.value['dni'];
      const fullName = this.form.value['fullName']?.toLowerCase();
      const filterConsultDTO: FilterConsultDTO = new FilterConsultDTO(
        dni,
        fullName
      );
      this.consultService.searchOthers(filterConsultDTO).subscribe((data) => {
        console.log(data);
        this.createTable(data);
      });
    } else {
      // option2
      const date1 = format(
        this.form.value['startDate'],
        "yyyy-MM-dd'T'HH:mm:ss"
      );
      const date2 = format(this.form.value['endDate'], "yyyy-MM-dd'T'HH:mm:ss");
      //service

      this.consultService.searchByDates(date1, date2).subscribe((data) => {
        this.createTable(data);
      });
    }
  }
  createTable(data: Consult[]) {
    if (data.length == 0) {
      this.message = 'No data found';
    } else {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
  }
  viewDetails(consult: Consult) {
    this._dialog.open(SearchDialogComponent, { width: '750px', data: consult });
  }
}
