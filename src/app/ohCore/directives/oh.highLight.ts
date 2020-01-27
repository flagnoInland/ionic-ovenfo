import { Component, Input, ElementRef, SimpleChanges, Directive } from '@angular/core';
// ejemplo <oh-highlight [content]="temporl" [lang]="'typescript'"></oh-highlight>
declare const hljs: any;
declare const document: any;

@Directive({
	selector: '[ohHighlight]',
	host: {
	  style: 'display:none;'
	}
})
export class Highlight {
  
	@Input('ohHighlight') hightLight : string;

	@Input() options: any;
	@Input() lang: string;

	protected preElm: any;
	protected parentEl : any;
  
	constructor(private el: ElementRef) {}
  
	ngOnInit() {
		var content = this.el.nativeElement.innerHTML;
		if(content.trim().length>0){
			this.build(content);
		}
	}

	ngOnChanges(changes: SimpleChanges){
        if(changes.hightLight){
            this.build(this.hightLight);
        }
    }
  
	ngOnDestroy(): void {
		if (this.preElm) {
			this.parentEl.removeChild(this.preElm);
			this.preElm = null;
		}
	}

	build(content : string){
		content = content || '';
		if(this.preElm){
			this.preElm.innerHTML = '' + content;
		} else {
			this.preElm = document.createElement('pre');
			if (this.lang) {
				this.preElm.className = this.lang;
			}
			this.preElm.innerHTML = '' + content;
	
			this.parentEl = this.el.nativeElement.parentNode;
			this.parentEl.insertBefore(
				this.preElm,
				this.el.nativeElement.nextSibling,
			);
		}
		hljs.configure(Object.assign({}, (this.options)?this.options:{}));
		hljs.highlightBlock(this.preElm);
	}
  
}