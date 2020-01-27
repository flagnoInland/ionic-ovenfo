import { Component, Directive, ElementRef, ViewChild } from '@angular/core';
 // <input type="text" ... ohFocusOnInit ...>
@Directive({
  selector: '[ohFocusOnInit]'
})

export class FocusOnInit {
    
    constructor(private elemento: ElementRef) {}
    
    ngAfterViewInit() {
        this.elemento.nativeElement.focus();
    }

}