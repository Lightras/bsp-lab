import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import addMore from 'highcharts/highcharts-more';
import exporting from 'highcharts/modules/exporting';
import deepcopy from 'ts-deepcopy';
import {EuFormulasService} from './eu-formulas.service';
import {InitialState} from './initial-state';
import {Parameter, ParameterWithBounds, Period, Strategy} from '../interfaces';

addMore(Highcharts);
exporting(Highcharts);

@Component({
   selector: 'app-strategies',
   templateUrl: './strategies.component.html',
   styleUrls: ['./strategies.component.sass']
})
export class StrategiesComponent implements OnInit {
   constructor(
      private euFunctions: EuFormulasService,
      private _init: InitialState
   ) { }

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

   L = 500;
   W = 5;
   isShowPeriodChart: boolean;
   periodsChartOptions: any = {

      credits: {
         enabled: false
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
               x: -400,
               y: 0
            }
         }
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
      this.parameters = this._init.parameters;
      this.strategies = this._init.strategies;

      this.periodsChartOptions1 = deepcopy(this.periodsChartOptions);
      this.periodsChartOptions2 = deepcopy(this.periodsChartOptions);

      this.periodsChartOptions1.yAxis.min = -1;
      this.periodsChartOptions1.yAxis.max = 1;
      this.periodsChartOptions1.yAxis.title.text = 'Очікувана корисність першої стратегії';

      this.periodsChartOptions2.yAxis.min = -1;
      this.periodsChartOptions2.yAxis.max = 1;
      this.periodsChartOptions2.yAxis.title.text = 'Очікувана корисність другої стратегії';

      this.periodsChartOptions.yAxis.title.text = 'Відношення очікуваних корисностей першої і другої стратегій';

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

      // this.testFunc();
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

      // this.euChartUpdateFlag = true;
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

      this.euChartUpdateFlag = true;
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
                  menuItems: ['downloadPNG', 'downloadPDF', 'separator', 'printChart'],
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
      const EUi = this.euFunctions['EU' + this.currentPeriod.strategy1.id](...params1);
      const EUj = this.euFunctions['EU' + this.currentPeriod.strategy2.id](...params2);
      const relation = EUi / EUj;

      // todo Why does it produce outstanding values? Do we need these bounds?
      if (relation < 10 && relation > -10) {
      // if (true) {
         return [relation, EUi, EUj];
      } else {
         return this.calcRelation(parameter, value);
      }
   }

   private logError(e) {
      console.error('error: ', e);
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
      this.comparePeriods();
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
