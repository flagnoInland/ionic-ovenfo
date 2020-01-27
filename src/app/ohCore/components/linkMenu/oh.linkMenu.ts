import { Component, Input, SimpleChanges } from '@angular/core';
/*
    <oh-linkMenu 
      [class]="col-6 col-sm-6 col-md-4" 
      [tree]="cse.getTreeChild('/Be/tco/line')" 
      [links]="['service','rate','contract','uploadImpo','uploadExpo','deviation']"></oh-linkMenu>
 */
@Component({
  selector: 'oh-linkMenu',
  templateUrl: './oh.linkMenu.html'
})
export class LinkMenu {

	@Input() class: string;
	@Input() tree: any;
  @Input() links: string[];

  opciones : any;
  
  constructor(){
    this.opciones = [];
  }

  ngOnChanges(changes: SimpleChanges){
      if(changes.tree){
        var opciones = [];
        for(var i in this.tree){
          if(this.links.find(it => it == this.tree[i].url)){
            opciones.push(Object.assign({}, this.tree[i]))
          }
        }
        this.opciones = opciones;
      }
    }

}