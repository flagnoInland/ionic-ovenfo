import { BUIBuilderMenu } from "./bui.builder.menu";
import { pBuiservicioWebObtener } from "../service/bui.bUIGNServicioWebService";
import { obtenerArchivos_archivos } from "../service/bui.bUIGNPrincipalServiceImp";

export class BUIBuilderMenuBase {

    private config : any;
    menu : BUIBuilderMenu;

    constructor(coreData : any, datos ?: any){
        this.config = coreData;
        this.menu = new BUIBuilderMenu(datos);
    }

    public consultarArchivos() : any {

        if(this.menu.esSubroyecto){

            return [this.getUrlRest()+"\\ind.route.ts"];

        } else {
            
            this.menu.ohbItem.mainURL = this.getUrlRest()+"\\module\\"+this.menu.ohbItem.preFijoPlantilla;
    
            var opciones = [];
                opciones.push(this.menu.ohbItem.mainURL+"\\view\\"+this.menu.ohbItem.preFijoPlantilla+".core.ts");
                opciones.push(this.menu.ohbItem.mainURL+"\\"+this.menu.ohbItem.preFijoPlantilla+".module.ts");
                opciones.push(this.menu.ohbItem.mainURL+"\\"+this.menu.ohbItem.preFijoPlantilla+".routing.ts");
    
            return opciones;

        }

    }

    // Sub proyecto -> Eliminar
    public rutaObtenerSubProyectoEliminar(resp : obtenerArchivos_archivos[]){
        
        var archivos_editar = [];
            archivos_editar.push({
                url             : this.getUrlRest(),
                name            : "ind.route.ts",
                isRewritable    : true,
                source          : this.menu.archivosBaseSubProyectoQuitar(resp[0].archivo),
            });

        var archivos_borrar = [];
            archivos_borrar.push({
                url             : this.getUrlRest()+"\\module",
                name            : this.menu.ohbItem.plantilla.toUpperCase()
            });

        return {
            editar : archivos_editar,
            borrar : archivos_borrar
        };
    }

    // menu -> Eliminar
    public rutaObtenerMenuEliminar(resp : obtenerArchivos_archivos[]){

        var bases = this.menu.archivosBaseQuitar(resp[0].archivo, resp[1].archivo, resp[2].archivo);

        var archivos_editar = [];
            archivos_editar.push({
                name : this.menu.ohbItem.preFijoPlantilla+".core.ts",
                isRewritable : true,
                source : bases.coreTs,
                url : this.menu.ohbItem.mainURL+"\\view"
            });
            archivos_editar.push({
                name : this.menu.ohbItem.preFijoPlantilla+".module.ts",
                isRewritable : true,
                source : bases.moduleTs,
                url : this.menu.ohbItem.mainURL
            });
            archivos_editar.push({
                name : this.menu.ohbItem.preFijoPlantilla+".routing.ts",
                isRewritable : true,
                source : bases.routingTs,
                url : this.menu.ohbItem.mainURL
            });

        var archivos_borrar = [];
            archivos_borrar.push({
                url             : this.getUrlRest()+"\\module",
                name            : this.menu.ohbItem.plantilla.toUpperCase()
            });
            archivos_borrar.push({
                name : this.menu.ohbItem.preFijoPlantilla+"."+this.menu.ohbItem.ruta+".ts",
                url : this.menu.ohbItem.mainURL+"/view/"+this.menu.ohbItem.plantillaPadre
            });
            archivos_borrar.push({
                name : this.menu.ohbItem.preFijoPlantilla+"."+this.menu.ohbItem.ruta+".html",
                url : this.menu.ohbItem.mainURL+"/view/"+this.menu.ohbItem.plantillaPadre
            });

        return {
            editar : archivos_editar,
            borrar : archivos_borrar
        };

    }

