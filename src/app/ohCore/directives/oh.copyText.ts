import { Directive, HostListener, Input } from '@angular/core';
import { MainService } from '../services/oh.mainService';
import { OHService } from 'src/app/tis.ohService';

@Directive({
  selector: '[ohCopyText]'
})

export class CopyText {
 
  @Input('ohCopyText') input_text : any;

  private ohMainService: MainService;
  
  constructor(private ohCore: OHService) {
		this.ohMainService = ohCore.getOH();
  }

  @HostListener('click', ['$event'])
	onClick(event: Event) {
    this.input_text.select();
		document.execCommand("copy");
		this.ohMainService.getAd().success("Copiado correctamente");
  }

}