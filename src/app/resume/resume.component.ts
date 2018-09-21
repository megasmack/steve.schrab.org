import { Component, OnInit } from '@angular/core';

import { ResumeService } from './resume.service';

@Component({
  selector: 'ss-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.scss'],
  providers: [ResumeService]
})
export class ResumeComponent implements OnInit {
  resumeData;
  resumeSummary;
  resumeWork;
  resumeSkills;

  constructor(public service: ResumeService) { }

  ngOnInit() {
    this.getResume();
  }

  getResume() {
    this.service.getJSON().subscribe(data => {
      this.resumeSummary = data.basics.summary;
      this.resumeWork = data.work;
      this.resumeSkills = data.skills;
    },
    err => {
      console.log('error: ', err);
    });
  }

}