    // menuEdit
    public rutaObtenerSubProyectoEditar(plantilla : string, fuentes : obtenerArchivos_archivos[]){

        var prefijoU = plantilla.toUpperCase();
        var prefijoL = plantilla.toLowerCase();
        var nuevoURLModule = this.getUrlRest()+"\\module\\"+prefijoU;
        
        var archivos = [];

            archivos.push({
                name            : prefijoL+".base.ts",
                isRewritable    : true,
                source          : this.menu.getPlantillaSubPBase(prefijoL),
                url             : nuevoURLModule
            });
            archivos.push({
                name            : prefijoL+".coreservice.ts",
                isRewritable    : true,
                source          : this.menu.getPlantillaSubPCore(prefijoU),
                url             : nuevoURLModule
            });
            archivos.push({
                name            : prefijoL+".module.ts",
                isRewritable    : true,
                source          : this.menu.getPlantillaSubModule(prefijoL),
                url             : nuevoURLModule
            });
            archivos.push({
                name            : prefijoL+".routing.ts",
                isRewritable    : true,
                source          : this.menu.getPlantillaSubRouting(prefijoL),
                url             : nuevoURLModule
            });
            archivos.push({
                name            : "",
                isRewritable    : true,
                source          : "",
                url             : nuevoURLModule+"\\service"
            });
            archivos.push({
                name            : prefijoL+".core.ts",
                isRewritable    : true,
                source          : this.menu.getPlantillaSubViewCore(prefijoL),
                url             : nuevoURLModule+"\\view"
            }); 
            archivos.push({
                name            : prefijoL+".style.css",
                isRewritable    : true,
                source          : this.menu.getPlantillaSubViewStyle(),
                url             : nuevoURLModule+"\\view"
            });
            archivos.push({
                name            : prefijoL+".main.html",
                isRewritable    : true,
                source          : this.menu.getPlantillaSubMainHTML(prefijoL),
                url             : nuevoURLModule+"\\view\\main"
            });
            archivos.push({
                name            : prefijoL+".main.ts",
                isRewritable    : true,
                source          : this.menu.getPlantillaSubMainTS(prefijoL),
                url             : nuevoURLModule+"\\view\\main"
            });
            archivos.push({
                name            : "ind.route.ts",
                isRewritable    : true,
                source          : this.menu.archivosBaseSubProyectoAgregar(fuentes[0].archivo, prefijoL),
                url             : this.getUrlRest()
            });

        return archivos;

    }

    // menuEdit
    public rutaObtenerMenuEditar(item : any, fuentes : obtenerArchivos_archivos[]){

		this.menu.setItem(item);

        var bases = this.menu.archivosBaseAgregar(fuentes[0].archivo, fuentes[1].archivo, fuentes[2].archivo);
        var nuevoURL = this.menu.ohbItem.mainURL+"/view/"+this.menu.ohbItem.plantillaPadre+"/"+this.menu.ohbItem.ruta;
        
        var archivos = [];

            archivos.push({
                name : this.menu.ohbItem.preFijoPlantilla+"."+this.menu.ohbItem.ruta+".ts",
                isRewritable : true,
                source : this.menu.getPlantillaTS(),
                url : nuevoURL
            });
            archivos.push({
                name : this.menu.ohbItem.preFijoPlantilla+"."+this.menu.ohbItem.ruta+".html",
                isRewritable : true,
                source : "Hola Mundo",
                url : nuevoURL
            });
            archivos.push({
                name : this.menu.ohbItem.preFijoPlantilla+".core.ts",
                isRewritable : true,
                source : bases.coreTs,
                url : this.menu.ohbItem.mainURL+"\\view"
            });
            archivos.push({
                name : this.menu.ohbItem.preFijoPlantilla+".module.ts",
                isRewritable : true,
                source : bases.moduleTs,
                url : this.menu.ohbItem.mainURL
            });
            archivos.push({
                name : this.menu.ohbItem.preFijoPlantilla+".routing.ts",
                isRewritable : true,
                source : bases.routingTs,
                url : this.menu.ohbItem.mainURL
            });

        return archivos;

	}

    private getUrlRest(){
        return this.menu.origen_web.url_proyecto+this.menu.sub_proyecto_web.url_fuente+"\\"+this.menu.origen_web.url_principal+"\\"+this.menu.origen_web.url_core;
    }

    getMenu() : BUIBuilderMenu {
        return this.menu;
    }

}