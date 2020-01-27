import { Component, Output, EventEmitter, Input, HostListener } from '@angular/core';
import { CoreService } from './../../ind.coreService';
import { ohLeftMenu, ohRight } from './../../ohCore/animations/oh.core';
import { SistemaServiceJPO } from 'src/app/service/tis.sistemaService';
import { OHService } from 'src/app/tis.ohService';

@Component({
	selector: 'ind-adds',
  animations: [ohLeftMenu, ohRight],
  templateUrl: './ind.adds.html',
  styleUrls: ['./ind.adds.css']
})

export class Adds {

  @Input() openedIndex : number;
  @Output() onUpdate;
  openAdds : boolean;
  openDetail : boolean;

  add : any;

  private sistemaService : SistemaServiceJPO;

  constructor(public coreService : CoreService, private ohService : OHService){

    this.sistemaService = new SistemaServiceJPO(ohService);
    this.onUpdate = new EventEmitter();
    
    this.add = {
      sendDate : new Date()
    }
    
  }

  ngOnInit(){
    
    if(this.openedIndex != -1){ // If was required
      this.openAdd(this.openedIndex);
    } else {
      if(this.coreService.data.adds.length>1){
        this.openAdds = true;
        this.openDetail = false;
      } else {
        this.openAdd(0);
      }
    }

  }

  addTimeRead : any;  

  openAdd(index : number){
    this.openAdds = false;
    this.openDetail = true;
    
    this.add = this.coreService.data.adds[index];
    if(this.add.type == 2){ // notificacion_proyecto
      if(this.add.onlyOne == '1'){
        this.addTimeRead = window.setTimeout(() => {
          this.sistemaService.segnotificacionLeer({
            Usuario_id : this.coreService.data.user.data.userid,
            Notificacion_id : this.add.id
          });
          this.coreService.data.addsNoRead--;
          this.coreService.data.adds.splice(index, 1);
        }, 5000);
      } else {
        if(this.add.onlyOneAlert == '1' && this.add.read == 0){
          this.addTimeRead = window.setTimeout(() => {
            this.sistemaService.segnotificacionLeer({
              Usuario_id : this.coreService.data.user.data.userid,
              Notificacion_id : this.add.id
            });
            this.coreService.data.adds[index].read = 1;
            this.coreService.data.addsNoRead--;
          }, 5000);
        }
      }
    } else {

    }
  }

  returning(){
    clearTimeout(this.addTimeRead);
    this.openAdds = true;
    this.openDetail = false;
  }

	@HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    if(this.addTimeRead){
      clearTimeout(this.addTimeRead);
    }
  }
  
	ngOnDestroy(){
    if(this.addTimeRead){
      clearTimeout(this.addTimeRead);
    }
	}
  
}