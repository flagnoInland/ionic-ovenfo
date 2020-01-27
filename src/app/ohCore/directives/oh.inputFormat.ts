import { Directive, HostListener, Input, Output, EventEmitter } from '@angular/core';
// <input type="text" ... [ohInputFormat]="'upper'" ...>
@Directive({
  selector: '[ohInputFormat]'
})

export class InputFormat {

  @Input('ohInputFormat') format: string;

  @Input() ngModel;
  @Output() ngModelChange = new EventEmitter();

  constructor() { }

  @HostListener('keyup') onKeyUp() {
    if(this.format=='upper'){
      if(this.ngModel){
        this.ngModelChange.emit(this.ngModel.toUpperCase());
      }
    }
    if(this.format=='lower'){
      if(this.ngModel){
        this.ngModelChange.emit(this.ngModel.toLowerCase());
      }
    }
    if(this.format=='fontawesome'){
      if(this.ngModel){
        this.ngModelChange.emit((this.ngModel.substr(0,2)=="<i" ? this.ngModel.split('"')[1] : this.ngModel));
      }
    }
  }

  @HostListener('keypress') onkeypress() {
    if(this.format=='upper'){
      if(this.ngModel){
        this.ngModelChange.emit(this.ngModel.toUpperCase());
      }
    }
    if(this.format=='lower'){
      if(this.ngModel){
        this.ngModelChange.emit(this.ngModel.toLowerCase());
      }
    }
    if(this.format=='fontawesome'){
      if(this.ngModel){
        this.ngModelChange.emit((this.ngModel.substr(0,2)=="<i" ? this.ngModel.split('"')[1] : this.ngModel));
      }
    }
  }

}