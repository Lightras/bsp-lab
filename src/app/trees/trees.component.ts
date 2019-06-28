import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
   selector: 'app-trees',
   templateUrl: './trees.component.html',
   styleUrls: ['./trees.component.sass']
})
export class TreesComponent implements OnInit {

   constructor() { }

   highcharts = Highcharts;
   chartOptions: any;

   data: any[];
   currentInd = 0;
   paramsOrder: string[];
   currentParam: string;

   strategies = [1,2,3,4,5,6,7,8,9,10,11,12];
   compareList1: any[];
   compareList2: any[];
   strategy1: number;
   strategy2: number;

   N = 1000;

   ngOnInit() {
      this.paramsOrder = ['Pi', 'Pj', 'Sei', 'Sej', 'Spi', 'Spj', 'Utp', 'Ufp', 'Utn', 'Ufn'];

      this.compareList1 = this.strategies;
      this.compareList2 = this.strategies;

      this.strategy1 = 1;
      this.strategy2 = 2;

      this.compare();
   }

   compare() {
      let i = 0;
      this.data = [];

      while (i < this.N) {
         this.data.push(this.calcRelation());
         i++;
      }

      this.currentParam = 'Pi';
      this.buildChart(0);
   }

   buildChart(i) {
      this.chartOptions = {
         credits: {
            enabled: false
         },

         chart: {
            type: 'scatter'
         },

         title: {
            text: 'title'
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
            scatter: {
               marker: {
                  radius: 2
               }
            }
         },

         series: [{
            data: this.data.map(p => [p.params[i], p.value])
         }]
      };
   }



   randomize_params(): number[] {
      return [
         Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(),
         Math.random(), Math.random(), - Math.random(), - Math.random()
      ];
   }

   calcRelation() {
      let params = new Array(10);
      params = this.randomize_params();
      console.log('params: ', params);
      // @ts-ignore
      const value = this['EU' + this.strategy1](...params) / this['EU' + this.strategy2](...params);
      if (value < 5 && value > -5) {
         return {
            params,
            value
         };
      } else {
         return this.calcRelation();
      }
   }

   EU0(Pi, Sei, Spi, Utp, Ufp, Utn, Ufn) {
      return Pi*Sei*Utp + (1-Pi)*(1-Spi)*Ufp + (1-Pi)*Spi*Utn + Pi*(1-Sei)*Ufn;
   }

   EU1(Pi, Pj, Sei, Sej, Spi, Spj, Utp, Ufp, Utn, Ufn) {
      // eq v n i
      return Pi * Sei * Utp + (1 - Pi) * (1 - Spi) * Ufp +
         (1 - Pi) * Spi * ((1 - Spj) * Ufp + Spj * Utn) +
         Pi * (1 - Sei) * (Sej * Utp + (1 - Sej) * Ufn);
   }

   EU2(Pi, Pj, Sei, Sej, Spi, Spj, Utp, Ufp, Utn, Ufn) {
      // eq v p i
      return Pi * Sei * (Sej * Utp + (1 - Sej) * Ufn) +
         (1 - Pi) * (1 - Spi) * ((1 - Spj) * Ufp + Spj * Utn) +
         (1 - Pi) * Spi * Utn + Pi * (1 - Sei) * Ufn;
   }

   EU3(Pi, Pj, Sei, Sej, Spi, Spj, Utp, Ufp, Utn, Ufn) {
      // ni v n i
      return Pi*Sei*Utp + (1-Pi)*(1-Spi)*Ufp + (1-Pi)*Spi*(Pj/(1-Pi)*Sej*Utp + (1-Pi-Pj)/(1-Pi)*(1-Spj)*Ufp + (1-Pi-Pj)/(1-Pi)*Spj*Utn +
         Pj/(1-Pi)*(1-Sej)*Ufn) + Pi*(1-Sei)*(Spj*Utn + (1-Spj)*Ufp);
   }

   EU4(Pi, Pj, Sei, Sej, Spi, Spj, Utp, Ufp, Utn, Ufn) {
      // ni v p i
      return (1-Pi)*Spi*Utn + Pi*(1-Sei)*Ufn + (1-Pi)*(1-Spi)*(Pj/(1-Pi)*Sej*Utp + (1-Pi-Pj)/(1-Pi)*(1-Spj)*Ufp +
         (1-Pi-Pj)/(1-Pi)*Spj*Utn + Pj/(1-Pi)*(1-Sej)*Ufn) + Pi*Sei*(Sej*Utn + (1-Sej)*Ufp);
   }

