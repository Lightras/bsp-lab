import {Component, Input, OnInit} from '@angular/core';
import * as Highcharts from 'highcharts';
import exporting from 'highcharts/modules/exporting';

exporting(Highcharts);

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
      Highcharts.SVGRenderer.prototype.symbols.download = (x, y, w, h) => {
         let path = [
            // Arrow stem
            'M', x + w * 0.5, y,
            'L', x + w * 0.5, y + h * 0.7,
            // Arrow head
            'M', x + w * 0.3, y + h * 0.5,
            'L', x + w * 0.5, y + h * 0.7,
            'L', x + w * 0.7, y + h * 0.5,
            // Box
            'M', x, y + h * 0.9,
            'L', x, y + h,
            'L', x + w, y + h,
            'L', x + w, y + h * 0.9
         ];
         return path;
      };

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

         lang: {
            downloadPDF: 'Завантажити в PDF',
            contextButtonTitle: 'Опції завантаження',
            downloadPNG: 'Завантажити як зображення',
            printChart: 'Роздрукувати',
            viewFullscreen: 'Показати на весь екран'
         },

         exporting: {
            enabled: true,
            buttons: {
               contextButton: {
                  menuItems: ['downloadPNG', 'downloadPDF', 'separator', 'printChart'],
                  symbol: 'download',
                  x: -430,
                  y: 0
               }
            }
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
            findNearestPointBy: 'xy',
            data: (this.chartData.x.map((v, i) => {
               return {x: v, y: this.chartData.y[i]};
            }).sort((a, b) => {
               return (a.x - b.x) ? (a.x - b.x) : (a.y - b.y);
            })
)         }]
      };
   }

}
