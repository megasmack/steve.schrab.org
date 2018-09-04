import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ResumeComponent } from './resume/resume.component';

export const routes: Routes = [
  {
    path: '',
    component: ResumeComponent,
    data: {
      title: 'Steve Schrab',
    },
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
