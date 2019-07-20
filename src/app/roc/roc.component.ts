import {Component, Input, OnInit} from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
   selector: 'app-roc',
   templateUrl: './roc.component.html',
   styleUrls: ['./roc.component.scss']
})
export class RocComponent implements OnInit {

   @Input('chartData') chartData: any;
   @Input('index') index: number;

   constructor() { }

   highcharts = Highcharts;
   chartOptions: any;

   ngOnInit() {
      this.chartOptions = {
         credits: {
            enabled: false
         },

         chart: {
            spacingLeft: 120
         },

         title: {
            text: 'ROC-крива діагностичного тесту № ' + (this.index + 1)
         },

         xAxis: {
            title: {
               text: '1 - Специфічність'
            },
            min: 0,
            max: 1,
            width: 300,
            height: 300
         },

         yAxis: {
            title: {
               text: 'Чутливість'
            },
            min: 0,
            max: 1,
            height: 300,
            width: 302
         },

         tooltip: {
            pointFormat: 'x: <b>{point.x:.3f}</b><br/>y: <b>{point.y:.3f}</b><br/>',
            valueDecimals: 3
         },

         plotOptions: {
            series: {
               label: {
                  connectorAllowed: false
               }
            }
         },

         legend: {
            enabled: false
         },

         series: [{
            name: '',
            data: (this.chartData.x.map((v, i) => {
               return {x: v, y: this.chartData.y[i]};
            }).sort((a, b) => {
               return (a.x - b.x) ? (a.x - b.x) : (a.y - b.y);
            })
)         }]
      };
   }

}
