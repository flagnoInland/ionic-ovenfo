import { OHBuilderView } from "./bui.builder.plantilla";

export class BUIBuilderPlantillaBase {

    buildView : OHBuilderView;

    constructor(dataConfig : any, viewConfig ?: any){
        this.buildView = new OHBuilderView(dataConfig, viewConfig);
    }
    
    public setViewDesign(view : any){
        this.buildView.setItem(view);
    }

    public getViewPreview(){ // primero se ejecuta setViewDesign
        return this.buildView.buildWebDescriptive(0);
    }

    public getTSPreview(){ // primero se ejecuta setViewDesign
        return this.buildView.buildViewTSDescriptive();
    }

    public getCSSPreview(){ // primero se ejecuta setViewDesign
        return this.buildView.buildViewCSSDescriptive();
    }

    public getTemplate(addCSS : boolean){ // primero se ejecuta setViewDesign

        var nuevoURL = this.buildView.getURLView();

        var archivos = [];
            archivos.push({
                name : this.buildView.preFijoPlantilla+"."+this.buildView.template.folder+".html",
                isRewritable : true,
                source : this.buildView.buildWeb(0),
                url : nuevoURL
            });
            archivos.push({
                name : this.buildView.preFijoPlantilla+"."+this.buildView.template.folder+".ts",
                isRewritable : true,
                source : this.buildView.buildViewTS(),
                url : nuevoURL
            });
            if(addCSS){
                archivos.push({
                    name : this.buildView.preFijoPlantilla+"."+this.buildView.template.folder+".css",
                    isRewritable : true,
                    source : this.buildView.buildViewCSS(),
                    url : nuevoURL
                });
            }

        return archivos;

    }

    public get(){ // primero se ejecuta setViewDesign
        return this.buildView.buildWebDescriptive(0);
    }

    public getPlantilla(){
        return this.buildView.getPlantilla();
    }

}