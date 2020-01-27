import { BUECoreService } from './bue.coreService';
import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';
import { ohStorage } from 'src/app/ohCore/services/oh.core';

export class BUEBase {

    precarga : Promise<any>;
    storage : ohStorage;
    
    constructor(ohService : OHService, public cse : CoreService, public bcs : BUECoreService){
        
        this.storage = new ohStorage();

        this.precarga = new Promise((resolve, reject) => {
            resolve();
        });

    }
    
}