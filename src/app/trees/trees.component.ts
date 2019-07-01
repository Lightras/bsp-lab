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

   paramsBounds: number[][];
   paramsDef: number[][];
   paramsNames: string[];

   strategies = [1,2,3,4,5,6,7,8,9,10];
   strategiesNames = [
      'Діагностичні спектри рівні, верифікація негативного результату і-того тесту',
      'Діагностичні спектри рівні, верифікація позитивного результату і-того тесту',
      'Діагностичні спектри різні і не перетинаються, верифікація негативного результату і-того тесту',
      'Діагностичні спектри різні і не перетинаються, верифікація позитивного результату і-того тесту',
      'Діагностичний спектр j-того тесту входить до діагностичного спектру і-того тесту, верифікація негативного результату і-того тесту',
      'Діагностичний спектр j-того тесту входить до діагностичного спектру і-того тесту, верифікація позитивного результату і-того тесту',
      'Діагностичний спектр і-того тесту входить до діагностичного спектру j-того тесту, верифікація негативного результату і-того тесту',
      'Діагностичний спектр і-того тесту входить до діагностичного спектру j-того тесту, верифікація позитивного результату і-того тесту',
      'Діагностичні спектри частково перетинаються, верифікація негативного результату і-того тесту',
      'Діагностичні спектри частково перетинаються, верифікація позитивного результату і-того тесту'
   ];
   // 'Паралельна діагностика, діагностичні спектри частково перетинаються'

   compareList1: any[];
   compareList2: any[];
   labelsList1: any[];
   labelsList2: any[];
   strategy1: number;
   strategy2: number;

   paramsSelectList: any[];
   compareClicked = false;

   N = 2000;

   ngOnInit() {
      this.paramsOrder = ['Pi', 'Pj', 'Sei', 'Sej', 'Spi', 'Spj', 'Utp', 'Ufp', 'Utn', 'Ufn'];
      this.paramsNames = [
         'Діагностичний спектр і-того тесту',
         'Діагностичний спектр j-того тесту',
         'Чутливість і-того тесту',
         'Чутливість j-того тесту',
         'Специфічність і-того тесту',
         'Специфічність j-того тесту',
         'Корисність дійснопозитивного результату',
         'Корисність хибнопозитивного результату',
         'Корисність дійснонегативного результату',
         'Корисність хибнонегативного результату'
      ];

      this.paramsSelectList = this.paramsOrder.map((p, i) => {
         return {code: p, label: this.paramsNames[i]};
      });



      
      this.paramsBounds = [[0,1], [0,1], [0,1], [0,1], [0,1], [0,1], [0,1], [-1,0], [0,1], [-1,0]];
      this.paramsDef    = [[0,1], [0,1], [0,1], [0,1], [0,1], [0,1], [0,1], [-1,0], [0,1], [-1,0]];

      this.compareList1 = this.strategies.map((s, i) => {
         return {number: s, label: this.strategiesNames[i]};
      });
      this.compareList2 = this.strategies.map((s, i) => {
         return {number: s, label: this.strategiesNames[i]};
      });

      // this.strategy1 = 1;
      // this.strategy2 = 2;

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
      this.compareClicked = true;
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
            text: 'Залежність відношення очікуваних корисностей обраних стратегій від параметрів'
         },

         xAxis: {
            title: {
               text: ''
            }
         },

         yAxis: {
            title: {
               text: 'Відношення очікуваних корисностей першої і другої стратегій'
            }
         },

         legend: {
            enabled: false
         },

         plotOptions: {
            scatter: {
               marker: {
                  radius: 1.4
               }
            }
         },

         series: [{
            name: '',
            data: this.data.map(p => [p.params[i], p.value])
         }]
      };
   }

   selectStrategy(strategyNumber: number, e) {
      this.compareClicked = false;
   }

   randomize_params(): number[] {
      let Pi: number;
      let Pj: number;
      let Pij: number;

      // @ts-ignore
      const params = [];
      
      this.paramsBounds.forEach((bound, i) => {
         params[i] = bound[0] + Math.random() * (bound[1] - bound[0]);
      });

      Pi = params[0];

      // todo How do we generate params for 2 different strategies?
      switch (this.strategy1) {
         case 1:
         case 2: {
            Pj = Math.random();
            break;
         }

         case 3:
         case 4: {
            Pj = (1 - Pi) * Math.random();
            break;
         }

         case 5:
         case 6: {
            Pj = Pi * Math.random();
            break;
         }

         case 7:
         case 8: {
            Pj = Math.random();
            Pi = Pj * Math.random();
            break;
         }

         case 9:
         case 10: {
            Pij = Pi * Math.random();
            Pj = Pij + (1 - Pi) * Math.random();
         }

      }

      params[0] = Pi;
      params[1] = Pj;

      return params;
   }

   calcRelation() {
      let params = new Array(10);
      params = this.randomize_params();

      // @ts-ignore
      const value = this['EU' + this.strategy1](...params) / this['EU' + this.strategy2](...params);

      // todo Why does it produce outstanding values? Do we need these bounds?
      if (value < 5 && value > -5) {
      // if (true) {
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
