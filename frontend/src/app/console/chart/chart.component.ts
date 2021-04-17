import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.sass']
})
export class ChartComponent implements OnInit {

  constructor() { }

  public lineChartData: Array<any> = [
    { data: [0, 0, 0, 0], label: 'Ventas' }
  ];

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  public barChartType = 'line';
  
  public barChartLegend = true;

  public lineChartLabels: Array<any> = ['Enero', 'Febrero', 'Marzo', 'Abril'];
  ngOnInit() {
  }
}
