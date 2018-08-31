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
  isResetting = false;
  isClimbing = false;
  isDropping = false;
  isCrashed = false;
  isWalking = false;
  get isDragging() {
    return this.dragging;
  }
  set isDragging(value) {
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
  private mousePositionX = 0;
  private mousePositionY = 0;

  // Event vars
  private dragAnimation: any;

  // Audio
  private audioScream = new Audio();
  private audioCrash = new Audio();
  private audioJump = new Audio();

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
    this.dragMomentum = this.dragMomentum.bind(this);
    this.crash = this.crash.bind(this);
    this.walkLeft = this.walkLeft.bind(this);
    this.climbBackUp = this.climbBackUp.bind(this);
    this.backToStart = this.backToStart.bind(this);
    this.reset = this.reset.bind(this);
  }

  ngAfterViewInit() {
    this.el = this.element.nativeElement.querySelector('.climber');

    // Set up drag listeners
    this.el.addEventListener('mousedown', this.onStartDrag, false);
    this.el.addEventListener('touchstart', this.onStartDrag, false);
    window.addEventListener('selectstart', this.onSelectStart, false);
    window.addEventListener('mousemove', this.onDrag, false);
    window.addEventListener('touchmove', this.onDrag, false);
    window.addEventListener('mouseup', this.onStopDrag, false);
    window.addEventListener('touchend', this.onStopDrag, false);

    // Set up Climber dimensions/positions
    setTimeout(() => {
      this.Climber.width = this.el.offsetWidth;
      this.Climber.height = this.el.offsetHeight;
      this.Climber.startX = parseInt(window.getComputedStyle(this.el).getPropertyValue('left'), 10);
      this.Climber.startY = parseInt(window.getComputedStyle(this.el).getPropertyValue('top'), 10);
    });
  }

  ngOnDestroy() {
    window.removeEventListener('selectstart', this.onSelectStart);
    window.removeEventListener('mousemove', this.onDrag);
    window.removeEventListener('mouseup', this.onStopDrag);
    if (this.el) {
      this.el.removeEventListener('mousedown', this.onStartDrag);
    }
  }

  // Pre load any audio files
  loadAudio() {
    this.audioCrash.src = '../../assets/drop-climber/8-bit-crash-1.mp3'; // https://www.audioblocks.com/royalty-free-audio/16+bit
    this.audioJump.src = '../../assets/drop-climber/8-bit-jump-sound-1.mp3'; // https://www.audioblocks.com/royalty-free-audio/16+bit
    this.audioScream.src = '../../assets/drop-climber/impossible-mission-scream.mp3';
    this.audioCrash.load();
    this.audioJump.load();
    this.audioScream.load();
  }

  // Map milliseconds of animation to height or width
  msToSize(size, ms) {
    const msPerSize = ms;
    let time = size * msPerSize;
    time = Math.floor(time);
    return time;
  }

  // Sigmoid function
  // https://uxdesign.cc/how-to-fix-dragging-animation-in-ui-with-simple-math-4bbc10deccf7
  sigmoid(x) {
    return (x / (1 + Math.abs(x)));
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
    this.dragAnimation = requestAnimationFrame(this.dragMomentum);
    this.loadAudio();
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
      cancelAnimationFrame(this.dragAnimation);

      this.drop();
    }
  }

  // Tilt the rotation of the Climber based on drag momentum
  dragMomentum() {
    if (this.isDragging) {
      this.xVelocity = (this.mousePositionX - this.Climber.x);

      this.Climber.x = this.mousePositionX;
      this.Climber.y = this.mousePositionY;

      this.rotation = this.rotation * 0.9 + (this.sigmoid(this.xVelocity) * 10);

      // Update the position of Climber
      this.el.style.top = this.Climber.y + 'px';
      // Subtract (Width of Climber / 2) to centre cursor on top
      this.el.style.left = (this.Climber.x - (this.Climber.width / 2)) + 'px';

      if (Math.abs(this.rotation) < 0.01) {
        this.rotation = 0;
      }

      this.el.style.transform = `rotate(${this.rotation}deg)`;

      this.dragAnimation = requestAnimationFrame(this.dragMomentum);
    }
  }

  // Drop the Climber when released
  drop() {
    this.audioScream.play();
    this.isDropping = true;
    this.el.style.transitionDuration = `${this.msToSize(this.winHeight, 1.5)}ms`;
    this.el.addEventListener('transitionend', this.crash, { once: true });
    this.el.style.top = `${this.winHeight - this.Climber.height}px`;
  }

  crash() {
    this.el.style.transitionDuration = '';
    this.el.style.transform = ''; // Remove rotate
    this.isDropping = false;
    this.isCrashed = true;
    setTimeout(() => {
      this.walkLeft();
    }, 800);
  }

  // Climber walks left after hitting the bottom of the page
  walkLeft() {
    this.audioScream.pause();
    this.audioScream.currentTime = 0;
    this.audioCrash.play();
    this.isCrashed = false;
    this.isWalking = true;
    this.el.style.transitionDuration = `${this.msToSize(this.winWidth, 3)}ms`;
    setTimeout(() => {
      this.el.addEventListener('transitionend', this.climbBackUp, { once: true });
      this.el.style.left = `10px`;
    }, 800);
  }

  climbBackUp() {
    this.isWalking = false;
    this.isClimbing = true;
    this.el.style.transitionDuration = `${this.msToSize(this.winHeight, 3)}ms`;
    setTimeout(() => {
      this.el.addEventListener('transitionend', this.backToStart, { once: true });
      this.el.style.top = `100px`;
    }, 100);
  }

  backToStart() {
    this.isClimbing = false;
    this.isResetting = true;
    this.el.style.transitionDuration = '';
    setTimeout(() => {
      this.audioJump.play();
      this.el.addEventListener('transitionend', this.reset, { once: true });
      this.el.style.left = '';
      this.el.style.top = '';
      this.el.style.transform = '';
    }, 100);
  }

  reset() {
    this.wasDragged = false;
    this.isResetting = false;
    this.xVelocity = 0;
    this.rotation = 0;
    this.mousePositionX = 0;
    this.mousePositionY = 0;
  }
}
