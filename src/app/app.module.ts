import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TestsInputComponent } from './tests-input/tests-input.component';
import {FormsModule} from '@angular/forms';
import {HighchartsChartModule} from 'highcharts-angular';
import { RocComponent } from './roc/roc.component';

@NgModule({
  declarations: [
    AppComponent,
    TestsInputComponent,
    RocComponent
  ],
   imports: [
      BrowserModule,
      FormsModule,
      HighchartsChartModule
   ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
