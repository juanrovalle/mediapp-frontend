import { Component, OnInit, signal } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { ConsultService } from '../../services/consult.service';
import { Chart, ChartType } from 'chart.js/auto';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-report',
  standalone: true,
  imports: [MaterialModule, PdfViewerModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css',
})
export class ReportComponent implements OnInit {
  imageData: SafeResourceUrl;
  chart: Chart;
  type: ChartType = 'line';
  pdfSrc: string;
  selectedFiles: FileList;
  fileName: string;
imageSignal = signal(null);

  constructor(
    private consultService: ConsultService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.draw();
  }
  // upload() {
  //   this.consultService.saveFile(this.selectFile[0]).subscribe();
  // }

  upload(): void {
    if (!this.selectedFiles) return;

    const formData = new FormData();
    formData.append('archivo', this.selectedFiles[0]); // Matches the backend key

    this.consultService.saveFile(formData).subscribe({
      next: (response) => console.log('File uploaded successfully:', response),
      error: (error) => console.error('File upload failed:', error),
    });
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

  viewImage() {
    this.consultService.readFile(1).subscribe((data) => {
      this.convertToBase64(data);
    });
  }
  convertToBase64(data: Blob) {
    const reader = new FileReader();
    reader.readAsDataURL(data);
    reader.onloadend = () => {
      const base64 = reader.result;
     // this.imageData = base64;
      this.applySanitizer(base64);
    };
  }

  applySanitizer(base64: any) {
    this.imageData = this.sanitizer.bypassSecurityTrustResourceUrl(base64);
    this.imageSignal.set(this.imageSignal);
  }

}
