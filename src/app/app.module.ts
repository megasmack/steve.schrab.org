import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DropClimberComponent } from './drop-climber/drop-climber.component';
import { ResumeComponent } from './resume/resume.component';
import { SkillCircleComponent } from './skill-circle/skill-circle.component';

@NgModule({
  declarations: [
    AppComponent,
    DropClimberComponent,
    ResumeComponent,
    SkillCircleComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
