import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { ConsultService } from '../../services/consult.service';
import { Chart, ChartType } from 'chart.js/auto';
import { PdfViewerModule } from 'ng2-pdf-viewer';
@Component({
  selector: 'app-report',
  standalone: true,
  imports: [MaterialModule, PdfViewerModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css',
})
export class ReportComponent implements OnInit {
  chart: Chart;
  type: ChartType = 'line';
  pdfSrc: string;
  selectedFiles: FileList;
  fileName: string;

  constructor(private consultService: ConsultService) {}

  ngOnInit(): void {
    this.draw();
  }
  
  upload() {
    this.consultService.saveFile(this.selectFile[0]).subscribe();
  }

  selectFile($event: any) {
    this.selectedFiles = $event.target.files;
    this.fileName = this.selectedFiles[0]?.name;
  }
  downloadReport() {
    this.consultService.generateReport().subscribe((data) => {
      const url = window.URL.createObjectURL(data);
      // console.log(url);
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none');
      document.body.appendChild(a);
      a.href = url;
      a.download = 'report.pdf';
      a.click();
    });
  }
  viewReport() {
    this.consultService.generateReport().subscribe((data) => {
      this.pdfSrc = window.URL.createObjectURL(data);
    });
  }

  change(type: string) {
    switch (type) {
      case 'line':
        this.type = 'line';
        break;
      case 'bar':
        this.type = 'bar';
        break;
      case 'doughnut':
        this.type = 'doughnut';
        break;
      case 'radar':
        this.type = 'radar';
        break;
    }
    if (this.chart != null) this.chart.destroy();

    this.draw();
  }

  draw() {
    this.consultService.callProcedureOrFunction().subscribe((data) => {
      const dates = data.map((x) => x.consultdate);
      const quantity = data.map((x) => x.quantity);

      const ctx = document.getElementById('myChart') as HTMLCanvasElement;

      this.chart = new Chart('canvas', {
        type: this.type,
        data: {
          labels: dates,
          datasets: [
            {
              label: 'Quantity',
              // borderColor: '#3cba9f',
              data: quantity,
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              display: true,
            },
            x: {
              beginAtZero: true,
            },
          },
        },
      });
    });
  }
}
