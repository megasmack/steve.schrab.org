import { Component, OnInit, Input, ElementRef } from '@angular/core';

let offSetTime = 1;

@Component({
  selector: 'ss-skill-circle',
  templateUrl: './skill-circle.component.html',
  styleUrls: ['./skill-circle.component.scss']
})
export class SkillCircleComponent implements OnInit {

  @Input() skill: string;
  @Input() percentage: number;

  private circle: NodeListOf<SVGElement>;
  private radius: number;
  private circumference: number;

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
      }, timer);
    }

    // Increment timer for each instance of the component
    offSetTime++;
  }
}
