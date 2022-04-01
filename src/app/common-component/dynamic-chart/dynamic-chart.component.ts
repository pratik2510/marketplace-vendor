import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'ngx-dynamic-chart',
  templateUrl: './dynamic-chart.component.html',
  styleUrls: ['./dynamic-chart.component.scss']
})
export class DynamicChartComponent implements OnInit, OnChanges {

  // Common Variable 
  @Input() ChartType: any;
  @Input() chartLabels: Label[];
  @Input() chartOption: any;
  @Input() ChartData: any;
  chartLegend = false;
  chartOptions: ChartOptions = {};

  constructor() { }

  ngOnChanges() {
    if (this.chartOption && this.ChartType) {

      if (this.ChartType === 'bar') {

        this.chartOptions = {
          responsive: true,
          title: {
            text: this.chartOption['mainTitle'],
            display: true,
            fontColor:'#3366ff',
          },
          scales: {
            xAxes: [
              {
                gridLines: {
                  display: false
                },
                scaleLabel: {
                  display: true,
                  fontColor:'#3366ff',
                  labelString: this.chartOption['axesLabel']['x'],
                },
                ticks: {
                  beginAtZero:true,
                  fontColor: '#fff'
              },
              },
            ],
            yAxes: [{
              ticks: {
                beginAtZero:true,
                fontColor: '#fff'
              },
              gridLines: {
                display: false
              },
              scaleLabel: {
                display: true,
                fontColor:'#3366ff',
                labelString: this.chartOption['axesLabel']['y']
              }
            }]
          }
        };

      }

      if (this.ChartType === 'line') {

        this.chartOptions = {
          responsive: true,
          title: {
            text: this.chartOption['mainTitle'],
            display: true,
            fontColor:'#3366ff',
          },
          scales: {
            xAxes: [
              {
                ticks: {
                  fontColor:'#3366ff',
                },
                gridLines: {
                  display: false
                },
                scaleLabel: {
                  display: true,
                  labelString: this.chartOption['axesLabel']['x'],
                },
              },
            ],
            yAxes: [{
              ticks: {
                beginAtZero: true,
                fontColor:'#3366ff',
              },
              gridLines: {
                display: false
              },
              scaleLabel: {
                display: true,
                labelString: this.chartOption['axesLabel']['y']
              }
            }]
          }
        };

      }
    }
  }

  ngOnInit() { }

}
