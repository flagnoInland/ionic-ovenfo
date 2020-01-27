import { BUIBuilderUtil } from "./bui.builder.util";

export class OHBuilderView {

    config : any;
    util : BUIBuilderUtil;

    // news
    menuArbol : any;
    templateMenu : any;
    sources : any;
    template : any;
    menu_id : number;

    preFijoPlantilla : string;
    plantillaPadre : string;
    design : any;
    configTS : any;

    constructor(dataConfig : any, viewConfig :any){
        this.config = dataConfig;
        this.util = new BUIBuilderUtil();
        if(viewConfig){
            this.menuArbol = viewConfig.menuArbol;
            this.templateMenu = viewConfig.templateMenu;
            this.sources = viewConfig.sources;
            this.template = viewConfig.template;
            this.menu_id = viewConfig.menu_id;
            this.procesar();
        }
    }
    
    public buildWeb(sep : number){
        this.configTS = {};
        var contentHTML = this.buildHTML(this.design.content, sep);

        return this.buildHTMLPost(contentHTML);
    }

    public buildWebDescriptive(sep : number){
        this.configTS = {};
        var contentHTML = this.buildHTML(this.design.content, sep);

        return this.util.escapeHtml(this.buildHTMLPost(contentHTML));
    }

    public buildHTML(rows : any, sep : number){

        var sb = [];

        if(rows){
            for(var i = 0; i < rows.length; i++){

                var item = rows[i];
                var id = (item.config.id && item.config.id.length>0)?' #'+item.config.id:'';
                var sepT = this.util.getT(sep);
                
                var pStyle = "";
                var pClass = "";
                var pngIf = "";
                var pnHidden = "";
                
                if(!item.isMaxWidh && item.id!=5 && item.id!=9 && item.id!=17){ // skip button, Outputtext, icon
                    pStyle = ' style="display: inline-block;"';
                }
                if(item.spacing){
                    for(var e = 0 ; e < item.spacing.length; e++){
                        if(item.spacing[e].type && item.spacing[e].area && item.spacing[e].size){
                            pClass += item.spacing[e].type+item.spacing[e].area+"-"+item.spacing[e].size+" ";
                        }
                    }
                }
                if(item.width && item.width.length>0){
                    pClass +="w-"+item.width+" ";
                }

                if(item.whenIf){
                    pngIf = ' *ngIf="'+item.whenIf+'"';
                }
                if(item.whenHidden){
                    pnHidden = ' [hidden]="'+item.whenHidden+'"';
                }

                var viewContent = (item.viewContent && item.viewContent == 'span')?'span':'div';
                
                if(pStyle.length>0 || pClass.length>0 || pngIf.length>0 || pnHidden.length>0){
                    pClass = pClass.trim().length==0?'':' class="'+pClass.trim()+'"';
                    sb.push(sepT+'<'+viewContent+pStyle+pClass+pngIf+pnHidden+'>'+'\n');
                    sepT = this.util.getT(sep+1);
                }

                    // Simple
                    if(item.id == 1){ sb.push(this.getTextbox(id, item, sepT)); }
                    if(item.id == 4){ sb.push(this.getLink(id, item, sepT)); }
                    if(item.id == 5){ sb.push(this.getButton(id, item, sepT)); }
                    if(item.id == 7){ sb.push(this.getSearchrow(id, item, sepT)); }
                    if(item.id == 9){ sb.push(this.getOutputtext(id, item, sepT)); }
                    if(item.id == 10){sb.push(this.getAlert(id, item, sepT)); }
                    if(item.id == 13){sb.push(this.getSelect(id, item, sepT)); }
                    if(item.id == 14){sb.push(this.getDatepicker(id, item, sepT)); }
                    if(item.id == 16){sb.push(this.getRadio(id, item, sepT)); }
                    if(item.id == 17){sb.push(this.getIcon(id, item, sepT)); }
                    if(item.id == 20){sb.push(this.getOption(id, item, sepT)); }
                    if(item.id == 23){sb.push(this.getPagination(id, item, sepT)); }
                    if(item.id == 25){sb.push(this.getLinkBox(id, item, sepT)); }
                    
                    // buttonBox
                    // Complex
                    if(item.id == 2){ sb.push(this.getTable(id, item, sep)); }
                    if(item.id == 3){ sb.push(this.getContainer(id, item, sep)); }
                    if(item.id == 6){ sb.push(this.getRow(id, item, sep)); }
                    if(item.id == 8){ sb.push(this.getKeypad(id, item, sep)); }
                    if(item.id == 11){sb.push(this.getAccordion(id, item, sep)); }
                    if(item.id == 12){sb.push(this.getTab(id, item, sep)); }
                    if(item.id == 15){sb.push(this.getForm(id, item, sep)); }
                    if(item.id == 18){sb.push(this.getModal(id, item, sep)); }
                    if(item.id == 19){sb.push(this.getFormRow(id, item, sep)); }
                    if(item.id == 21){sb.push(this.getCard(id, item, sep)); }
                    if(item.id == 22){sb.push(this.getListHeader(id, item, sep)); }
                    if(item.id == 24){sb.push(this.getBagde(id, item, sep)); }
                    if(item.id == 26){sb.push(this.getLinkContainer(id, item, sep)); }

                if(pStyle.length>0 || pClass.length>0 || pngIf.length>0 || pnHidden.length>0){
                    sepT = this.util.getT(sep);
                    sb.push("\n"+sepT+'</'+viewContent+'>');
                }

                sb.push("\n");
            }
        }

        return sb.join("");

    }

