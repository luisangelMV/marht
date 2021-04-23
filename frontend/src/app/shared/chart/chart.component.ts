import { Component, ElementRef, Injectable, Injector, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Chart, ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.sass']
})
@Injectable()
export class ChartComponent implements OnInit {

  @Input() chartdata: any;
  public labelTime: String = 'Dia';
  public actions = ['hora', 'Día', 'Mes']
  public lineChartData: ChartDataSets[];
  public lineChartLabels: Label[];
  public lineChartOptions: ChartOptions;
  public lineChartColors: Color[];
  public lineChartLegend = false;
  public lineChartType = 'line';
  constructor() { }

  ngOnInit(): void {

    this.lineChartData = [
      { data: this.getArrayValue(this.chartdata, 'LpS'), label: 'litros por segundo' },
      // { data: this.getArrayValue(this.chartdata, 'Mc'), label: 'metros cubicos'}
    ];
    this.lineChartLabels = this.getArrayValue(this.chartdata, 'time');

    this.lineChartOptions = {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 5,
      scales: {
        xAxes: [{
          type: 'time',
          ticks: {
            source: 'auto',
          },
          time: {
            unit: 'hour',
          }
        }],
        yAxes:[{
          type: 'linear',
          ticks: {
            beginAtZero: true
          }
        }]
      },
    };

    this.lineChartColors = [
      {
        backgroundColor: 'rgba(82, 165, 254, 0.3)',
        borderColor: 'rgba(0, 123, 255, 0.8)',
        pointBackgroundColor: 'rgba(0, 123, 255, 0.8)'
      },
      { // red
        backgroundColor: 'rgba(255,0,0,0.3)',
        borderColor: 'red',
        pointBackgroundColor: 'red',
        pointBorderColor: 'red',
      }
    ];
  }
  getChartLabels(data: any) {
  }

  ChangeValueDrop(item: string) {
    this.labelTime = item
    console.log(this.labelTime);

  }
  getArrayValue(data: Array<string>, object: string) {

    return data.reverse().map(function (o) {
      return o[object];
    });
  }
}
