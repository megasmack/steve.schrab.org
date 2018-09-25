import { Component, OnInit, Input, ElementRef, HostBinding } from '@angular/core';

let offSetTime = 1;

@Component({
  selector: 'ss-skill-circle',
  templateUrl: './skill-circle.component.html',
  styleUrls: ['./skill-circle.component.scss']
})
export class SkillCircleComponent implements OnInit {
  @HostBinding('class.skill-circle')
    hostClass = true;
  @HostBinding('class.skill-circle--maxed')
    maxed = false;

  @Input() skill: string;
  @Input() percentage: number;

  constructor(public el: ElementRef) { }

  ngOnInit() {
    const circle: NodeListOf<SVGElement> = this.el.nativeElement.querySelectorAll('.skill-circle--amount');
    const circleLow: SVGElement = this.el.nativeElement.querySelector('.skill-circle--low');
    const circleMedium: SVGElement = this.el.nativeElement.querySelector('.skill-circle--medium');
    const circleHigh: SVGElement = this.el.nativeElement.querySelector('.skill-circle--high');
    const radius: number = parseFloat(circleHigh.getAttribute('r'));
    const circumference: number = 2 * Math.PI * radius;

    const timer = offSetTime * 500;
    const circleLength = circle.length;

    for (let x = 0; x < circleLength; x++) {
      // Set the initial strokeDashArray and strokeDashoffset to the circumference
      circle[x].style.strokeDasharray = `${circumference}`;
      circle[x].style.strokeDashoffset = `${circumference}`;

      setTimeout(() => {
        // Set strokeDashoffset to a percentage of the circumference
        circle[x].style.strokeDashoffset = `${circumference * (1 - (this.percentage * .01))}`;

        if (this.percentage >= 50) {
          circleLow.style.opacity = `${0}`;
          circleMedium.style.opacity = `${(100 - this.percentage) * .02}`;
        } else {
          circleHigh.style.opacity = `${0}`;
          circleLow.style.opacity = `${(100 - ((this.percentage * 50) / 100)) * .01}`;
        }

        if (this.percentage === 100) {
          this.maxed = true;
        }

        // if (this.percentage >= 66) {
        //   circleHigh.style.opacity = `${1}`;
        //   circleMedium.style.opacity = `${1}`;
        //   circleLow.style.opacity = `${1}`;
        // } else if  (this.percentage >= 33 && this.percentage < 66) {
        //   circleHigh.style.opacity = `${0}`;
        //   circleMedium.style.opacity = `${1}`;
        //   circleLow.style.opacity = `${1}`;
        // } else {
        //   circleHigh.style.opacity = `${0}`;
        //   circleMedium.style.opacity = `${0}`;
        //   circleLow.style.opacity = `${1}`;
        // }
      }, timer);
    }

    // Increment timer for each instance of the component
    offSetTime++;
  }
}