        private getTextbox(id : string, item : any, sep : string){

            var name = (id.length>0)?' name="'+this.util.getId(id)+'"':'';

            var fid = (id.length>0 && item.config.value.esEnlace && item.config.value.valor.length>0)?id+'="ngModel"':'';
            var model = '';
                if(item.config.value.esEnlace && item.config.value.valor.length>0){
                    model = name+' [(ngModel)]="'+item.config.value.valor+'"';
                } else if(!item.config.value.esEnlace && item.config.value.valor.length>0){
                    model = ' value="'+item.config.value.valor+'"';
                } else {
                    model = '';
                }

            var placeholder = (item.config.placeholder && item.config.placeholder.length>0)?' placeholder="'+item.config.placeholder+'"':'';
            
            var modelMoney = '';
            var money = "";
            var type = '';
            if(item.config.type=="money"){
                money += ' currencyMask';
                if(item.config.moneyValue.esEnlace && item.config.moneyValue.valor.length>0){
                    modelMoney = name+' [options]="'+item.config.moneyValue.valor+'"';
                } 
            } else {
                type = ' type="'+item.config.type+'"';
            }
            
            var disabled = (item.config.disabled)?' disabled="true"':'';
            var readOnly = (item.config.readOnly)?' readonly="true"':'';
            var required = (item.config.required)?' required="true"':'';
            var min = (item.config.min>0)?' [min]="'+item.config.min+'"':'';
            var max = (item.config.max>0)?' [max]="'+item.config.max+'"':'';
            var step = (item.config.step>0)?' step="'+item.config.step+'"':'';
            var minlength = (item.config.minlength>0)?' minlength="'+item.config.minlength+'"':'';
            var maxlength = (item.config.maxlength>0)?' maxlength="'+item.config.maxlength+'"':'';
            var focusOnInit = (item.config.focusOnInit)?' ohFocusOnInit':'';
            var pattern = (item.config.pattern)?' pattern="'+item.config.pattern+'"':'';
            var onKey = this.shareEvent('onKey',item);
            
            var showRules = "";
            if(item.config.value.valor.length>0 && id.length>0 && item.config.enableRules){
                var eid = this.util.getId(id);
                var sb_rule = [];
                if(item.config.required){
                    sb_rule.push(sep+'        <li *ngIf="'+eid+'.errors.required">El campo es requerido.</li>'+'\n');
                }
                if(item.config.maxlength){
                    sb_rule.push(sep+'        <li *ngIf="'+eid+'.errors.maxlength">El campo debe tener como máximo '+item.config.maxlength+' caracteres.</li>'+'\n');
                }
                if(item.config.minlength){
                    sb_rule.push(sep+'        <li *ngIf="'+eid+'.errors.minlength">El campo debe tener como mínimo '+item.config.minlength+' caracteres.</li>'+'\n');
                }
                if(item.config.pattern){
                    sb_rule.push(sep+'        <li *ngIf="'+eid+'.errors.pattern">El campo es incorrecto.</li>'+'\n');
                }

                if(sb_rule.length>0){
                    var sb = [];
                    sb.push(sep+'<div *ngIf="'+eid+'.invalid && ('+eid+'.dirty || '+eid+'.touched)" class="alert alert-danger alert-form">'+'\n');
                        sb.push(sep+'    <ul>'+'\n');
                        sb.push(sb_rule.join(""));
                        sb.push(sep+'    </ul>'+'\n');
                        sb.push(sep+'</div>');
                    showRules = "\n"+sb.join("");
                }
            }

            var params = fid+' class="form-control"'+model+placeholder+money+modelMoney+type+disabled+readOnly+required+min+max+step+maxlength+minlength+focusOnInit+onKey+pattern;
            if(item.config.type=='textarea'){
                return sep+'<textarea'+params+'></textarea>'+showRules;
            } else if (item.config.type=='richtext'){
                return sep+'<angular-tinymce formTinymce'+fid+model+required+' [settings]="cse.tinymceConfig"></angular-tinymce>'+showRules;
            } else {
                return sep+'<input'+params+'>'+showRules;
            }

        }

        private getLink(id : string, item : any, sep : string){
            
            var icon = (item.config.icon && item.config.icon.length>0)?'<i class="'+item.config.icon+'"></i>':'';
            var url = "";
                url += (item.config.url && item.config.url.length>0)?' href="'+item.config.url+'"':'';
                url += (item.config.router && item.config.router.length>0)?' [routerLink]="[\''+item.config.router+'\']"':'';

            var target = (item.config.target && item.config.target.length>0)?' target="'+item.config.target+'"':'';
            
            var onClick = this.shareEvent('onClick',item);

            var clsColTex = (item.config.colorTexto && item.config.colorTexto.length>0)?' '+item.config.colorTexto:'';
            var clsTamTex = (item.config.tamanoTexto && item.config.tamanoTexto.length>0)?' '+item.config.tamanoTexto:'';
            return sep+'<a'+id+onClick+url+target+' class="'+clsColTex+clsTamTex+'">'+icon+' '+item.config.value+'</a>';
        
        }

        private getButton(id : string, item : any, sep : string){
            
            var icon = (item.config.icon && item.config.icon.length>0)?'<i class="'+item.config.icon+'"></i>':'';
            var color = 'btn '+item.config.color;
            if(item.config.size){
                color +=' '+item.config.size;
            }
            var whenDisabled = (item.config.whenDisabled)?' [disabled]="'+item.config.whenDisabled+'"':'';

            var onClick = this.shareEvent('onClick',item);
            
            var url = (item.config.router && item.config.router.length>0)?' [routerLink]="[\''+item.config.router+'\']"':'';
            
            return sep+'<button'+id+' class="'+color+'"'+whenDisabled+onClick+url+'>'+icon+' '+item.config.value+'</button>';
        
        }

        private getSearchrow(id : string, item : any, sep : string){

            var model = (item.config.value)?' [(ngModel)]="'+item.config.value+'"':'';
            var placeholder = (item.config.placeholder && item.config.placeholder.length>0)?' placeholder="'+item.config.placeholder+'"':'';
            var scan = (item.config.enableScan)?'<span class="input-group-text btn btn-info"><i class="fas fa-qrcode"></i></span>':'';
            var sb = [];
            
            var onKey = this.shareEvent('onKey',item);
            var onClick = this.shareEvent('onClick',item);

                sb.push(sep+'<div class="input-group">'+'\n');
                sb.push(sep+'    <input'+id+' type="search"'+onKey+' class="form-control"'+model+placeholder+'>'+'\n');
                sb.push(sep+'    <div class="input-group-append">'+'\n');
                sb.push(sep+'        <span class="input-group-text"'+onClick+'><i class="fa fa-search" aria-hidden="true"></i> '+item.config.value+'</span>'+'\n');
                sb.push(sep+'        '+scan+'\n');
                sb.push(sep+'    </div>'+'\n');
                sb.push(sep+'</div>');

            return sb.join("");

        }

        private getOutputtext(id : string, item : any, sep : string){

            var clsColTex = (item.config.colorTexto)?' '+item.config.colorTexto:'';
            var clsTamTex = (item.config.tamanoTexto)?' '+item.config.tamanoTexto:'';
            var clsVistaRes = (item.vistaResponsiva)?' '+item.vistaResponsiva:'';
            
            var clsTrans = (item.config.transformacion)?' '+item.config.transformacion:'';
            var clsGrosor = (item.config.grosor)?' '+item.config.grosor:'';
            var clsItalic = (item.config.esItalica)?' font-italic':'';
            var clsFuenteCodigo = (item.config.esFuenteCodigo)?' text-monospace':'';

            var clase = (clsColTex+clsTamTex+clsVistaRes+clsTrans+clsGrosor+clsItalic+clsFuenteCodigo).trim();
                clase = (clase.length==0)?'':' class="'+clase+'"';

            var valor = "";
            if(item.config.value.esEnlace){
                valor += "{{"+item.config.value.valor;
                if(item.config.formato == 'fecha'){
                    valor +=" | date: cse.config.formatDate";
                }
                if(item.config.formato == 'texfechaHorato'){
                    valor +=" | date: cse.config.formatDateTime";
                }
                if(item.config.formato == 'moneda'){

                    var monedaSimbolo = '';
                        if(item.config.simboloValue.valor.length>0){
                            monedaSimbolo = item.config.simboloValue.esEnlace?item.config.simboloValue.valor:"'"+item.config.simboloValue.valor+"'";
                        }
                    var formatoSimbolo = '';
                        if(item.config.formatoValue.valor.length>0){
                            formatoSimbolo = item.config.formatoValue.esEnlace?item.config.formatoValue.valor:"'"+item.config.formatoValue.valor+"'";
                        }

                    valor +=" | ohCurrencyFormat: "+monedaSimbolo+" : "+formatoSimbolo;
                }
                valor += "}}";
            } else {
                valor = item.config.value.valor;
            }

            return sep+'<'+item.config.type+''+id+clase+'>'+valor+'</'+item.config.type+'>';
        }

