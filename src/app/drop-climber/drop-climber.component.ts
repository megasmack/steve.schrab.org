import { AfterViewInit, Component, ElementRef, OnDestroy } from '@angular/core';

export interface IClimber {
  x: number;
  y: number;
  width: number;
  height: number;
  startX: number;
  startY: number;
}

@Component({
  selector: 'ss-drop-climber',
  templateUrl: './drop-climber.component.html',
  styleUrls: ['./drop-climber.component.scss']
})
export class DropClimberComponent implements AfterViewInit, OnDestroy {

  private el: HTMLElement;

  // Actions
  private dragging = false;
  private wasDragged = false;
  public isResetting = false;
  public isClimbing = false;
  public isDropping = false;
  public isWalking = false;
  public get isDragging() {
    return this.dragging;
  }
  public set isDragging(value) {
    this.dragging = value;
    if (this.dragging) {
      document.body.classList.add('drop-climber-dragging');
    } else {
      document.body.classList.remove('drop-climber-dragging');
    }
  }

  // Math vars
  private xVelocity = 0;
  private rotation = 0;
  private mousePositionX: number;
  private mousePositionY: number;

  // Event vars
  private tiltAnimation: any;
  private audioCrash = new Audio();

  // Init Climber Object
  Climber: IClimber = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    startX: 0,
    startY: 0
  };

  get winHeight() {
    return document.documentElement.offsetHeight;
  }

  get winWidth() {
    return document.documentElement.offsetWidth;
  }

  constructor(private element: ElementRef) {
    this.onSelectStart = this.onSelectStart.bind(this);
    this.onStartDrag = this.onStartDrag.bind(this);
    this.onDrag = this.onDrag.bind(this);
    this.onStopDrag = this.onStopDrag.bind(this);
    this.tilt = this.tilt.bind(this);
    this.walkLeft = this.walkLeft.bind(this);
    this.climbBackUp = this.climbBackUp.bind(this);
    this.reset = this.reset.bind(this);
  }

  ngAfterViewInit() {
    this.el = this.element.nativeElement.querySelector('.climber');
    this.loadAudio();

    // Set up drag listeners
    this.el.addEventListener('mousedown', this.onStartDrag);
    this.el.addEventListener('touchstart', this.onStartDrag);
    window.addEventListener('selectstart', this.onSelectStart);
    window.addEventListener('mousemove', this.onDrag);
    window.addEventListener('touchmove', this.onDrag);
    window.addEventListener('mouseup', this.onStopDrag);
    window.addEventListener('touchend', this.onStopDrag);

    // Set up Climber dimensions/positions
    setTimeout(() => {
      this.Climber.width = this.el.offsetWidth;
      this.Climber.height = this.el.offsetHeight;
      this.Climber.startX = parseInt(window.getComputedStyle(this.el).getPropertyValue('left'), 10);
      this.Climber.startY = parseInt(window.getComputedStyle(this.el).getPropertyValue('top'), 10);
      console.log(this.Climber);
    });
  }

  ngOnDestroy() {
    window.removeEventListener('selectstart', this.onSelectStart);
    window.removeEventListener('mousemove', this.onDrag);
    window.removeEventListener('mouseup', this.onStopDrag);
    if (this.el) {
      this.el.removeEventListener('mousedown', this.onStartDrag);
      this.el.removeEventListener('transitionend', this.walkLeft);
      this.el.removeEventListener('transitionend', this.climbBackUp);
      this.el.removeEventListener('transitionend', this.reset);
    }
  }

  loadAudio() {
    this.audioCrash.src = '../../assets/drop-climber/8-bit-crash-1.mp3'; // https://www.audioblocks.com/royalty-free-audio/16+bit
    this.audioCrash.load();
  }

  // Prevent text selection during drag events
  onSelectStart(event) {
    if (this.isDragging) {
      event.preventDefault();
    }
  }

  // Init dragging
  onStartDrag(event) {
    this.isDragging = true;
    this.isResetting = false;
    this.tiltAnimation = requestAnimationFrame(this.tilt);
  }

  // While dragging
  onDrag(event) {
    if (this.isDragging) {
      this.mousePositionX = event.clientX || event.targetTouches[0].pageX;
      this.mousePositionY = event.clientY || event.targetTouches[0].pageY;
      this.wasDragged = true;
    }
  }

  // Stop dragging
  onStopDrag() {
    if (this.wasDragged) {
      this.isDragging = false;
      cancelAnimationFrame(this.tiltAnimation);

      this.drop();
    }
  }

  msToSize(size, ms) {
    const msPerSize = ms; // How much ms per height
    let time = size * msPerSize;
    time = Math.floor(time);
    return time;
  }

  // Sigmoid function
  // https://uxdesign.cc/how-to-fix-dragging-animation-in-ui-with-simple-math-4bbc10deccf7
  sigmoid(x) {
    return (x / (1 + Math.abs(x)));
  }

  // Tilt the rotation of the Climber based on drag momentum
  tilt() {
    if (this.isDragging) {
      this.xVelocity = (this.mousePositionX - this.Climber.x);

      this.Climber.x = this.mousePositionX;
      this.Climber.y = this.mousePositionY;

      this.rotation = this.rotation * 0.9 + (this.sigmoid(this.xVelocity) * 10);

      // Update the position of card
      this.el.style.top = this.Climber.y + 'px';
      // Subtract (Width of card / 2) to centre cursor on top
      this.el.style.left = (this.Climber.x - (this.Climber.width / 2)) + 'px';

      if (Math.abs(this.rotation) < 0.01) {
        this.rotation = 0;
      }

      this.el.style.transform = `rotate(${this.rotation}deg)`;

      this.tiltAnimation = requestAnimationFrame(this.tilt);
    }
  }

  // Drop the Climber when released
  drop() {
    this.isDropping = true;
    this.el.style.transitionDuration = `${this.msToSize(this.winHeight, 1.5)}ms`;
    this.el.addEventListener('transitionend', this.walkLeft);
    this.el.style.top = `${this.winHeight - this.Climber.height}px`;
  }

  // Climber walks left after hitting the bottom of the page
  walkLeft() {
    this.audioCrash.play();
    this.isDropping = false;
    this.isWalking = true;
    this.el.removeEventListener('transitionend', this.walkLeft);
    this.el.style.transitionDuration = `${this.msToSize(this.winWidth, 3)}ms`;
    this.el.style.transform = `rotate(0deg)`;
    setTimeout(() => {
      this.el.addEventListener('transitionend', this.climbBackUp);
      this.el.style.left = `10px`;
    }, 800);
  }

  climbBackUp() {
    this.isWalking = false;
    this.isClimbing = true;
    this.el.removeEventListener('transitionend', this.walkLeft);
    this.el.style.transitionDuration = `${this.msToSize(this.winHeight, 1.5)}ms`;
    setTimeout(() => {
      this.el.addEventListener('transitionend', this.reset);
      this.el.style.top = `100px`;
    }, 100);
  }

  reset() {
    this.isClimbing = false;
    this.wasDragged = false;
    this.isResetting = true;
    this.xVelocity = 0;
    this.rotation = 0;
    this.mousePositionX = 0;
    this.mousePositionY = 0;
    this.el.removeEventListener('transitionend', this.climbBackUp);
    this.el.style.transitionDuration = '';
    this.el.style.left = `${this.Climber.startX}px`;
    this.el.style.top = `${this.Climber.startY}px`;
  }
}
