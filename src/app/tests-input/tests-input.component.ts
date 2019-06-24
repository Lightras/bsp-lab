import { Component, OnInit } from '@angular/core';

@Component({
   selector: 'app-tests-input',
   templateUrl: './tests-input.component.html',
   styleUrls: ['./tests-input.component.sass']
})
export class TestsInputComponent implements OnInit {

   constructor() { }

   tests: Test[];
   samples: boolean[];
   resultsType: 'binary' | 'continuous';
   threshold: number;

   newTest: boolean[];
   newSample: NewSample;

   showInputRow: boolean;
   showInputColumn: boolean;
   saveDisabled: boolean;

   currentInputType: 'row' | 'column';

   ngOnInit() {
      this.resultsType = 'binary';

      this.tests = [
         {
            results: [true, true, false, true, false]
         },
         {
            results: [false, true, false, true, true]
         }
      ];

      this.samples = [true, false, false, true, false];

      this.refreshNewSample();
   }

   calculateAllTestsCharacteristics() {
      this.tests.forEach(test => this.calculateTestCharacteristics(test));
   }

   calculateTestCharacteristics(test: Test) {
      let results;

      if (this.resultsType === 'continuous') {
         results = test.results.map(r => r >= this.threshold);
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

      console.log('test: ', test);
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

   setTypeBinary() {
      this.resultsType = 'binary';
   }

   setTypeContinuous() {
      if (this.resultsType !== 'continuous') {
         this.resultsType = 'continuous';

         this.tests = [
            {
               results: [1, 17, 2, 13, 9]
            },
            {
               results: [3, 19, 2, 7, 8]
            }
         ];
      }
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
   };
}

interface NewSample {
   control: boolean;
   testsResults: boolean[];
}
