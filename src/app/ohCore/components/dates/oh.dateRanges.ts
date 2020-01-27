import { Component, Input, Output, EventEmitter, HostListener  } from '@angular/core';
import { NgbDatepickerI18n, NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

import { I18n, CustomDatepickerI18n } from './oh.dateConfiguration';

// <oh-dateranges [(from)]="fechafrom" [(to)]="fechato" (onChange)="algunaFuncion()"></oh-dateranges>

@Component({
  selector: 'oh-dateranges',
  templateUrl: './oh.dateRanges.html',
  styleUrls: ['./oh.dateRanges.css'],
  providers: [I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}]
})
export class DateRanges {

  @Input()
    get from(): any { 
      return this._from; 
    }
    set from(valor : any) {
      let fecha = new Date(valor);
      if(valor && fecha){
        this._from = new NgbDate(fecha.getFullYear(), fecha.getMonth()+1, fecha.getDate());
      }
    }

  @Input()
    get to(): any {
      return this._to; 
    }
    set to(valor : any) {
      let fecha = new Date(valor);
      if(valor && fecha){
        this._to = new NgbDate(fecha.getFullYear(), fecha.getMonth()+1, fecha.getDate());
      }
    }

  @Output() fromChange: EventEmitter<Date>; // hace binding al padre.
  @Output() toChange: EventEmitter<Date>; // hace binding al padre.
  
  @Input() disabled: boolean;
  @Input() required: boolean;
  
  _from: NgbDate;
  _to: NgbDate;
  hoveredDate: NgbDate;
  
  @Output() onChange = new EventEmitter(); // llama a un evento

  mountsCount : number;

  constructor(calendar: NgbCalendar){
    this.fromChange = new EventEmitter<Date>();
    this.toChange = new EventEmitter<Date>();
    
    /*if(!this._from){
      this._from = calendar.getNext(calendar.getToday(), 'd', -30);
    }
    if(!this._to){
      this._to = calendar.getToday();
    }*/
    this.disabled = false;
    this.mountSizes(window.screen.width);
  }

  onDateSelection(date: NgbDate) {
    if (!this._from && !this._to) {
      this._from = date;
    } else if (this._from && !this._to && date.after(this._from)) {
      this._to = date;
    } else {
      this._to = null;
      this._from = date;
    }

    if(this._from){
      this.fromChange.emit(new Date(this._from.year, this._from.month-1, this._from.day));
    } else {
      this.fromChange.emit(null);
    }

    if(this._to){
      this.toChange.emit(new Date(this._to.year, this._to.month-1, this._to.day));
    } else {
      this.toChange.emit(null);
    }
    this.onChange.emit(); // new 
  }

  isHovered(date: NgbDate) {
    return this._from && !this._to && this.hoveredDate && date.after(this._from) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return date.after(this._from) && date.before(this._to);
  }

  isRange(date: NgbDate) {
    return date.equals(this._from) || date.equals(this._to) || this.isInside(date) || this.isHovered(date);
  }
  
  // custom

  mountSizes(ancho: number){
    if(ancho<992){
      this.mountsCount = 1;
    } else {
      this.mountsCount = 2;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.mountSizes(event.target.innerWidth);
  }

}
