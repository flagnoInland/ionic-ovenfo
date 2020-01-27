import { Directive, TemplateRef, Input, AfterContentChecked, ContentChildren, QueryList, Component, ViewChild, ElementRef, AfterViewInit, SimpleChanges, HostListener } from "@angular/core";
import { CoreService } from "src/app/ind.coreService";

@Directive({selector: 'ng-template[ohrSide]'})
export class ResizerSide {
    constructor(public templateRef: TemplateRef<any>) {}
}

@Component({
    selector: 'oh-resizer',
    exportAs: 'ohResizer',
    templateUrl: './oh.resizer.html',
    styleUrls: ['./oh.resizer.css']
})
export class Resizer implements AfterContentChecked, AfterViewInit {

    @Input() orientation : string; // vertical | horizontal
    @Input() isExtraSize : boolean = false; // true : is has extra size
    @Input() changedSize : number; // required for isExtraSize
    @Input() defaultLeftSize : number; // When orientation is vertical
    @Input() defaultRightSize : number; // When orientation is vertical
    @Input() defaultDownSize : number; // When orientation is horizontal
    
    public contentOne: ResizerSide | null;
    public contentTwo: ResizerSide | null;

    @ViewChild('content', { static: true }) content : ElementRef;
    @ViewChild('sideA', { static: true }) sideA : ElementRef;
    @ViewChild('sideB', { static: true }) sideB : ElementRef;
    
    @ContentChildren(ResizerSide, {descendants: false}) contents: QueryList<ResizerSide>;

	constructor(public cse: CoreService) {

    }

    ngAfterContentChecked() {
        var i = 0;
        this.contents.forEach(item => {
            if(i == 0){
                this.contentOne = item;
            }
            if(i == 1){
                this.contentTwo = item;
            }
            i++;
            if(i > 1){
                return;
            }
        });
    }

	ngOnInit() {

    }

    ngAfterViewInit(){
        if(this.cse.config.openMenu){
            if(this.orientation=="horizontal" && this.defaultLeftSize){
                this.sideA.nativeElement.style.width = this.defaultLeftSize + "px";
                this.sideB.nativeElement.style.width = (this.content.nativeElement.clientWidth - (this.defaultLeftSize + 10)) + "px";
            }
            if(this.orientation=="horizontal" && this.defaultRightSize){
                this.sideA.nativeElement.style.width = (this.content.nativeElement.clientWidth - (this.defaultRightSize + 10)) + "px";
                this.sideB.nativeElement.style.width = this.defaultRightSize + "px";
            }
            if(this.orientation=="vertical"){
                this.content.nativeElement.style.height = (window.innerHeight - ((this.isExtraSize)?this.changedSize:0)) + "px";
                this.sideB.nativeElement.style.height = this.defaultDownSize + "px";
                this.sideA.nativeElement.style.height = (this.content.nativeElement.clientHeight - (this.defaultDownSize + 10)) + "px";
            }

        } else {
            if(this.orientation=="horizontal" && this.defaultRightSize){
                this.sideA.nativeElement.style.width = (window.innerWidth - (this.defaultRightSize + 10)) + "px";
                this.sideB.nativeElement.style.width = this.defaultRightSize + "px";
            }

        }
    }
    
    ngOnChanges(changes: SimpleChanges){
        if(this.orientation=="horizontal" && changes.isExtraSize){
            this.sideB.nativeElement.style.width = (this.content.nativeElement.clientWidth - this.sideA.nativeElement.clientWidth - 10) + ((!this.isExtraSize)?this.changedSize:0) + "px";
        }
        if(this.cse.config.openMenu){
            if(this.orientation=="horizontal" && this.defaultRightSize){
                this.sideA.nativeElement.style.width = (this.content.nativeElement.clientWidth - (this.defaultRightSize + 10)) + "px";
                this.sideB.nativeElement.style.width = this.defaultRightSize + "px";
            }
        } else {
            if(this.orientation=="horizontal" && this.defaultRightSize){
                this.sideA.nativeElement.style.width = (window.innerWidth - (this.defaultRightSize + 10)) + "px";
                this.sideB.nativeElement.style.width = this.defaultRightSize + "px";
            }
        }
    }

    resize(e){
        
		var content = this.content.nativeElement;
        var sideA = this.sideA.nativeElement;
        var sideB = this.sideB.nativeElement;

        var movin;
        if(this.orientation=="vertical"){
            movin = function(e){
                var height = e.clientY - sideA.offsetTop + Math.round(document.documentElement.scrollTop);
                sideA.style.height = height + 'px';
                sideB.style.height = (content.clientHeight - (height) - 10) + 'px';
            };
        }
        if(this.orientation=="horizontal"){
            var isExtraSize = this.isExtraSize;
            var changedSize = this.changedSize;
            movin = function(e){
                var width = e.clientX - ((isExtraSize)?changedSize:0) + Math.round(document.documentElement.scrollLeft);
                sideA.style.width = width + 'px';
                sideB.style.width = (content.clientWidth - (width) - 10) + 'px';
            };
        }

		var stop = function(e){
			window.removeEventListener('mousemove', movin, false);
			window.removeEventListener('mouseup', stop, false);
		};
		
		window.addEventListener('mousemove', movin, false);
		window.addEventListener('mouseup', stop, false);

    }

	@HostListener('window:resize', ['$event'])
	onResize(event) {
        if(this.orientation=="vertical"){
            this.content.nativeElement.style.height = (window.innerHeight - ((this.isExtraSize)?this.changedSize:0)) + "px";
            this.sideB.nativeElement.style.height = this.defaultDownSize + "px";
            this.sideA.nativeElement.style.height = (this.content.nativeElement.clientHeight - (this.defaultDownSize + 10)) + "px";
        }
        if(this.cse.config.openMenu){
            if(this.orientation=="horizontal" && this.defaultRightSize){
                this.sideA.nativeElement.style.width = (this.content.nativeElement.clientWidth - (this.defaultRightSize + 10)) + "px";
                this.sideB.nativeElement.style.width = this.defaultRightSize + "px";
            }
        } else {
            if(this.orientation=="horizontal" && this.defaultRightSize){
                this.sideA.nativeElement.style.width = (window.innerWidth - (this.defaultRightSize + 10)) + "px";
                this.sideB.nativeElement.style.width = this.defaultRightSize + "px";
            }
        }
	}

}