import { Input, Component } from "@angular/core";
// <oh-thumbnail [id]="item.usuario_id" [name]="item.nombres" [lastName]="item.apellidos"></oh-thumbnail>
@Component({
    selector: 'oh-thumbnail',
    templateUrl: './oh.thumbnail.html'
})
export class Thumbnail {

    photo : any = null;
    @Input()
    set id(id : any) {
      //this.photo = null;
    }

    _name : string;
    _nameShort : string;
    _nameFirst : string;
    _lastName : string;
    _lastNameShort : string;

    index_color : number = 0;

    test : string = "#daded4"

    colors : any = [
        ['#added4', '#38665b'],
        ['#b3e3c6', '#2f593f'],
        ['#b3d2e6', '#37576b']
    ];

    @Input()
    set name(name : any) {
      this._name = name;
      if(name && name.length>0){
        let indice = name.indexOf(" ");
        let nameShort = name;
        if(indice>0){
            nameShort = name.substring(0, name.indexOf(" "));
        }
        this._nameFirst = nameShort.charAt(0).toUpperCase();
        this._nameShort = this._nameFirst+nameShort.substring(1).toLowerCase();
      }
      this.getColor();
    }

    @Input()
    set lastName(lastName : any) {
      this._lastName = lastName;
      if(lastName && lastName.length>0){
        this._lastNameShort = lastName.charAt(0).toUpperCase();
      } 
      this.getColor();
    } 

    @Input() size : string = 'sm' // sm = 36px | md = 72px | lg = 128px
    @Input() showName : boolean = true
    
    constructor(){
    }

    getColor(){
        if(this._name && this._lastName){
            let nombre = this._name+' '+this._lastName;

            let indice = 0;
            if(nombre.length >= this.colors.length){
                indice = nombre.length % this.colors.length;
            } else {
                indice = nombre.length;
            }
      
            this.index_color = indice;
        }
    }

}