        private getAlert(id : string, item : any, sep : string){
            var onClick = this.shareEvent('onClose',item);
            
            return sep+'<ngb-alert'+id+' type="'+item.config.color+'" [dismissible]="'+item.config.isDismissible+'"'+onClick+'>'+((item.config.value.esEnlace)?'{{'+item.config.value.valor+'}}':item.config.value.valor)+'</ngb-alert>';
        
        }

        private getSelect(id : string, item : any, sep : string){

            var name = (id.length>0)?' name="'+this.util.getId(id)+'"':'';

            var model = '';
            if(item.config.value.esEnlace && item.config.value.valor.length>0){
                model = ' [(ngModel)]="'+item.config.value.valor+'"';
            } else if(!item.config.value.esEnlace && item.config.value.valor.length>0){
                model = ' value="'+item.config.value.valor+'"';
            } else {
                model = '';
            }

            var disabled = (item.config.disabled)?' disabled="true"':'';
            var required = (item.config.required)?' required="true"':'';
            
            if(item.config.onChange){
                var onChange = ' (change)="'+item.config.onChange+'"';
            } else {
                var onChange = '';
            }
            
            var showRules = "";
            if(item.config.value.valor.length>0 && id.length>0 && item.config.required){
                var eid = this.util.getId(id);
                var sb = [];
                sb.push(sep+'<div *ngIf="'+eid+'.invalid && ('+eid+'.dirty || '+eid+'.touched)" class="alert alert-danger alert-form">'+'\n');
                    sb.push(sep+'    <ul>'+'\n');
                    sb.push(sep+'        <li *ngIf="'+eid+'.errors.required">El campo es requerido.</li>'+'\n');
                    sb.push(sep+'    </ul>'+'\n');
                    sb.push(sep+'</div>');
                showRules = "\n"+sb.join("");
            }


            var sb = [];

                sb.push(sep+'<select'+id+' class="form-control"'+model+name+onChange+disabled+required+'>'+'\n');
                if(item.config.tipoEnlace=="enlace" && item.config.for.length>0){
                    sb.push(sep+'    <option *ngFor="let opcItem of '+item.config.for+'" [value]="opcItem.id">{{opcItem.value}}</option>'+'\n');
                } else if(item.config.tipoEnlace=="opcion" && item.config.options.length>0){
                    for(var i in item.config.options){
                        var opcion = item.config.options[i];
                        sb.push(sep+'    <option value="'+opcion.id+'">'+opcion.value+'</option>'+'\n');
                    }
                } /*else {
                    sb.push(sep+'    <option value="1">Opcion prueba 1</option>'+'\n');
                    sb.push(sep+'    <option value="2">Opcion prueba 2</option>'+'\n');
                }*/
                sb.push(sep+'</select>'+showRules);

            return sb.join("");
        }

        private getDatepicker(id : string, item : any, sep : string){

            var eid = this.util.getId(id);
            var eidMod = eid+"Mod";
            
            var model = (item.config.value.valor)?' [(ngModel)]="'+item.config.value.valor+'" name="'+eidMod+'"':'';
            var fid = "";
            var required = (item.config.required)?' required="true"':'';
            
            var showRules = "";

            var fid = (eid.length>0 && item.config.value.valor.length>0)?' #'+eidMod+'="ngModel"':id;

            if(item.config.value.valor.length>0 && id.length>0 && item.config.enableRules){
                var sb_rule = [];
                if(item.config.required){
                    sb_rule.push(sep+'        <li *ngIf="'+eidMod+'.errors.required">El campo es requerido.</li>'+'\n');
                }
                if(sb_rule.length>0){
                    var sb = [];
                    sb.push(sep+'<div *ngIf="'+eidMod+'.invalid && ('+eidMod+'.dirty || '+eidMod+'.touched)" class="alert alert-danger alert-form">'+'\n');
                        sb.push(sep+'    <ul>'+'\n');
                        sb.push(sb_rule.join(""));
                        sb.push(sep+'    </ul>'+'\n');
                        sb.push(sep+'</div>');
                    showRules = "\n"+sb.join("");
                }
            }

            if(item.config.type=='simple'){
                return sep+'<ngb-datepicker'+fid+model+' [displayMonths]="'+item.config.months+'" [navigation]="'+item.config.navigation+'" [showWeekNumbers]="'+item.config.showWeekNumbers+'"'+required+'></ngb-datepicker>'+showRules;
            }
            if(item.config.type=='text'){
                var linkBind = "";
                var linkOpen = "";
                if(eid.length>0){
                    if(!item.config.value.esEnlace){
                        fid = "";
                    }
                    linkBind = '#'+eid+'="ngbDatepicker"';
                    linkOpen = '(click)="'+eid+'.toggle()"';
                }

                var sb = [];
                    sb.push(sep+'<div class="input-group">'+'\n');
                    sb.push(sep+'    <input'+fid+' class="form-control"'+model+' placeholder="yyyy-mm-dd" ngbDatepicker '+linkBind+' [displayMonths]="'+item.config.months+'" navigation="'+item.config.navigation+'" [showWeekNumbers]="'+item.config.showWeekNumbers+'"'+required+'>'+'\n');
                    sb.push(sep+'    <div class="input-group-append">'+'\n');
                    sb.push(sep+'        <button class="btn btn-outline-secondary" '+linkOpen+' type="button"><i class="far fa-calendar-alt" aria-hidden="true"></i></button>'+'\n');
                    sb.push(sep+'    </div>'+'\n');
                    sb.push(sep+'</div>'+showRules);
                return sb.join("");
            }
            if(item.config.type=='range'){
                var sb = [];
                    sb.push(sep+'[{{'+item.config.value.valor+' | date: cse.config.formatDate}} - {{'+item.config.value.valorHasta+' | date: cse.config.formatDate}}]<br>'+'\n');
                    sb.push(sep+'<oh-dateranges'+id+' [(from)]="'+item.config.value.valor+'" [(to)]="'+item.config.value.valorHasta+'"'+required+'></oh-dateranges>');
                return sb.join("");
            }

        }

