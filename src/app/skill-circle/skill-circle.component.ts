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

  private circle: SVGElement;
  private radius: number;
  private circumference: number;

  constructor(public el: ElementRef) { }

  ngOnInit() {
    this.circle = this.el.nativeElement.querySelector('.skill-circle--amount');
    this.radius = parseFloat(this.circle.getAttribute('r'));
    this.circumference = 2 * Math.PI * this.radius;

    const timer = offSetTime * 1000;

    // Set the initial strokeDashArray and strokeDashoffset to the circumference
    this.circle.style.strokeDasharray = `${this.circumference}`;
    this.circle.style.strokeDashoffset = `${this.circumference}`;

    // Set strokeDashoffset to a percentage of the circumference
    setTimeout(() => {
      this.circle.style.strokeDashoffset = `${this.circumference * (1 - (this.percentage * .01))}`;
    }, timer);

    // Increment timer for each instance of the component
    offSetTime++;
  }
}
