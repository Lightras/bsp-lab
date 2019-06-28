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

         title: {
            text: 'ROC-curve of test #' + (this.index + 1)
         },

         xAxis: {
            title: {
               text: '1 - Sp'
            }
         },

         yAxis: {
            title: {
               text: 'Se'
            }
         },

         plotOptions: {
            series: {
               label: {
                  connectorAllowed: false
               }
            }
         },

         series: [{
            data: (this.chartData.x.map((v, i) => {
               return {x: v, y: this.chartData.y[i]};
            }).sort((a, b) => a.x - b.x)
)         }]
      };

      console.log('this.chartOptions: ', this.chartOptions.series[0].data);
   }

}