        private getRadio(id : string, item : any, sep : string){
            
            var name = (id.length>0)?' name="'+this.util.getId(id)+'"':'';

            var model = '';
                if(item.config.value.esEnlace && item.config.value.valor.length>0){
                    model = ' [(ngModel)]="'+item.config.value.valor+'"';
                } else if(!item.config.value.esEnlace && item.config.value.valor.length>0){
                    model = ' value="'+item.config.value.valor+'"';
                } else {
                    model = '';
                }
            
            var sb = [];
                
                sb.push(sep+'<div'+id+' class="btn-group btn-group-toggle" ngbRadioGroup '+name+model+'>'+'\n');
                
                if(item.config.tipoEnlace=="enlace" && item.config.for.length>0){
                    sb.push(sep+'    <label ngbButtonLabel class="btn-primary" *ngFor="let opcItem of '+item.config.for+'">'+'\n');
                    sb.push(sep+'        <input ngbButton type="radio" [value]="opcItem.id"> {{opcItem.value}}'+'\n');
                    sb.push(sep+'    </label>'+'\n');
                } else if(item.config.tipoEnlace=="opcion" && item.config.options.length>0){
                    for(var i in item.config.options){
                        var opcion = item.config.options[i];
                        sb.push(sep+'    <label ngbButtonLabel class="'+((opcion.color && opcion.color.length>0)?'btn '+opcion.color:'btn-primary')+'">'+'\n');
                        sb.push(sep+'        <input ngbButton type="radio" [value]="'+opcion.id+'"> '+opcion.value+'\n');
                        sb.push(sep+'    </label>'+'\n');
                    }
                } /*else {
                    sb.push(sep+'    <label ngbButtonLabel class="btn-primary">'+'\n');
                    sb.push(sep+'        <input ngbButton type="radio" [value]="1"> Prueba 1'+'\n');
                    sb.push(sep+'    </label>'+'\n');
                    sb.push(sep+'    <label ngbButtonLabel class="btn-primary">'+'\n');
                    sb.push(sep+'        <input ngbButton type="radio" [value]="2"> Prueba 2'+'\n');
                    sb.push(sep+'    </label>'+'\n');
                }*/
                sb.push(sep+'</div>');

            return sb.join("");

        }

        private getIcon(id : string, item : any, sep : string){
            var clsColTex = (item.config.colorTexto && item.config.colorTexto.length>0)?' '+item.config.colorTexto:'';
            var clsTamTex = (item.config.tamanoTexto && item.config.tamanoTexto.length>0)?' '+item.config.tamanoTexto:'';
            return sep+'<i'+id+' title="'+item.config.titulo+'" class="'+item.config.value+clsColTex+clsTamTex+'"></i>';
        }

        private getOption(id : string, item : any, sep : string){

            if(item.config.type != 'simple'){

                var model = (item.config.value)?' [(option)]="'+item.config.value+'"':'';
                var desc = (item.config.desc)?' [text]="\''+item.config.desc+'\'"':'';
                var type = (item.config.type)?' [type]="\''+item.config.type+'\'"':'';
                var onChange = (item.config.onChange)?' (onChange)="'+item.config.onChange+'"':'';
                
                return sep+'<oh-option'+id+model+desc+type+onChange+'></oh-option>';

            } else {

                var name = (id.length>0)?' name="'+this.util.getId(id)+'"':'';
                var id = (id.length>0)?' id="'+item.config.id+'"':'';
                var model = '';
                    if(item.config.value.esEnlace && item.config.value.valor.length>0){
                        model = ' [(ngModel)]="'+item.config.value.valor+'"';
                    } else {
                        model = ' value="'+item.config.value.valor+'"';
                    }
                var onChange = (item.config.onChange)?' (change)="'+item.config.onChange+'"':'';

                //if(item.config.id.length == 0){item.config.id = "_"+Math.round(Math.random()*1000000);}

                var sb = []; 
                sb.push(sep+'<div class="custom-control custom-checkbox">'+'\n');
                sb.push(sep+'    <input type="checkbox" class="custom-control-input"'+id+name+model+onChange+'>'+'\n');//  [(ngModel)]="'+item.config.value+'"
                sb.push(sep+'    <label class="custom-control-label" for="'+item.config.id+'">'+(item.config.desc && item.config.desc.length>0?item.config.desc:'&nbsp;')+'</label>'+'\n');
                sb.push(sep+'</div>');
                
                return sb.join("");
            }  

        }
        
        private getContainer(id : string, item : any, sep : number){
            
            var sepT = this.util.getT(sep);
            var sb = [];

            var clsTipoDiv = (item.config.type=='div' && item.config.typeDiv)?' '+item.config.typeDiv:'';
            var clsVistaRes = (item.vistaResponsiva)?' '+item.vistaResponsiva:'';

            var clase = (clsTipoDiv+clsVistaRes).trim();
                clase = (clase.length==0)?'':' class="'+clase+'"';

            sb.push(sepT+'<'+item.config.type+id+clase+'>'+'\n');
            if(item.config.external && item.config.external.length>0){
                sb.push(this.util.getT(sep+1)+item.config.external+"\n");
            } else {
                sb.push(this.buildHTML(item.selected.content, sep+1));
            }
            sb.push(sepT+'</'+item.config.type+'>');

            return sb.join("");

        }

        private getTable(id : string, item : any, sep : number){

            var sepT = this.util.getT(sep);
            var sbHead = [];
            var sbBody = [];

            var iterate = (item.config.for && item.config.for.value.length>0)?' *ngFor="let '+item.config.for.item+' of '+item.config.for.value+'; let '+item.config.for.index+' = index"':'';
            
            for(var i = 0; i < item.config.rows.length; i++){

                var row = item.config.rows[i];
                var extra = (row.tipoWidth && row.tipoWidth.length>0)?row.tipoWidth+'-':'';
                var width = (row.width && row.width>0)?' style="'+extra+'width: '+row.width+row.medida+'"':'';
                if(item.config.showTitle){

                    var claseCabe = ((row.cabeFondo)?row.cabeFondo:'')+' '+((row.cabeAlineo)?row.cabeAlineo:'');
                    if(claseCabe.trim().length>0){
                        claseCabe = ' class="'+claseCabe+'"';
                    }

                    sbHead.push(sepT+'                <th'+width+claseCabe+'>'+'\n');
                    sbHead.push(this.buildHTML(row.selectedHead.content, sep+5));
                    sbHead.push(sepT+'                </th>'+'\n');
                }

                var claseDeta = ((row.detaFondo)?row.detaFondo:'')+' '+((row.detaAlineo)?row.detaAlineo:'');
                if(claseDeta.trim().length>0){
                    claseDeta = ' class="'+claseDeta+'"';
                }

                sbBody.push(sepT+'                <td'+claseCabe+'>'+'\n');
                sbBody.push(this.buildHTML(row.selectedBody.content, sep+5));
                sbBody.push(sepT+'                </td>'+'\n');

            }

            var pClass = "";
                pClass += (item.config.striped)?' table-striped':'';
                pClass += (item.config.hover)?' table-hover':'';
                pClass += (item.config.bordered)?' table-bordered':'';
                pClass += (item.config.small)?' table-sm':'';

            var sb = [];
                sb.push(sepT+'<div class="tableContent">'+'\n');
                sb.push(sepT+'   <table'+id+' class="table'+pClass+' bg-white">'+'\n');
                if(item.config.showTitle){
                    sb.push(sepT+'       <thead>'+'\n');
                    sb.push(sepT+'           <tr>'+'\n');
                    sb.push(sbHead.join(""));
                    sb.push(sepT+'           </tr>'+'\n');
                    sb.push(sepT+'       </thead>'+'\n');
                }
                sb.push(sepT+'       <tbody>'+'\n');
                sb.push(sepT+'           <tr'+iterate+'>'+'\n');
                sb.push(sbBody.join(""));
                sb.push(sepT+'           </tr>'+'\n');
                sb.push(sepT+'       </tbody>'+'\n');
                sb.push(sepT+'   </table>'+'\n');
                sb.push(sepT+'</div>');

            return sb.join("");
        }

