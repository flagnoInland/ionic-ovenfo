import { Component, Input, Output, EventEmitter } from '@angular/core';
// ejemplo <oh-link [link]="'../eir'" [text]="'EIR'" [icon]="'fa fa-life-buoy'"></oh-link>
@Component({
  selector: 'oh-link',
  templateUrl: './oh.linkBox.html',
  styleUrls: ['./oh.linkBox.css']
})
export class LinkBox {

	@Input() link: string;
	@Input() text: string;
	@Input() icon: string;

	@Output() onChange = new EventEmitter();

    constructor(){
    }

    onLink(e){
    	this.onChange.emit();
    }

}