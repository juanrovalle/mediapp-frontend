import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTabGroup } from '@angular/material/tabs';
import { format } from 'date-fns';
import { FilterConsultDTO } from '../../model/filterConsultDTO';
import { ConsultService } from '../../services/consult.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnInit {
  @ViewChild('tabGroup') tabGroup: MatTabGroup;
  form: FormGroup;
dataSource: CdkTableDataSourceInput<any>;

  constructor(private consultService: ConsultService) {}
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
      this.consultService
        .searchOthers(filterConsultDTO)
        .subscribe((data) => console.log(data));
    } else {
      // option2
      const date1 = format(this.form.value['startDate'], "yyyy-MM-dd'T'HH:mm:ss");
      const date2 = format(this.form.value['endDate'], "yyyy-MM-dd'T'HH:mm:ss");
      //service

      this.consultService
        .searchByDates(date1, date2)
        .subscribe();
    }
  }
}