        private getRow(id : string, item : any, sep : number){

            var sepT = this.util.getT(sep);
            var sbBody = [];

            for(var i = 0; i < item.config.rows.length; i++){

                var columna = item.config.rows[i];
                
                var clase = this.getClaseCol(columna);

                var ngFor = columna.valueNgFor.esEnlace?' *ngFor="'+columna.valueNgFor.valor+'"':'';
            
                sbBody.push(sepT+'    <div class="'+clase.trim()+'"'+ngFor+'>'+'\n');
                sbBody.push(this.buildHTML(columna.selectedBody.content, sep+2));
                sbBody.push(sepT+'    </div>'+'\n');
                
            }

            var sb = [];

                sb.push(sepT+'<div'+id+' class="row">'+'\n');
                sb.push(sbBody.join(""));
                sb.push(sepT+'</div>');

            return sb.join("");
        }

        private getKeypad(id : string, item : any, sep : number){

            var sepT = this.util.getT(sep);
            var sb = [];

                sb.push(sepT+'<div'+id+' class="card bg-light botoneraCard">'+'\n');
                sb.push(sepT+'    <div class="card-body">'+'\n');
                sb.push(sepT+'        <div>'+'\n');
                sb.push(this.buildHTML(item.selected.content, sep+3));
                sb.push(sepT+'        </div>'+'\n');
                sb.push(sepT+'    </div>'+'\n');
                sb.push(sepT+'</div>');

            return sb.join("");
        }

        private getAccordion(id : string, item : any, sep : number){

            var sepT = this.util.getT(sep);
            var sbContent = [];

            for(var i = 0; i < item.config.rows.length; i++){

                var row = item.config.rows[i];
            
                sbContent.push(sepT+'    <ngb-panel id="acc-'+i+'">'+'\n');
                sbContent.push(sepT+'        <ng-template ngbPanelTitle>'+'\n');
                sbContent.push(this.buildHTML(row.selectedHead.content, sep+3));
                sbContent.push(sepT+'        </ng-template>'+'\n');
                sbContent.push(sepT+'        <ng-template ngbPanelContent>'+'\n');
                sbContent.push(this.buildHTML(row.selectedBody.content, sep+3));
                sbContent.push(sepT+'        </ng-template>'+'\n');
                sbContent.push(sepT+'    </ngb-panel>'+'\n');

            }

            var active = (item.config.iSel)?' activeIds="'+item.config.iSel+'"':'';

            var sb = [];
                sb.push(sepT+'<ngb-accordion'+id+' [closeOthers]="'+!item.config.multiple+'"'+active+'>'+'\n');
                sb.push(sbContent.join(""));
                sb.push(sepT+'</ngb-accordion>');

            return sb.join("");
        }

        private getTab(id : string, item : any, sep : number){

            var sepT = this.util.getT(sep);
            var sbContent = [];

            for(var i = 0; i < item.config.rows.length; i++){

                var row = item.config.rows[i];
            
                sbContent.push(sepT+'    <ngb-tab [disabled]="'+!row.enable+'" id="tab-'+i+'">'+'\n');
                sbContent.push(sepT+'        <ng-template ngbTabTitle>'+'\n');
                sbContent.push(this.buildHTML(row.selectedHead.content, sep+3));
                sbContent.push(sepT+'        </ng-template>'+'\n');
                sbContent.push(sepT+'        <ng-template ngbTabContent>'+'\n');
                sbContent.push(this.buildHTML(row.selectedBody.content, sep+3));
                sbContent.push(sepT+'        </ng-template>'+'\n');
                sbContent.push(sepT+'    </ngb-tab>'+'\n');

            }

            var active = (item.config.iSel)?' activeId="'+item.config.iSel+'"':'';

            var sb = [];
                sb.push(sepT+'<ngb-tabset'+id+active+' type="'+item.config.typeTab+'" justify="'+item.config.justify+'" orientation="'+item.config.orientation+'">'+'\n');
                sb.push(sbContent.join(""));
                sb.push(sepT+'</ngb-tabset>');

            return sb.join("");
        }
        
        private getForm(id : string, item : any, sep : number){
            id = (id.length>0)?id+'="ngForm"':'';

            var sepT = this.util.getT(sep);
            var sbContent = [];
            var onSubmit = (item.config.onSubmit)?' (ngSubmit)="'+item.config.onSubmit+'"':'';
            
            for(var i = 0; i < item.config.rows.length; i++){

                var row = item.config.rows[i];
                var clase = this.getClaseCol(item.config);

                var filaInv = Object.assign({}, item.config, {});
                if(filaInv.width>=1){filaInv.width = 12 - filaInv.width;}
                if(filaInv.widthSM>=1){filaInv.widthSM = 12 - filaInv.widthSM;}
                if(filaInv.widthMD>=1){filaInv.widthMD = 12 - filaInv.widthMD;}
                if(filaInv.widthLG>=1){filaInv.widthLG = 12 - filaInv.widthLG;}
                if(filaInv.widthXL>=1){filaInv.widthXL = 12 - filaInv.widthXL;}
                    filaInv = this.getClaseCol(filaInv);
               

                sbContent.push(sepT+'    <div class="form-group row">'+'\n');
                sbContent.push(sepT+'        <label class="col-form-label '+clase+'">'+'\n');
                sbContent.push(this.buildHTML(row.selectedHead.content, sep+3));
                sbContent.push(sepT+'        </label>'+'\n');
                sbContent.push(sepT+'        <div class="'+filaInv+'">'+'\n');
                sbContent.push(this.buildHTML(row.selectedBody.content, sep+3));
                sbContent.push(sepT+'        </div>'+'\n');
                sbContent.push(sepT+'    </div>'+'\n');

            }

            var sb = [];
                sb.push(sepT+'<form'+id+' class="form-enable"'+onSubmit+'>'+'\n');
                sb.push(sbContent.join(""));
                sb.push(sepT+'</form>');

            return sb.join("");
        }

