import { Injectable } from '@angular/core';

export interface csConfig {disableSeparator : boolean, jpo : any, formatDate : string, formatDateTime : string};

@Injectable()
export class CoreService {

	public data : any = {};
	public config : csConfig;
	
	constructor(){
		this.config = {disableSeparator : false, jpo : null, formatDate : "", formatDateTime : ""};
	}

}