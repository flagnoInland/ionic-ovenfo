import { Component, Input } from '@angular/core';
import { shared } from '../../../environments/environmentShared';
import { CoreService } from 'src/app/ind.coreService';

declare var apmdata: any;

@Component({
  selector: 'ind-foot',
  templateUrl: './ovn.foot.html'
})
export class OVNFoot {

  @Input() connection : number;
	
  version: string;
  currentDate = new Date();
  title : string;
  constructor(public coreService : CoreService) {
    this.coreService.data.connection = 1;
    this.version = shared.version;
  }
  
}