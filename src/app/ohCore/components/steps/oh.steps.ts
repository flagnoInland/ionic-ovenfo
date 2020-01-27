import { Input, Component } from "@angular/core";
// <oh-steps [list]="[{value : 'asda', complete : false}]"></oh-steps>
@Component({
    selector: 'oh-steps',
    templateUrl: './oh.steps.html',
    styleUrls: ['./oh.steps.css']
})
export class Steps {

    @Input() list : any;
    current : number;
    
    constructor(){
        this.current = 0;
    }

    public next(){
        if(this.current < this.list.length-1){
            this.current++;
        }
    }

    public back(){
        if(this.current>=0){
            this.current--;
        }
    }

}