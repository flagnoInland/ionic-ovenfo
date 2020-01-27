import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'oh-searchModal',
  templateUrl: './oh.searchModal.html'
})
export class SearchModal implements OnInit {

  @Input() title: string;
  @Input() type: number;
	@Input()
		set prefilter(valor : any) {
			if(valor && valor.length>0){
        this.filtering[this.searchBy] = valor;
				this.goListed(0);
      }
		}
		get prefilter(): any { 
			return this.prefilter; 
    }
    
	@Input()
		set search(valor : any) {
			if(valor && valor.length>0){
				this.selectedIt = valor[0].id;
      }
      this._search = valor;
		}
		get search(): any { 
			return this.search; 
		}

  _search : any;
  _search2 : any = [];

  @Input() searchBy: string;
  @Input() searchId: string;

  searching : string;
  filtering : any;
  selectedItem : number = 0;
  selectedIt : string ;

  constructor(public activeModal: NgbActiveModal) {
    this.filtering = {};
  }

  ngOnInit(){}

  selectItem(item, am : any){
    am.close(item);
  }

  selectEnter(am : any){
    var items = this._search;
    if(this.filtering[this.searchBy]){
      items = this._search.filter(item => item[this.searchBy].toLowerCase().indexOf(this.filtering[this.searchBy].toLowerCase()) >= 0);
    }
    if(items.length>0){
      this.selectItem(items[this.selectedItem], am);
    }
  }

  goListed(myList : number){
    setTimeout(()=>{
      var items = this._search;
      if(this.filtering[this.searchBy]){
        items = this._search.filter(item => item[this.searchBy].toLowerCase().indexOf(this.filtering[this.searchBy].toLowerCase()) >= 0);
        this._search2 = items.slice(0,10)
      } else {
        this._search2 = []
      }

      if(myList >= 0 && myList < items.length){
        this.selectedItem = myList;
        this.selectedIt = items[myList].id;
      }
    })
  }

}