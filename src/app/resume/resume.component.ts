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
  resumeWork;
  resumeSkills;

  constructor(public service: ResumeService) { }

  ngOnInit() {
    this.getResume();
  }

  getResume() {
    this.service.getJSON().subscribe(data => {
      this.resumeData = data;
      this.resumeWork = this.resumeData.work;
      this.resumeSkills = this.resumeData.skills;
    },
    err => {
      console.log('error: ', err);
    });
  }

}
