import { Component } from '@angular/core';
import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';
import {NgbAccordionConfig} from '@ng-bootstrap/ng-bootstrap';
import { ADMFaqServiceJPO, pGesfaqObtener } from 'src/app/module/ADM/service/adm.aDMFaqService';

@Component({
  templateUrl: './ind.faqs.html',
  providers: [NgbAccordionConfig] // add the NgbAccordionConfig to the component providers
})

export class Faqs {

  private aDMFaqService : ADMFaqServiceJPO;

  item : any = []

  constructor(public coreService : CoreService, private ohService : OHService, config: NgbAccordionConfig){
    this.aDMFaqService = new ADMFaqServiceJPO(ohService);
    config.closeOthers = true;
  }

  ngOnInit(){
    this.getTerms()
  }
  
  getTerms() {
    this.aDMFaqService.gesfaqObtener({
      Unidad_negocio_id : this.coreService.data.user.profile
    }, (resp : pGesfaqObtener[]) => {
      this.item = resp
    });
  }
}