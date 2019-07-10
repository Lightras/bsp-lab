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

   currentParamCode;

   parameters: Parameter[];
   strategies: Strategy[];

   compareList1: Strategy[];
   compareList2: Strategy[];

   strategy1: Strategy;
   strategy2: Strategy;

   compareClicked = false;

   callCount = 0;

   N = 500;
   L = 1000;
   W = 10;

   ngOnInit() {
      this.parameters = [
         {
            code: 'Pi',
            name: 'Діагностичний спектр і-того тесту',
            minAllowed: 0,
            maxAllowed: 1,
         },
         {
            code: 'Pj',
            name: 'Діагностичний спектр і-того тесту',
            minAllowed: 0,
            maxAllowed: 1,
         },
         {
            code: 'Sei',
            name: 'Діагностичний спектр і-того тесту',
            minAllowed: 0,
            maxAllowed: 1,
         },
         {
            code: 'Sej',
            name: 'Діагностичний спектр і-того тесту',
            minAllowed: 0,
            maxAllowed: 1,
         },
         {
            code: 'Spi',
            name: 'Діагностичний спектр і-того тесту',
            minAllowed: 0,
            maxAllowed: 1,
         },
         {
            code: 'Spj',
            name: 'Діагностичний спектр і-того тесту',
            minAllowed: 0,
            maxAllowed: 1,
         },
         {
            code: 'Utp',
            name: 'Корисність дійснопозитивного результату',
            minAllowed: 0,
            maxAllowed: 1,
         },
         {
            code: 'Ufp',
            name: 'Корисність хибнопозитивного результату',
            minAllowed: -1,
            maxAllowed: 0,
         },
         {
            code: 'Utn',
            name: 'Корисність дійснонегативного результату',
            minAllowed: 0,
            maxAllowed: 1,
         },
         {
            code: 'Ufn',
            name: 'Корисність хибнонегативного результату',
            minAllowed: -1,
            maxAllowed: 0,
         }
      ];

      // @ts-ignore
      this.strategies = [
         {
            id: 0,
            name: 'Одна діагностична технологія'
         },
         {
            id: 1,
            name: 'Діагностичні спектри рівні, верифікація негативного результату і-того тесту'
         },
         {
            id: 2,
            name: 'Діагностичні спектри рівні, верифікація позитивного результату і-того тесту'
         },
         {
            id: 3,
            name: 'Діагностичні спектри різні і не перетинаються, верифікація негативного результату і-того тесту'
         },
         {
            id: 4,
            name: 'Діагностичні спектри різні і не перетинаються, верифікація позитивного результату і-того тесту'
         },
         {
            id: 5,
            name: 'Діагностичний спектр j-того тесту входить до діагностичного спектру і-того тесту, верифікація негативного результату і-того тесту'
         },
         {
            id: 6,
            name: 'Діагностичний спектр j-того тесту входить до діагностичного спектру і-того тесту, верифікація позитивного результату і-того тесту'
         },
         {
            id: 7,
            name: 'Діагностичний спектр і-того тесту входить до діагностичного спектру j-того тесту, верифікація негативного результату і-того тесту'
         },
         {
            id: 8,
            name: 'Діагностичний спектр і-того тесту входить до діагностичного спектру j-того тесту, верифікація позитивного результату і-того тесту'
         },
         {
            id: 9,
            name: 'Діагностичні спектри частково перетинаються, верифікація негативного результату і-того тесту'
         },
         {
            id: 10,
            name: 'Діагностичні спектри частково перетинаються, верифікація позитивного результату і-того тесту'
         },
         {
            id: 11,
            name: 'Паралельна діагностика (діагностичні спектри частково перетинаються)'
         },

      ];

      this.strategies.forEach(s => {
         s.paramsBounds = this.parameters.map((p: ParameterWithBounds) => {
            return {
               ...p,
               minBound: p.minAllowed,
               maxBound: p.maxAllowed
            };
         });
      });

      this.compareList1 = this.strategies;
      this.compareList2 = this.strategies;

      this.strategy1 = {};
      this.strategy2 = {};
   }

   compare() {
      this.currentParamCode = 'Pi';

      this.buildChart(this.currentParamCode);

      this.compareClicked = true;
   }

   buildChart(currentParamCode) {
      console.log(this.strategy1.id);
      console.log(this.strategy2.id);

      const parameter: Parameter = this.parameters.find(p => p.code === currentParamCode);
      let data = [];
      let xLevels = [];
      let x = [];
      let i = 0;
      const step = (parameter.maxAllowed - parameter.minAllowed) / this.L;
      let lastValue = parameter.minAllowed;

      while (i < this.L - 1) {
         lastValue += step;
         xLevels.push(lastValue);
         i++;
      }
      
      xLevels.forEach(point => {
         let j = 0;
         while (j < this.W) {
            x.push(point);
            j++;
         }
      });

      data = x.map(value => {
         this.callCount = 0;

         return [
            value,
            this.calcRelation(parameter, value)
         ];
      });

      this.chartOptions = {
         credits: {
            enabled: false
         },

         chart: {
            type: 'scatter',
            zoom: 'xy'
         },

         title: {
            text: ''
         },

         xAxis: {
            title: {
               text: ''
            }
         },

         yAxis: {
            title: {
               text: 'Відношення витрат першої і другої стратегій'
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
            data
         }]
      };
   }

   selectStrategy(strategyNumber: number, strategy: Strategy) {
      console.log('strategyNumber: ', strategyNumber);
      console.log('strategy: ', strategy);
      this['strategy' + strategyNumber] = strategy;
      this.compareClicked = false;
   }

   boundedRandom(min, max) {
      return min + (max - min) * Math.random();
   }

   logError(e) {
      console.error('error: ', e);
   }

   randomize_params(strategy: Strategy, currentParamCode: string, currentParamValue: number): number[] {
      let Pi: number;
      let Pj: number;
      let Pij: number;
      let isValueCorrect: boolean;
      let minBound: number;
      let maxBound: number;
      let iterCount: number;


      // @ts-ignore
      const paramsValues = [];

      strategy.paramsBounds.forEach(p => {
         if (p.code !== currentParamCode) {
            paramsValues.push(this.boundedRandom(p.minBound, p.maxBound));
         } else {
            paramsValues.push(currentParamValue);
         }
      });

      Pi = paramsValues[0];
      Pj = paramsValues[1];

      if (currentParamCode === 'Pi') {
         minBound = strategy.paramsBounds[1].minBound;
         maxBound = strategy.paramsBounds[1].maxBound;

         switch (strategy.id) {
            case 0:
            case 1:
            case 2: {
               break;
            }

            case 3:
            case 4: {
               if ((1 - Pi) < minBound) {
                  console.log('strategy.paramsBounds: ', strategy.paramsBounds);
                  this.logError(`bounds logical error:\nstrategy: ${strategy.id}\nparameter: ${currentParamCode}`);
               } else if ((1-Pi) < maxBound) {
                  maxBound = (1-Pi);
               }

               Pj = this.boundedRandom(minBound, maxBound);
               break;
            }

            case 5:
            case 6: {
               if (Pi < minBound) {
                  this.logError(`bounds logical error:\nstrategy: ${strategy.id}\nparameter: ${currentParamCode}`);
               } else if (Pi < maxBound) {
                  maxBound = Pi;
               }

               Pj = this.boundedRandom(minBound, maxBound);
               break;
            }

            case 7:
            case 8: {
               if (Pj < minBound) {
                  this.logError(`bounds logical error:\nstrategy: ${strategy.id}\nparameter: ${currentParamCode}`);
               } else if (Pj < maxBound) {
                  maxBound = Pj;
               }

               Pi = this.boundedRandom(minBound, maxBound);
               break;
            }

            case 9:
            case 10:
            case 11: {
               iterCount = 0;
               Pij = Pi * Math.random();

               while (!isValueCorrect) {
                  Pj = Pij + (1 - Pi) * Math.random();

                  if (Pj > strategy.paramsBounds[1].minBound &&
                     Pj < strategy.paramsBounds[1].maxBound) {

                     isValueCorrect = true;
                  }
                  iterCount++;
                  if (iterCount > 500) {
                     this.logError(`value generation error:\nstrategy: ${strategy.id}\nparameter: ${currentParamCode}`);
                  }
               }
               break;
            }
         }

      } else if (currentParamCode === 'Pj') {

      } else {
         isValueCorrect = false;

         switch (strategy.id) {
            case 0:
            case 1:
            case 2: {
               break;
            }

            case 3:
            case 4: {
               while (!isValueCorrect) {
                  Pj = (1 - Pi) * Math.random();

                  if (Pj > strategy.paramsBounds[1].minBound &&
                      Pj < strategy.paramsBounds[1].maxBound) {

                     isValueCorrect = true;
                  }
               }
               break;
            }

            case 5:
            case 6: {
               while (!isValueCorrect) {
                  Pj = Pi * Math.random();

                  if (Pj > strategy.paramsBounds[1].minBound &&
                     Pj < strategy.paramsBounds[1].maxBound) {

                     isValueCorrect = true;
                  }
               }


               Pj = Pi * Math.random();
               break;
            }

            case 7:
            case 8: {
               while (!isValueCorrect) {
                  Pi = Pj * Math.random();

                  if (Pi > strategy.paramsBounds[0].minBound &&
                     Pi < strategy.paramsBounds[0].maxBound) {

                     isValueCorrect = true;
                  }
               }
               break;
            }

            case 9:
            case 10:
            case 11: {
               Pij = Pi * Math.random();

               while (!isValueCorrect) {
                  Pj = Pij + (1 - Pi) * Math.random();

                  if (Pi > strategy.paramsBounds[0].minBound &&
                     Pi < strategy.paramsBounds[0].maxBound) {

                     isValueCorrect = true;
                  }
               }
               break;
            }
         }
      }

      if (Pij) {
         paramsValues.push(Pij);
      }

      paramsValues[0] = Pi;
      paramsValues[1] = Pj;

      return paramsValues;
   }

   calcRelation(parameter: Parameter, value: number) {
      const params1 = this.randomize_params(this.strategy1, parameter.code, value);
      const params2 = this.randomize_params(this.strategy2, parameter.code, value);

      // @ts-ignore
      const EUi = this['EU' + this.strategy1.id](...params1);
      const EUj = this['EU' + this.strategy2.id](...params2);
      const relation = EUi / EUj;

      // todo Why does it produce outstanding values? Do we need these bounds?
      if (relation < 10 && relation > -10) {
      // if (true) {
         return relation;
      } else {
         this.callCount++;
         
         if (this.callCount > 100) {
            console.log('params2: ', params2);
         }

         return this.calcRelation(parameter, value);
      }
   }

   EU0(Pi, Pj, Sei, Sej, Spi, Spj, Utp, Ufp, Utn, Ufn) {
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
      if (Pj > 1-Pi) {
         this.logError(3);
      }
      // ni v n i
      return Pi*Sei*Utp + (1-Pi)*(1-Spi)*Ufp + (1-Pi)*Spi*(Pj/(1-Pi)*Sej*Utp + (1-Pi-Pj)/(1-Pi)*(1-Spj)*Ufp + (1-Pi-Pj)/(1-Pi)*Spj*Utn +
         Pj/(1-Pi)*(1-Sej)*Ufn) + Pi*(1-Sei)*(Spj*Utn + (1-Spj)*Ufp);
   }

   EU4(Pi, Pj, Sei, Sej, Spi, Spj, Utp, Ufp, Utn, Ufn) {
      if (Pj > 1-Pi) {
         this.logError(4);
      }
      // ni v p i
      return (1-Pi)*Spi*Utn + Pi*(1-Sei)*Ufn + (1-Pi)*(1-Spi)*(Pj/(1-Pi)*Sej*Utp + (1-Pi-Pj)/(1-Pi)*(1-Spj)*Ufp +
         (1-Pi-Pj)/(1-Pi)*Spj*Utn + Pj/(1-Pi)*(1-Sej)*Ufn) + Pi*Sei*(Sej*Utn + (1-Sej)*Ufp);
   }

   EU5(Pi, Pj, Sei, Sej, Spi, Spj, Utp, Ufp, Utn, Ufn) {
      if (Pj > Pi) {
         this.logError(5);
      }
      // j<i v n i
      return Pi*Sei*Utp + (1-Pi)*(1-Spi)*Ufp + (1-Pi)*Spi*(Spj*Utn + (1-Spj)*Ufn) + Pi*(1-Sei)*((Pj/Pi)*Sej)*Utp +
         (Pi-Pj)/Pi*(1-Spj)*Ufp + (Pi-Pj)/Pi*Spj*Utn + (Pj/Pi)*(1-Sej)*Ufn;
   }

   EU6(Pi, Pj, Sei, Sej, Spi, Spj, Utp, Ufp, Utn, Ufn) {
      if (Pj > Pi) {
         this.logError(6);
      }
      // j<i v p i
      return (1-Pi)*Spi*Utn + Pi*(1-Sei)*Ufn + (1-Pi)*(1-Spi)*(Spj*Utn + (1-Spj)*Ufn) +
         Pi*Sei*((Pj/Pi)*Sej*Utp + (Pi-Pj)*Pi*(1-Spj)*Ufp + (Pi-Pj)/Pi*Spj*Utn + (Pj/Pi)*(1-Sej)*Ufn);
   }

   EU7(Pi, Pj, Sei, Sej, Spi, Spj, Utp, Ufp, Utn, Ufn) {
      if (Pi > Pj) {
         this.logError(7);
      }
      // i<j v n i
      return Pi*Sei*Utp + (1-Pi)*(1-Spi)*Ufp +
         (1-Pi)*Spi*((Pj-Pi)/(1-Pi)*Sej)*Utp + (1-Pj)/(1-Pi)*(1-Spj)*Ufp + (1-Pj)/(1-Pi)*Spj*Utn + (Pj-Pi)/(1-Pi)*(1-Sej)*Ufn +
         Pi*(1-Sei)*(Sej*Utp + (1-Sej)*Ufn);
   }

   EU8(Pi, Pj, Sei, Sej, Spi, Spj, Utp, Ufp, Utn, Ufn) {
      if (Pi > Pj) {
         this.logError(8);
      }
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
      if (Pij > Pi || Pj > (Pij + 1 - Pi)) {
         this.logError(9)
      }
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
      if (Pij > Pi || Pj > (Pij + 1 - Pi)) {
         this.logError(10)
      }
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

   EU11(Pi, Pj, Sei, Sej, Spi, Spj, Utp, Ufp, Utn, Ufn, Pij) {
      if (Pij > Pi || Pj > (Pij + 1 - Pi)) {
         this.logError(11)
      }
      // i
      return (Pi-Pij)*(1-Sei)*Spj*Utn +
            Pij*(1-Sei)*(1-Sej)*Ufn +
            Pij*(1-Sei)*Sej*Utp +
            (Pi-Pij)*(1-Sei)*(1-Spj)*Ufp +

            (Pi-Pij)*Sei*Spj*Utn +
            Pij*Sei*(1-Sej)*Ufn +
            Pij*Sei*Sej*Utp +
            (Pi-Pij)*Sei*(1-Spj)*Ufp +

            (1-Pj-Pi+Pij)*Spi*Spj*Utn +
            (Pj-Pij)*Spi*(1-Sej)*Ufn +
            (Pj-Pij)*Spi*Sej*Utp +
            (1-Pi-Pj+Pij)*Spi*(1-Sej)*Ufp +

            (1-Pi-Pj+Pij)*(1-Spi)*Spj*Utn +
            (Pi-Pij)*(1-Spi)*(1-Sej)*Ufn +
            (Pi-Pij)*(1-Spi)*Sej*Utp +
            (1-Pi-Pj+Pij)*(1-Spi)*(1-Spj)*Ufp;
   }
}

interface Strategy {
   id?: number;
   name?: string;
   paramsBounds?: ParameterWithBounds[];
}

interface ParameterWithValue extends ParameterWithBounds {
   value: number;
}

interface ParameterWithBounds extends Parameter {
   minBound: number;
   maxBound: number;
}

interface Parameter {
   code: string;
   name: string;
   minAllowed: number;
   maxAllowed: number;
}
