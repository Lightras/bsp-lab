import {Component, Input, OnInit} from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
   selector: 'app-roc',
   templateUrl: './roc.component.html',
   styleUrls: ['./roc.component.scss']
})
export class RocComponent implements OnInit {
   @Input('chartData') chartData: any;

   constructor() { }

   highcharts = Highcharts;
   chartOptions: any;

   ngOnInit() {
      this.chartOptions = {
         title: {
            text: 'ROC-curve'
         },

         yAxis: {
            title: {
               text: 'y'
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
            data: this.chartData.x.map((v, i) => {
               return {x: v, y: this.chartData.y[i]};
            })
         }]
      };

      console.log('this.chartOptions: ', this.chartOptions.series[0].data);
   }

}
