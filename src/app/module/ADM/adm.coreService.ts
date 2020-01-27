import { Injectable } from '@angular/core';
import { OHService } from 'src/app/tis.ohService';

@Injectable()
export class ADMCoreService {

	public data : any = {};
	public config : any = {
		rol_admin : 1
	};
	
	constructor(private ohService: OHService){
		
	}
	
}