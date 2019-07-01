import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
   selector: 'app-tests-input',
   templateUrl: './tests-input.component.html',
   styleUrls: ['./tests-input.component.sass']
})
export class TestsInputComponent implements OnInit {

   constructor(
      private dc: ChangeDetectorRef
   ) { }

   showCurves: boolean;

   tests: Test[];
   samples: boolean[];
   resultsType: 'binary' | 'continuous';
   cutOff: number;

   testTypes: any[];

   newTest: boolean[];
   newSample: NewSample;

   showInputRow: boolean;
   showInputColumn: boolean;
   saveDisabled: boolean;

   min: number;
   max: number;
   stepsNumber: number;
   cutOffsArray: number[];
   distances: number[] = [];
   optimalCutOff: {
      value: number;
      distance: number;
      se: number;
      sp: number;
   };

   currentInputType: 'row' | 'column';

   ngOnInit() {
      this.testTypes = [
         {
            name: 'binary',
            label: 'Бінарний'
         },
         {
            name: 'continuous',
            label: 'Неперервний'
         }
      ];

      this.stepsNumber = 10;
      this.optimalCutOff = {
         value: null,
         distance: null,
         se: null,
         sp: null
      };

      // this.samples = [true, false, false, true, false];
      this.samples = [true];

      this.setTypeContinuous();
   }

   calculateAllTestsCharacteristics() {
      this.tests.forEach(test => this.calculateTestCharacteristics(test));
   }

   calculateTestCharacteristics(test: Test) {
      let results;

      if (this.resultsType === 'continuous') {
         results = test.results.map(r => r >= this.cutOff);
      } else {
         results = test.results;
      }

      test.TP = results.reduce((accum: any, val, i) => accum + (val && val === this.samples[i] ? 1 : 0), 0);
      test.FP = results.reduce((accum: any, val, i) => accum + (val && val !== this.samples[i] ? 1 : 0), 0);
      test.TN = results.reduce((accum: any, val, i) => accum + (!val && val === this.samples[i] ? 1 : 0), 0);
      test.FN = results.reduce((accum: any, val, i) => accum + (!val && val !== this.samples[i] ? 1 : 0), 0);

      test.characteristics = {
         ac: (test.TP + test.TN) / test.results.length,
         se: test.TP / (test.TP + test.FN),
         sp: test.TN / (test.TN + test.FP),
         ppv: test.TP / (test.TP + test.FP),
         npv: test.TN / (test.TN + test.FN),
         lrPositive: (test.TP / (test.TP + test.FN)) / (test.FP / (test.FP + test.TN)),
         lrNegative: (test.FN / (test.TP + test.FN)) / (test.TN / (test.FP + test.TN))
      };
   }

   refreshNewSample() {
      this.newSample = {
         control: null,
         testsResults: []
      };

      this.tests.forEach((test) => {
         this.newSample.testsResults.push(null);
      });
   }

   refreshNewTest() {
      this.newTest = [];

      this.samples.forEach(() => {
         this.newTest.push(null);
      });
   }

   checkSaveState(inputType?: string) {
      if (inputType === 'column') {
         this.saveDisabled = this.newTest.some(r => r === null);
      } else if (inputType === 'row') {
         this.saveDisabled =
            this.newSample.control === null ||
            this.newSample.testsResults.length &&
            this.newSample.testsResults.some(r => r === null || typeof r === 'undefined');
      } else {
         this.saveDisabled = true;
      }
   }

   addRow() {
      this.refreshNewSample();
      this.checkSaveState();

      this.showInputRow = true;
      this.currentInputType = 'row';
   }

   addTest() {
      this.refreshNewTest();
      this.checkSaveState();

      this.showInputColumn = true;
      this.currentInputType = 'column';
   }

   saveInput() {
      if (this.currentInputType === 'row') {
         this.saveRow();
      } else if (this.currentInputType === 'column') {
         this.saveTest();
      }
   }

   cancelInput() {
      this.showInputRow = false;
      this.showInputColumn = false;
   }

   saveRow() {
      this.samples.push(this.newSample.control);
      this.tests.forEach((test, i) => {
         test.results.push(this.newSample.testsResults[i]);
      });

      this.refreshNewSample();
      this.checkSaveState();

      this.calculateAllTestsCharacteristics();
   }

   saveTest() {
      this.tests.push({results: this.newTest});

      this.refreshNewTest();
      this.checkSaveState();

      this.calculateTestCharacteristics(this.tests.slice(-1)[0]);
   }

   setTestType(type: string) {
      if (type === 'binary') {
         this.setTypeBinary();
      } else if (type === 'continuous') {
         this.setTypeContinuous();
      }
      this.dc.detectChanges();
   }

   setTypeBinary() {
      // this.tests = [
      //    {
      //       results: [true, true, false, true, false]
      //    },
      //    {
      //       results: [false, true, false, true, true]
      //    }
      // ];

      this.tests = [];
      this.dc.detectChanges();
      this.resultsType = 'binary';
   }

   setTypeContinuous() {
      this.resultsType = 'continuous';

      // this.tests = [
      //    {
      //       results: [1, 17, 2, 13, 9]
      //    },
      //    {
      //       results: [3, 19, 2, 7, 8]
      //    }
      // ];

      this.tests = [];
      this.dc.detectChanges();
   }

   calculateOptimalPair() {
      this.min = Math.min(...this.tests.map(t => Math.min(... t.results as number[])));
      this.max = Math.max(...this.tests.map(t => Math.max(... t.results as number[])));

      this.cutOffsArray = [];
      
      let i = 0;
      const step = (this.max - this.min) / this.stepsNumber;
      while (i < this.stepsNumber) {
         this.cutOffsArray.push(this.min + i * step);
         i++;
      }
      this.cutOffsArray.push(this.max);

      this.tests.forEach(t => t.chartData = {x: [], y: []});

      this.cutOffsArray.forEach((cutOff, index) => {
         this.cutOff = cutOff;
         this.calculateAllTestsCharacteristics();

         this.tests.forEach(t => t.optimum = {distance: Number.POSITIVE_INFINITY});

         this.tests.forEach((t, j) => {
            const distance = Math.sqrt(Math.pow(1 - t.characteristics.se, 2) + Math.pow(1 - t.characteristics.sp, 2));
            if (distance < t.optimum.distance) {
               t.optimum = {
                  distance,
                  cutoff: cutOff,
                  se: t.characteristics.se,
                  sp: t.characteristics.sp
               };
            }

            this.tests[j].chartData.x.push(1 - t.characteristics.sp);
            this.tests[j].chartData.y.push(t.characteristics.se);
         });
      });

      console.log('this.tests: ', this.tests);
      this.showCurves = true;
   }

}

interface Test {
   results: (boolean | number)[];

   TP?: number;
   TN?: number;
   FP?: number;
   FN?: number;

   characteristics?: {
      ac: number;
      se: number;
      sp: number;
      ppv: number;
      npv: number;
      lrPositive: number;
      lrNegative: number;
      distance?: number;
   };

   optimum?: {
      cutoff?: number;
      distance?: number;
      se?: number;
      sp?: number;
   };

   chartData?: any;
   chartDataItem?: any;
}

interface NewSample {
   control: boolean;
   testsResults: boolean[];
}