        private getModal(id : string, item : any, sep : number){

            var row = item.config.rows[0];
            var sepT = this.util.getT(sep);
            var sbContent = [];

            sbContent.push(sepT+'<ng-template'+id+' let-cl="close" let-di="dismiss">'+'\n');
            sbContent.push(sepT+'    <div class="modal-header">'+'\n');
            sbContent.push(sepT+'        <h4 class="modal-title">'+'\n');
            sbContent.push(this.buildHTML(row.selectedHead.content, sep+3));
            sbContent.push(sepT+'        </h4>'+'\n');
            sbContent.push(sepT+'        <button type="button" class="close" aria-label="Close" (click)="di(\'dismiss\')"><span aria-hidden="true">&times;</span></button>'+'\n');
            sbContent.push(sepT+'    </div>'+'\n');
            sbContent.push(sepT+'    <div class="modal-body">'+'\n');
            sbContent.push(this.buildHTML(row.selectedBody.content, sep+2));
            sbContent.push(sepT+'    </div>'+'\n');
            sbContent.push(sepT+'    <div class="modal-footer">'+'\n');
            sbContent.push(this.buildHTML(row.selectedFooter.content, sep+2));
            sbContent.push(sepT+'    </div>'+'\n');
            sbContent.push(sepT+'</ng-template>');

            if(id.length>0){
                if(!this.configTS.modals){
                    this.configTS.modals = [];
                }
                this.configTS.modals.push(item);
            }

            return sbContent.join("");
        }

        private getFormRow(id : string, item : any, sep : number){

            var sepT = this.util.getT(sep);
            var sbBody = [];

            for(var i = 0; i < item.config.rows.length; i++){

                var row = item.config.rows[i];
                var width =  this.getClaseCol(row);
                sbBody.push(sepT+'    <div class="form-group '+width+'">'+'\n');
                sbBody.push(sepT+'        <label>'+'\n');
                sbBody.push(this.buildHTML(row.selectedHead.content, sep+3));
                sbBody.push(sepT+'        </label>'+'\n');
                sbBody.push(this.buildHTML(row.selectedBody.content, sep+2));
                sbBody.push(sepT+'    </div>'+'\n');

            }

            var sb = [];

                sb.push(sepT+'<div'+id+' class="form-row">'+'\n');
                sb.push(sbBody.join(""));
                sb.push(sepT+'</div>');

            return sb.join("");
        }

        private getCard(id : string, item : any, sep : number){

            var row = item.config.rows[0];
            var sepT = this.util.getT(sep);
            var sbContent = [];

            var background = (item.config.background)?' '+item.config.background+'':'';
            
            sbContent.push(sepT+'<div'+id+' class="card'+background+'">'+'\n');
            if(item.config.showHeader){
                sbContent.push(sepT+'   <'+item.config.title+' class="card-header">'+'\n');
                sbContent.push(this.buildHTML(row.selectedHead.content, sep+2));
                sbContent.push(sepT+'   </'+item.config.title+'>'+'\n');
            }
            if(item.config.showBody){
                sbContent.push(sepT+'   <div class="card-body">'+'\n');
                sbContent.push(this.buildHTML(row.selectedBody.content, sep+2));
                sbContent.push(sepT+'   </div>'+'\n');
            }
            if(item.config.showFooter){
                sbContent.push(sepT+'    <div class="card-footer">'+'\n');
                sbContent.push(this.buildHTML(row.selectedFooter.content, sep+2));
                sbContent.push(sepT+'    </div>'+'\n');
            }
            sbContent.push(sepT+'</div>'+'\n');

            return sbContent.join("");
        }

        private getListHeader(id : string, item : any, sep : number){

            var row = item.config.rows[0];
            var sepT = this.util.getT(sep);
            var sbContent = [];

            var modalValue = (item.config.modalValue && item.config.modalValue.valor.length>0)?' [template]="'+item.config.modalValue.valor+'"':'';
            
            sbContent.push(sepT+'<div class="tis-listContent mb-3 noImpresion">'+'\n');
            sbContent.push(sepT+'    <ul class="list-inline pt-2 pb-2 tis-lineDivide">'+'\n');
            sbContent.push(sepT+'        <li class="list-inline-item pt-2 ml-3">'+'\n');
            sbContent.push(this.buildHTML(row.selectedHead.content, sep+3));
            sbContent.push(sepT+'        </li>'+'\n');
            sbContent.push(sepT+'        <li class="list-inline-item float-right mr-3 tis-dis-ifle">'+'\n');
            sbContent.push(this.buildHTML(row.selectedBody.content, sep+3));            
            sbContent.push(sepT+'        </li>'+'\n');
            sbContent.push(sepT+'    </ul>'+'\n');
            if(item.config.paginacionHabilitar){
                this.configTS.buildFilterModal = true;
                sbContent.push(sepT+'    <ul class="list-inline" style="min-height: 3rem;">'+'\n');
                sbContent.push(sepT+'        <li class="list-inline-item ml-3">'+'\n');
                sbContent.push(sepT+'            <oh-filter [(filter)]="ohfiltro"'+modalValue+' [showLight]="'+((item.config.paginacionFiltro)?"true":"false")+'"></oh-filter>'+'\n');
                sbContent.push(sepT+'        </li>'+'\n');
                sbContent.push(sepT+'        <li class="list-inline-item float-right mr-3 tis-dis-ifle">'+'\n');
                sbContent.push(this.buildHTML(row.selectedFooter.content, sep+3));
                sbContent.push(sepT+'        </li>'+'\n');
                sbContent.push(sepT+'    </ul>'+'\n');
            }
            sbContent.push(sepT+'</div>'+'\n');
            this.configTS.enableDeparator = true;
            
            return sbContent.join("");
        }

        private getPagination(id : string, item : any, sep : string){

            var sbContent = [];

            var enlaceListaTamano = (item.config.lista.esEnlace && item.config.lista.valor.length>0)?'{{'+item.config.lista.valor+'.length}}':''

            var variables = [];
            var enlaceTotal = (item.config.total.esEnlace && item.config.total.valor.length>0)?'{{'+item.config.total.valor+'}}':''
            if(item.config.total.esEnlace && item.config.total.valor.length>0){
                variables.push(' [collectionSize]="'+item.config.total.valor+'"');
            }
            if(item.config.pagina.esEnlace && item.config.pagina.valor.length>0){
                variables.push(' [(page)]="'+item.config.pagina.valor+'"');
            }
            if(item.config.itemxPagina.esEnlace && item.config.itemxPagina.valor.length>0){
                variables.push(' [pageSize]="'+item.config.itemxPagina.valor+'"');
            }
            if(item.config.nroPaginaciones.esEnlace && item.config.nroPaginaciones.valor.length>0){
                variables.push(' [maxSize]="'+item.config.nroPaginaciones.valor+'"');
            }
            variables.push(' [directionLinks]="'+item.config.habilitarDireccionales+'"');
            variables.push(' [boundaryLinks]="'+item.config.habilitarLimites+'"');
            variables.push(' [rotate]="'+item.config.habilitarRotacion+'"');
            variables.push(' [ellipses]="'+item.config.habilitarElipse+'"');
            
            sbContent.push(sep+'<span class="mt-1 mr-3">'+enlaceListaTamano+' de '+enlaceTotal+'<span class="vistaBC tis-dis-iblk">&nbsp;registros</span></span>'+'\n');
            sbContent.push(sep+'<div class="tis-pagin">'+'\n');
            sbContent.push(sep+'    <ngb-pagination'+variables.join('')+'></ngb-pagination>'+'\n'); //  (pageChange)="list()"
            sbContent.push(sep+'</div>'+'\n');

            if(this.configTS.buildFilterModal){
                this.configTS.buildPaginationConfig = item.config;
            }
            
            return sbContent.join("");
        }

