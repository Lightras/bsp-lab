import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import addMore from 'highcharts/highcharts-more';
import exporting from 'highcharts/modules/exporting'
import deepcopy from 'ts-deepcopy';

addMore(Highcharts);
exporting(Highcharts);

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

   compareClicked = false;
   isCompareMode = false;

   chartOptions1: any;
   chartOptions2: any;

   currentPeriod: Period;
   periods: Period[];
   newPeriod: Period;
   isAddPeriodMode: boolean;
   isAllowAddPeriod: boolean;
   isAllowComparePeriods: boolean;

   callCount = 0;

   L = 500;
   W = 5;
   isShowPeriodChart: boolean;
   periodsChartOptions: any = {

      credits: {
         enabled: false
      },

      chart: {
         type: 'columnrange',
         inverted: true,
         width: 450
      },

      title: {
         text: ''
      },

      xAxis: {
         categories: []
      },

      yAxis: {
         title: {
            text: ''
         }
      },

      tooltip: {
         valueSuffix: '',
         pointFormat: 'x: <b>{point.x:.3f}</b><br/>y: <b>{point.y:.3f}</b><br/>'
      },

      plotOptions: {
         columnrange: {
            dataLabels: {
               enabled: true,
               format: ''
            }
         }
      },

      legend: {
         enabled: false
      },

      series: [{
         name: '',
         data: []
      }]

   };

   periodsChartOptions1: any;
   periodsChartOptions2: any;
   euChartUpdateFlag: boolean;

   ngOnInit() {
      this.periodsChartOptions1 = deepcopy(this.periodsChartOptions);
      this.periodsChartOptions2 = deepcopy(this.periodsChartOptions);

      this.periodsChartOptions1.yAxis.min = -1;
      this.periodsChartOptions1.yAxis.max = 1;
      this.periodsChartOptions1.yAxis.title.text = 'Очікувана корисність першої стратегії';

      this.periodsChartOptions2.yAxis.min = -1;
      this.periodsChartOptions2.yAxis.max = 1;
      this.periodsChartOptions2.yAxis.title.text = 'Очікувана корисність другої стратегії';

      this.periodsChartOptions.yAxis.title.text = 'Відношення очікуваних корисностей першої і другої стратегій';

      this.parameters = [
         {
            code: 'Pi',
            name: 'Діагностичний спектр і-того тесту',
            minAllowed: 0,
            maxAllowed: 1,
         },
         {
            code: 'Pj',
            name: 'Діагностичний спектр j-того тесту',
            minAllowed: 0,
            maxAllowed: 1,
         },
         {
            code: 'Sei',
            name: 'Чутливість і-того тесту',
            minAllowed: 0,
            maxAllowed: 1,
         },
         {
            code: 'Sej',
            name: 'Чутливість j-того тесту',
            minAllowed: 0,
            maxAllowed: 1,
         },
         {
            code: 'Spi',
            name: 'Специфічність і-того тесту',
            minAllowed: 0,
            maxAllowed: 1,
         },
         {
            code: 'Spj',
            name: 'Специфічність j-того тесту',
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

      this.compareList1 = deepcopy(this.strategies);
      this.compareList2 = deepcopy(this.strategies);

      this.currentPeriod = {
         name: '',
         strategy1: null,
         strategy2: null
      };
      
      this.periods = [this.currentPeriod];

      this.testFunc();
   }
   
   

   compareModeOn() {
      this.isCompareMode = true;
   }

   compare() {
      this.currentParamCode = 'Pi';

      this.buildChart(this.currentParamCode);

      this.isAllowAddPeriod = true;
      this.isAllowComparePeriods = this.periods.length > 1;
      this.compareClicked = true;

      this.euChartUpdateFlag = true;
   }

   buildChart(currentParamCode) {
      const parameter: Parameter = this.parameters.find(p => p.code === currentParamCode);
      let data = [];
      let data1 = [];
      let data2 = [];
      let xLevels = [];
      let x = [];
      let i = 0;
      const step = parseFloat(((parameter.maxAllowed - parameter.minAllowed) / this.L).toFixed(3));
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

      x.forEach(value => {
         const relationValues = this.calcRelation(parameter, value);

         data.push([value, relationValues[0]]);
         data1.push([value, relationValues[1]]);
         data2.push([value, relationValues[2]]);
      });
      
      console.log('data1: ', data1);

      this.currentPeriod.periodData = {
         EUr: [Math.min(... data.map(p => p[1])), Math.max(... data.map(p => p[1]))],
         EU1: [Math.min(... data1.map(p => p[1])), Math.max(... data2.map(p => p[1]))],
         EU2: [Math.min(... data2.map(p => p[1])), Math.max(... data2.map(p => p[1]))]
      };

      this.chartOptions = this.buildChartOptions(data);
      this.chartOptions1 = this.buildChartOptions(data1);
      this.chartOptions2 = this.buildChartOptions(data2);

      this.chartOptions1.yAxis.title.text = 'Очікувана корисність першої стратегії';
      this.chartOptions2.yAxis.title.text = 'Очікувана корисність другої стратегії';
   }

   buildChartOptions(data) {
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

      return {
         lang: {
            downloadPDF: 'Завантажити в PDF',
            contextButtonTitle: 'Опції завантаження',
            downloadPNG: 'Завантажити як зображення',
            printChart: 'Роздрукувати',
            viewFullscreen: 'Показати на весь екран'
         },

         credits: {
            enabled: false
         },

         chart: {
            type: 'scatter',
            zoom: 'xy'
         },

         exporting: {
            enabled: true,
            buttons: {
               contextButton: {
                  menuItems: ['downloadPNG', 'downloadPDF', 'separator', 'printChart', 'viewFullscreen'],
                  symbol: 'download',
                  x: -550,
                  y: 0
               }
            }
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

         tooltip: {
            pointFormat: 'x: <b>{point.x:.3f}</b><br/>y: <b>{point.y:.3f}</b><br/>'
         },

         plotOptions: {
            scatter: {
               marker: {
                  radius: 1.4
               }
            }
         },

         series: [{
            type: 'scatter',
            stickyTracking: true,
            threshold: 10,
            name: '',
            data
         }]
      };
   }

   selectStrategy(strategyNumber: number, strategy: Strategy) {
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
      }

      if (Pij) {
         paramsValues.push(Pij);
      }

      paramsValues[0] = Pi;
      paramsValues[1] = Pj;

      return paramsValues;
   }

   calcRelation(parameter: Parameter, value: number) {
      const params1 = this.randomize_params(this.currentPeriod.strategy1, parameter.code, value);
      const params2 = this.randomize_params(this.currentPeriod.strategy2, parameter.code, value);

      // @ts-ignore
      const EUi = this['EU' + this.currentPeriod.strategy1.id](...params1);
      const EUj = this['EU' + this.currentPeriod.strategy2.id](...params2);
      const relation = EUi / EUj;

      // todo Why does it produce outstanding values? Do we need these bounds?
      if (relation < 10 && relation > -10) {
      // if (true) {
         return [relation, EUi, EUj];
      } else {
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

   comparePeriods() {
      this.isCompareMode = true;

      this.periodsChartOptions.xAxis.categories = this.periods.map(p => p.name);
      this.periodsChartOptions.series[0].data = this.periods.map(p => p.periodData.EUr);

      this.periodsChartOptions1.xAxis.categories = this.periods.map(p => p.name);
      this.periodsChartOptions1.series[0].data = this.periods.map(p => p.periodData.EU1);

      this.periodsChartOptions2.xAxis.categories = this.periods.map(p => p.name);
      this.periodsChartOptions2.series[0].data = this.periods.map(p => p.periodData.EU2);

      this.isShowPeriodChart = true;
   }

   finishComparePeriods() {
      this.isCompareMode = true;
      console.log('this.isCompareMode: ', this.isCompareMode);
      this.isShowPeriodChart = false;
   }

   testFunc() {
      this.currentPeriod = {
         name: 'default',
         strategy1: this.strategies[0],
         strategy2: this.strategies[1]
      };

      this.periods = [this.currentPeriod, this.currentPeriod, this.currentPeriod, this.currentPeriod, this.currentPeriod];

      this.compare();
      // this.comparePeriods();
   }

   addPeriodModeOn() {
      this.newPeriod = {
         name: '',
         strategy1: this.currentPeriod.strategy1,
         strategy2: this.currentPeriod.strategy2
      };

      this.isAddPeriodMode = true;
   }

   addPeriod() {
      this.isCompareMode = true;
      this.periods = [...this.periods, deepcopy(this.newPeriod)];
      this.currentPeriod = this.periods[this.periods.length - 1];

      this.compareClicked = false;
      this.isAddPeriodMode = false;
      this.isAllowAddPeriod = false;
   }

   cancelAddPeriod() {
      this.isAddPeriodMode = false;
   }

   selectPeriod(period) {
      this.currentPeriod = period;
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

interface Period {
   name: string;

   strategy1: Strategy;
   strategy2: Strategy;

   periodData?: {
      EUr: [number, number],
      EU1: [number, number],
      EU2: [number, number]
   };
}