   EU5(Pi, Pj, Sei, Sej, Spi, Spj, Utp, Ufp, Utn, Ufn) {
      // j<i v n i
      return Pi*Sei*Utp + (1-Pi)*(1-Spi)*Ufp + (1-Pi)*Spi*(Spj*Utn + (1-Spj)*Ufn) + Pi*(1-Sei)*((Pj/Pi)*Sej)*Utp +
         (Pi-Pj)/Pi*(1-Spj)*Ufp + (Pi-Pj)/Pi*Spj*Utn + (Pj/Pi)*(1-Sej)*Ufn;
   }

   EU6(Pi, Pj, Sei, Sej, Spi, Spj, Utp, Ufp, Utn, Ufn) {
      // j<i v p i
      return (1-Pi)*Spi*Utn + Pi*(1-Sei)*Ufn + (1-Pi)*(1-Spi)*(Spj*Utn + (1-Spj)*Ufn) +
         Pi*Sei*((Pj/Pi)*Sej*Utp + (Pi-Pj)*Pi*(1-Spj)*Ufp + (Pi-Pj)/Pi*Spj*Utn + (Pj/Pi)*(1-Sej)*Ufn);
   }

   EU7(Pi, Pj, Sei, Sej, Spi, Spj, Utp, Ufp, Utn, Ufn) {
      // i<j v n i
      return Pi*Sei*Utp + (1-Pi)*(1-Spi)*Ufp +
         (1-Pi)*Spi*((Pj-Pi)/(1-Pi)*Sej)*Utp + (1-Pj)/(1-Pi)*(1-Spj)*Ufp + (1-Pj)/(1-Pi)*Spj*Utn + (Pj-Pi)/(1-Pi)*(1-Sej)*Ufn +
         Pi*(1-Sei)*(Sej*Utp + (1-Sej)*Ufn);
   }

   EU8(Pi, Pj, Sei, Sej, Spi, Spj, Utp, Ufp, Utn, Ufn) {
      // i<j v p i
      return (1-Pi)*Spi*Utn +
         Pi*(1-Sei)*Ufn +
         (1-Pi)*(1-Spi)*(
            (Pj-Pi)/(1-Pi)*Sej*Utp +
            (1-Pj)/(1-Pi)*(1-Spj)*Ufp +
            (1-Pj)/(1-Pi)*Spj*Utn +
            (Pj-Pi)/(1-Pi)*(1-Sej)*Ufn
         ) +
         Pi*Sei*(
            Sej*Utp + (1-Sej)*Ufn
         );
   }

   EU9(Pi, Pj, Sei, Sej, Spi, Spj, Utp, Ufp, Utn, Ufn, Pij) {
      // i v n i
      return Pi*Sei*Utp + (1-Pi)*(1-Spi)*Ufp +
         (1-Pi)*Spi*(
            (Pj-Pij)/(1-Pi)*Sej*Utp +
            (1-Pi-Pj+Pij)/(1-Pi)*(1-Spj)*Ufp +
            (1-Pi-Pj+Pij)/(1-Pi)*(1-Pi)*Spj*Utn +
            (Pj-Pij)/(1-Pi)*(1-Sej)*Ufn
         ) +
         Pi*(1-Sei)*(
            Pij/Pi*Sej*Utp +
            (Pi-Pij)/Pi*(1-Spj)*Ufp +
            (Pi-Pij)/Pi*Spj*Utn +
            Pij/Pi*(1-Sej)*Ufn
         );
   }

   EU10(Pi, Pj, Sei, Sej, Spi, Spj, Utp, Ufp, Utn, Ufn, Pij) {
      // i v p i
      return (1-Pi)*Spi*Utn + Pi*(1-Sei)*Ufn +
         (1-Pi)*(1-Spi)*(
            (Pj-Pij)/(1-Pi)*Sej*Utp +
            (1-Pi-Pj+Pij)/(1-Pi)*(1-Spj)*Ufp +
            (1-Pi-Pj+Pij)/(1-Pi)*Spj*Utn +
            (Pj-Pij)/(1-Pi)*(1-Sej)*Ufn
         ) +
         Pi*Sei*(
            Pij/Pi*Sej*Utp +
            (Pi-Pij)/Pi*(1-Spj)*Ufp +
            (Pi-Pij)/Pi*Spj*Utn +
            Pij/Pi*(1-Sej)*Ufn
         );
   }

   EU11(Pi, Pj, Sei, Sej, Spi, Spj, Utp, Ufp, Utn, Ufn) {

   }
}
