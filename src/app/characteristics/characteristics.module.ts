import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TestsInputComponent} from './tests-input/tests-input.component';
import {RocComponent} from './roc/roc.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HighchartsChartModule} from 'highcharts-angular';

@NgModule({
   declarations: [
      TestsInputComponent,
      RocComponent
   ],
   exports: [
      TestsInputComponent
   ],
   imports: [
      BrowserModule,
      FormsModule,
      CommonModule,
      NgSelectModule,
      HighchartsChartModule
   ]
})
export class CharacteristicsModule { }
