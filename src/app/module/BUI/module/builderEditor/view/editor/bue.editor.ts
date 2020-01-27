import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

import { DragulaService } from 'ng2-dragula';

@Component({
  selector: 'bue-editor',
  templateUrl: './bue.editor.html',
  styleUrls: ['./bue.editor.css']
})
export class BUEEditor {

	@ViewChild("oeh", { static: true }) oeh: ElementRef;
	@Input() design: any;
	@Input() bind: any;
	@Input() items: any;
	@Input() nameDragula: string;
	@Input() readOnly: boolean;

	@Output() onSelectedItem : EventEmitter<any>;

	constructor(private dragulaService: DragulaService){
		this.onSelectedItem  = new EventEmitter<any>();
	}
	
	mouseenter(elem){
		this.addClass(elem, "oh_editor_overComp");
	}

	mouseleave(elem){
		this.removeClass(elem, "oh_editor_overComp");
	}

	private addClass(el: any, name: string) {
		if (!this.hasClass(el, name)) {
		  el.className = el.className ? [el.className, name].join(' ') : name;
		}
	}

	private hasClass(el: any, name: string) {
		return new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)').test(el.className);
	}

	private removeClass(el: any, name: string) {
		if (this.hasClass(el, name)) {
		  el.className = el.className.replace(new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)', 'g'), '');
		}
	}

	openConfig(el : any, item : any){
		var elems = document.getElementsByClassName("oh_editor_compSelected");
		for (var i = 0; i < elems.length; ++i) {
			this.removeClass(elems[i], "oh_editor_compSelected");
		}
		this.addClass(el, "oh_editor_compSelected");
		this.onSelectedItem.emit({item});
	}

	getSelectedItem(event: any){
		this.onSelectedItem.emit({item : event.item});
	}

	getClass(item : any){
		var styles = "";
		if(item.spacing){
			for(var i = 0 ; i < item.spacing.length; i++){
				styles += " "+item.spacing[i].type+item.spacing[i].area+"-"+item.spacing[i].size
			}
		}
		if(item.width && item.width.length>0){
			styles +=" w-"+item.width;
		}
		return styles;
	}

}