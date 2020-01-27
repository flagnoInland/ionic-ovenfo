import { Input, Component, EventEmitter, Output, ChangeDetectorRef } from "@angular/core";
/*
<div class="d-flex flex-wrap justify-content-between">
    <div class="pb-2 ml-3 mr-2 d-flex flex-wrap justify-content-start flex-grow-1" style="overflow: auto;">
        <oh-filter [(filter)]="ohfiltro" [template]="filterWindow" [showLight]="true"></oh-filter>
    </div>
    <pagin class="d-flex flex-wrap justify-content-end ml-auto" [length]="items.length" [obj_pagin]="ohpag" (list)="tmspapeletaListar()"></pagin>
</div>
*/
@Component({
    selector: 'pagin',
    templateUrl: './pagin.html',
	styleUrls: ['./pagin.css'],
})
export class Pagin {

    @Input() public length : any;
    @Input() public obj_pagin : any; // {page: 1, total: 0, size_rows: 5};    
	@Output() public list: EventEmitter<any> = new EventEmitter();
	@Output() public listPagin: EventEmitter<any> = new EventEmitter();
    
    public default : any;
    // private cdRef : ChangeDetectorRef
    constructor(){
		this.default = {
            max_size: function () {
                return (window.innerWidth > 800) ? 9 : (window.innerWidth > 600) ? 6 : 3;
			},
            page: 1,
			size: 'sm',
			total: 0,
			options: [5, 10, 25, 50, 100, 500],
			size_rows: 10,
		}
    }
    
    ngOnInit() {
        if(this.obj_pagin){
            this.obj_pagin.page = (this.obj_pagin.page ? this.obj_pagin.page : this.default.page);
            this.obj_pagin.size = (this.obj_pagin.size ? this.obj_pagin.size : this.default.size);
            this.obj_pagin.total = (this.obj_pagin.total ? this.obj_pagin.total : this.default.total);
            this.obj_pagin.options = (this.obj_pagin.options ? this.obj_pagin.options : this.default.options);
            this.obj_pagin.size_rows = (this.obj_pagin.size_rows ? this.obj_pagin.size_rows : this.default.size_rows);
        }
    }

    trackByFn(index, item) {
        return item.id;
    }
	
	// ngAfterViewChecked() {
	// 	let size_rows = this.isShow();
	// 	if (size_rows != this.obj_pagin.size_rows) { // check if it change, tell CD update view
	// 		this.obj_pagin.size_rows = size_rows;
	// 		this.cdRef.detectChanges();
	// 	}
	// }

	// isShow(){
	// 	return this.obj_pagin.size_rows
	// }

	execList(){
        this.obj_pagin.page = 1;
		this.list.emit();
    }
    
    validSize(id_size : number){
        //this.obj_pagin.size_rows = (this.obj_pagin.options[id_size] <= this.obj_pagin.total ? this.obj_pagin.options[id_size] : this.obj_pagin.options[0]);
        //this.obj_pagin.page = 1;
		this.listPagin.emit();
        if (id_size == 0) return true;
        return (this.obj_pagin.options[id_size-1] < this.obj_pagin.total)
    }
}