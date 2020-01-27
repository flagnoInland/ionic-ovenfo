import { Component, AfterViewInit, OnInit} from '@angular/core';
import { Router } from '@angular/router';

import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';

import { BUIBase } from 'src/app/module/BUI/bui.base';
import { BUICoreService } from 'src/app/module/BUI/bui.coreService';

@Component({
  templateUrl: './bui.main.html'
})
export class BUIMain extends BUIBase implements OnInit, AfterViewInit {

    constructor(private router : Router, private ohService : OHService, public cse : CoreService, public bcs : BUICoreService){
        super(ohService, cse, bcs);
    }

    ngOnInit(){
        var childrens = this.cse.getTreeChild('/Be/bui').filter(child => child.type == 2);
        if(childrens.length == 1){
            this.router.navigate([childrens[0].urlTree]);
        }
    }

    ngAfterViewInit(){
         this.ohService.getOH().getLoader().close();
    }

}