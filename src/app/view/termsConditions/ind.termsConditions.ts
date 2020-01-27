import { Component, ViewChild, ElementRef } from '@angular/core';
import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';
import {NgbAccordionConfig} from '@ng-bootstrap/ng-bootstrap';
import { ADMTerminoServiceJPO, pGesterminoObtener } from 'src/app/module/ADM/service/adm.aDMTerminoService';

@Component({
  templateUrl: './ind.termsConditions.html',
  providers: [NgbAccordionConfig] // add the NgbAccordionConfig to the component providers
})

export class TermsConditions {

  private aDMTerminoService : ADMTerminoServiceJPO;

  item : any = []

  constructor(public coreService : CoreService, private ohService : OHService, config: NgbAccordionConfig){
    this.aDMTerminoService = new ADMTerminoServiceJPO(ohService);
    config.closeOthers = true;
  }

  ngOnInit(){
    this.getTerms()
  }
  
  getTerms() {
    this.aDMTerminoService.gesterminoObtener({
      Unidad_negocio_id : this.coreService.data.user.profile
    }, (resp : pGesterminoObtener[]) => {
      this.item = resp
    });
  }
}