import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TestsInputComponent } from './tests-input/tests-input.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    TestsInputComponent
  ],
   imports: [
      BrowserModule,
      FormsModule
   ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
