import { Directive, ElementRef, HostListener, Input } from '@angular/core';
// <input type="text" ... ohMarkText (defaultColor)="'red'" ...>
// <input type="text" ... (ohMarkText)="'blue'" (colorDefecto)="'red'" ...>
@Directive({
  selector: '[ohMarkText]'
})

export class MarkText {
 
  constructor(private elemento: ElementRef) { }

  @Input() defaultColor: string;

  @Input('ohMarkText') shadedColor: string;

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(this.shadedColor || this.defaultColor || 'red');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight(null);
  }

  private highlight(color: string) {
    this.elemento.nativeElement.style.backgroundColor = color;
  }

}