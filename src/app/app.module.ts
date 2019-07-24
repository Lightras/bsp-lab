import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';

import { AppComponent } from './app.component';
import {FormsModule} from '@angular/forms';
import {CharacteristicsModule} from './characteristics/characteristics.module';
import {StrategiesComponent} from './strategies/strategies.component';
import {HighchartsChartModule} from 'highcharts-angular';

@NgModule({
   declarations: [
      AppComponent,
      StrategiesComponent,
   ],
   imports: [
      BrowserModule,
      FormsModule,
      NgSelectModule,
      CharacteristicsModule,
      HighchartsChartModule
   ],
   providers: [],
   bootstrap: [AppComponent]
})
export class AppModule { }
