import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DropClimberComponent } from './drop-climber/drop-climber.component';

@NgModule({
  declarations: [
    AppComponent,
    DropClimberComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
