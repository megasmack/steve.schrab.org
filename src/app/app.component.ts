import { Component, OnInit } from '@angular/core';

import { ResumeService } from './resume/resume.service';

@Component({
  selector: 'ss-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ResumeService]
})
export class AppComponent implements OnInit {
  resumeBasics;

  constructor(public service: ResumeService) { }

  ngOnInit() {
    this.getResume();
  }

  getResume() {
    this.service.getJSON().subscribe(data => {
      this.resumeBasics = data.basics;
    },
    err => {
      console.log('error: ', err);
    });
  }
}