        private getBagde(id : string, item : any, sep : number){
            
            var sepT = this.util.getT(sep);
            var sb = [];

            var clsTipo = (item.config.tipo=='pildora')?' badge-pill':'';
            var clsColor = (item.config.color)?' '+item.config.color:'';

            var clase = (clsTipo+clsColor).trim();
                clase = (clase.length==0)?'':' '+clase;

            sb.push(sepT+'<span'+id+' class="badge'+clase+'"'+'>'+'\n');
            sb.push(this.buildHTML(item.selected.content, sep+1));
            sb.push(sepT+'</span>');

            return sb.join("");

        }

        private getLinkBox(id : string, item : any, sep : string){
            
            var valorLink = item.config.valorLink.esEnlace?item.config.valorLink.valor:"'"+item.config.valorLink.valor+"'";
            var valorTexto = item.config.valorTexto.esEnlace?item.config.valorTexto.valor:"'"+item.config.valorTexto.valor+"'";
            var valorIcono = item.config.valorIcono.esEnlace?item.config.valorIcono.valor:"'"+item.config.valorIcono.valor+"'";
            
            return sep+'<oh-link [link]="'+valorLink+'" [text]="'+valorTexto+'" [icon]="'+valorIcono+'"></oh-link>';
        
        }

        private getLinkContainer(id : string, item : any, sep : number){
            
            var sepT = this.util.getT(sep);
            var url = "";
                url += (item.config.url && item.config.url.length>0)?' href="'+item.config.url+'"':'';
                url += (item.config.router && item.config.router.length>0)?' [routerLink]="[\''+item.config.router+'\']"':'';

            var target = (item.config.target && item.config.target.length>0)?' target="'+item.config.target+'"':'';
            
            var onClick = this.shareEvent('onClick',item);

            var sb = [];
            sb.push(sepT+'<a'+id+onClick+url+target+'>'+'\n');
            sb.push(this.buildHTML(item.selected.content, sep+1));
            sb.push(sepT+'</a>');

            return sb.join("");
        
        }

    private getClaseCol(item : any){
        var clase = "";
            clase += (item.width==-1)?'':(item.width==0?'col ':'col-'+item.width+" ");
            clase += (item.widthSM==-1)?'':(item.widthSM==0?'col ':'col-sm-'+item.widthSM+" ");
            clase += (item.widthMD==-1)?'':(item.widthMD==0?'col ':'col-md-'+item.widthMD+" ");
            clase += (item.widthLG==-1)?'':(item.widthLG==0?'col ':'col-lg-'+item.widthLG+" ");
            clase += (item.widthXL==-1)?'':(item.widthXL==0?'col ':'col-xl-'+item.widthXL+" ");
        return clase;
    }

    private shareEvent(type : string, item : any){
        if(type=="onKey" && item.flagOnKey){
            if(item.config.onKeyType && item.config.onKeyType.length>0 && item.config.onKeyValue && item.config.onKeyValue.length>0){
                var button = "";
                if(item.config.onKeyButton && item.config.onKeyButton.length > 0){
                    button += "."+item.config.onKeyButton;
                }
                return ' ('+item.config.onKeyType+button+')="'+item.config.onKeyValue+'"';
            }
        }
        if(type=="onClick" && item.flagOnClick){
            if(item.config.onClick && item.config.onClick.length>0){
                return ' (click)="'+item.config.onClick+'"';
            }
        }
        if(type=="onClose" && item.flagOnClose){
            if(item.config.onClose && item.config.onClose.length>0){
                return ' (close)="'+item.config.onClose+'"';
            }
        }
        
        return '';
    }

    private buildHTMLPost(html : string){

        // Modal si tiene filtro
        
        return html;
        
    }

    public buildViewTSDescriptive(){
        return this.util.escapeHtml(this.buildViewTS());
    }
        
