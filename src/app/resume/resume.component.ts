import { Component, OnInit } from '@angular/core';

import { ResumeService } from './resume.service';

@Component({
  selector: 'ss-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.scss'],
  providers: [ResumeService]
})
export class ResumeComponent implements OnInit {
  resumeBasics;
  resumeWork;
  resumeSkills;
  resumeEdu;
  resumeAwards;

  constructor(public service: ResumeService) { }

  ngOnInit() {
    this.getResume();
  }

  getResume() {
    this.service.getJSON().subscribe(data => {
      this.resumeBasics = data.basics;
      this.resumeWork = data.work;
      this.resumeSkills = data.skills;
      this.resumeEdu = data.education;
      this.resumeAwards = data.awards;
    },
    err => {
      console.log('error: ', err);
    });
  }

}
