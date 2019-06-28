import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';

import { AppComponent } from './app.component';
import { TestsInputComponent } from './tests-input/tests-input.component';
import {FormsModule} from '@angular/forms';
import {HighchartsChartModule} from 'highcharts-angular';
import { RocComponent } from './roc/roc.component';
import { TreesComponent } from './trees/trees.component';

@NgModule({
  declarations: [
    AppComponent,
    TestsInputComponent,
    RocComponent,
    TreesComponent
  ],
   imports: [
      BrowserModule,
      FormsModule,
      HighchartsChartModule,
      NgSelectModule
   ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
