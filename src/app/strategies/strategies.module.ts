import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {StrategiesComponent} from './strategies.component';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {HighchartsChartModule} from 'highcharts-angular';

@NgModule({
   declarations: [
   ],
   imports: [
      BrowserModule,
      FormsModule,
      CommonModule,
      NgSelectModule,
      HighchartsChartModule
   ]
})
export class StrategiesModule { }