    public buildViewTS(){

        var prefijo = this.preFijoPlantilla.toUpperCase();
        var prefijoInit = this.preFijoPlantilla[0].toLowerCase();
        var nombreClase = this.template.folder[0].toUpperCase()+this.template.folder.substr(1);
        
        var vImportCore = [];
        var vImportRouter = [];
        var vImportNgBoostrap = [];

        var vConstructorParam = [];
            vConstructorParam.push("private ohService : OHService");
            vConstructorParam.push("public cse : CoreService");
            vConstructorParam.push("public "+prefijoInit+"cs : "+prefijo+"CoreService");
            
        if(this.configTS.buildFilterModal){
            vImportNgBoostrap.push("NgbActiveModal");            
        }

        if(this.seleccionado[0].tiene_id){
            vImportRouter.push("ActivatedRoute");
            vConstructorParam.push("private route: ActivatedRoute");
        }

        if(this.configTS.modals && this.configTS.modals.length>0){
            vImportNgBoostrap.push("NgbModal");
            vConstructorParam.push("private modalService: NgbModal");
        }
        
        if(this.design.config.confAlertOut){
            vImportCore.push("HostListener");
        }
        var temp = [];

        var entidades = {
            instancias : [],
            definiciones : []
        };

        var cond_importCoreViewChild = false;
        var cond_importNgBoostrap = false;
        
        if(this.design.bind.entities){
            for(var ent_i in this.design.bind.entities){
                var entitie = this.design.bind.entities[ent_i];
                
                if(entitie.type == "NgbModalRef"){
                    entidades.instancias.push('\t@'+entitie.decorador+'("'+entitie.decorador_id+'") '+entitie.name+': '+entitie.type+(entitie.isList?'[]':'')+';'+"\n");
                } else {
                    entidades.instancias.push('\t'+entitie.name+': '+entitie.type+(entitie.isList?'[]':'')+';'+"\n");
                }
                
                if(entitie.decorador=='ViewChild' && !cond_importCoreViewChild){
                    vImportCore.push("ViewChild");
                    cond_importCoreViewChild = true;
                }

                if(entitie.type=='NgbModalRef' && !cond_importNgBoostrap){
                    vImportNgBoostrap.push("NgbModalRef");
                    cond_importNgBoostrap = true;
                }

                if(entitie.value){
                    entidades.definiciones.push('\t\t'+'this.'+entitie.name+' = '+((entitie.type=="string")?'"'+entitie.value+'"':entitie.value)+';'+"\n");
                } else if(entitie.type=="any"){
                    entidades.definiciones.push('\t\t'+'this.'+entitie.name+' = {};'+"\n");
                }
            }

        }

        var metodos = [];
        var tieneOhInstFiltro = false;
        if(this.design.bind.methods){
            for(var met_i in this.design.bind.methods){
                var meto = [];
                var method = this.design.bind.methods[met_i];
                    var par = [];
                    for(var par_i in method.params){
                        var parm = method.params[par_i];
                        par.push(parm.name+" "+((parm.isOptional)?'?:':':')+" "+parm.type);
                    }
                    meto.push("\t"+method.name+"("+par.join(", ")+"){\n");
                    meto.push(method.value);
                    meto.push("\t}\n");

                    if(method.name == "ohInstanciarFiltro"){
                        tieneOhInstFiltro = true;
                    }

                metodos.push(meto.join("")+"\n");
            }
        }

        // Importaciones
        var pImportCore = (vImportCore.length>0)?', '+vImportCore.join(", "):'';
        var pImportRouter = (vImportRouter.length>0)?vImportRouter.join(", "):'';
        var pImportAngular = (vImportNgBoostrap.length>0)?vImportNgBoostrap.join(", "):'';
        
		temp.push("import { Component, AfterViewInit, OnInit, OnDestroy"+pImportCore+" } from '@angular/core';\n");
        if(vImportRouter.length>0){
            temp.push("import { "+pImportRouter+" } from '@angular/router';\n");
        }
        if(vImportNgBoostrap.length>0){
            temp.push("import { "+pImportAngular+" } from '@ng-bootstrap/ng-bootstrap';\n");
        }
        
		temp.push("import { OHService } from 'src/app/tis.ohService';\n");
		temp.push("import { CoreService } from 'src/app/ind.coreService';\n\n");
		
		temp.push("import { "+prefijo+"CoreService } from 'src/app/module/"+prefijo+"/"+this.preFijoPlantilla+".coreService';\n");
		temp.push("import { "+prefijo+"Base } from 'src/app/module/"+prefijo+"/"+this.preFijoPlantilla+".base';\n\n");
		
        temp.push("@Component({\n");
        
        var confSelector = this.design.config.confSelector;
        var confCSS = this.design.config.confCSS;
        
        temp.push("\ttemplateUrl: './"+this.preFijoPlantilla+"."+this.template.folder+".html'"+((confSelector || confCSS)?',':'')+"\n");
        if(confSelector){
            temp.push("\tselector: '"+this.preFijoPlantilla+"-"+this.template.folder+"'"+((confCSS)?',':'')+"\n");
        }
		if(confCSS){
            temp.push("\tstyleUrls: ['./"+this.preFijoPlantilla+"."+this.template.folder+".css']\n");
        }
		temp.push("})\n");
		temp.push("export class "+nombreClase+" extends "+prefijo+"Base implements OnInit, AfterViewInit, OnDestroy {\n\n");
        
        // Instanciaciones
        
        for(var eni_i in entidades.instancias){
            temp.push(entidades.instancias[eni_i]);
        }

		temp.push("\tconstructor("+vConstructorParam.join(", ")+"){\n");
        
            // Inicializaciones
        
            temp.push("\t\tsuper(ohService, cse, "+prefijoInit+"cs);\n\n");

            for(var eni_i in entidades.definiciones){
                temp.push(entidades.definiciones[eni_i]);
            }

            if(this.design.config.confAlertOut){
                temp.push("\t\tthis.cse.data.onBeforeUnload = true;\n");
            }

            if(tieneOhInstFiltro){
                temp.push("\t\tthis.ohInstanciarFiltro();\n");
            }

        temp.push("\t}\n\n");
        
        // Métodos predefinidos
        temp.push("\tngOnInit(){\n\n");
        if(this.seleccionado[0].tiene_id){
            temp.push("\t\tthis.route.params.subscribe(params => {\n");
            temp.push("\t\t\t//params['id'];\n");
            temp.push("\t\t});\n\n");
        }
        temp.push("\t}\n\n");
        
        temp.push("\tngAfterViewInit(){\n\n");
            if(this.design.config.confOnTop){
                temp.push("\t\tthis.cse.config.disableSeparator = true;\n\n");
            }
        temp.push("\t}\n\n");
        
        temp.push("\tngOnDestroy(){\n\n");
            if(this.design.config.confOnTop){
                temp.push("\t\tthis.cse.config.disableSeparator = false;\n\n");
            }
        temp.push("\t}\n\n");

        if(this.design.config.confAlertOut){
            temp.push("\t@HostListener('window:beforeunload', ['$event'])\n");
            temp.push("\tohOnUnload($event) {\n");
            temp.push("\t\t$event.returnValue = this.cse.config.mensajeRecarga;\n");
            temp.push("\t}\n\n");
        }

        // Métodos adicionales

        for(var meto_i in metodos){
            temp.push(metodos[meto_i]);
        }

		temp.push("}\n");

		return temp.join("");

    }

    // Nuevo
    seleccionado : any;
    procesar(){

        this.seleccionado = [];
        this.seleccionar(this.menuArbol, this.menu_id);
        var proyecto = this.seleccionado[this.seleccionado.length-1];
        
        this.preFijoPlantilla = proyecto.plantilla;

        if(this.seleccionado.length>1){
            var plantillaPadre = "";
            for(var i = 0; i <  this.seleccionado.length -1; i++){
                var item = this.seleccionado[i];
                // Obteniendo raiz de la fuente
                if(item.plantillaMenu){
                    plantillaPadre = item.plantillaMenu.folder +"/"+ plantillaPadre;
                }
            }
            this.plantillaPadre = plantillaPadre;
        } else {
            this.plantillaPadre = "";
        }

    }

    seleccionar(item : any, menu_id : number){
		if(item.menu_id == menu_id && typeof(item.menu_padre_id) != "undefined"){
			var encontrado = this.templateMenu.find(it => it.menu_id == item.menu_id);
			if(encontrado){
				item.plantillaMenu = encontrado;
            }
			this.seleccionado.push(item);
			this.seleccionar(this.menuArbol, item.menu_padre_id);
		} else {
			for(var i in item.hijos){
				this.seleccionar(item.hijos[i], menu_id);
			}
		}
    }

    setItem(design : any){
        this.design = design;
    }

    getURLView(){
        var mainURL = this.sources[1].url_proyect+"\\"+this.sources[1].url_main+"\\"+this.sources[1].url_core+"\\module\\"+this.preFijoPlantilla;
        return mainURL+"/view/"+this.plantillaPadre;
    }

    getPlantilla(){
        if(this.plantillaPadre.length > 0){
            return this.preFijoPlantilla+"/"+this.plantillaPadre.substr(0, this.plantillaPadre.length - 1);
        } else {
            return this.preFijoPlantilla
        }
    }

    public buildViewCSS(){
        return "/*Hoja CSS*/";
    }

    public buildViewCSSDescriptive(){
        return this.util.escapeHtml(this.buildViewCSS());
    }

}