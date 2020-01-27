import { Input, Component } from "@angular/core";
// <oh-steps [list]="[{value : 'asda', status : 'complete'}]"></oh-steps>
@Component({
    selector: 'oh-steps-trip',
    templateUrl: './oh.stepsTrip.html',
    styleUrls: ['./oh.stepsTrip.css']
})
export class StepsTrip {

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