export class BUIBuilderMenu {

    ohbItem : any

    arbol : any;
    plantillas_menu : any; // [plantilla_menu_id, proyecto_id, menu_id, folder, diseno, fuente_ts, fuente_html, fuente_css]

    origen_web : any;
    sub_proyecto_web : any;

    sub_proyectos : any;
    
    item : any;
    menu_padre_id : any;

    noPlantillaMenu: boolean; // Indica que no se encontró una ruta de plantilla

    esSubroyecto : boolean;

    constructor(datos ?: {
        arbol : any, 
        plantillas_menu : any, 
        origen_web : any,
        origen_rest : any,
        sub_proyectos ?: any
    }){
        this.noPlantillaMenu = true;
        this.ohbItem = {};
        if(datos){
            this.arbol          = datos.arbol;
            this.plantillas_menu= datos.plantillas_menu;
            this.origen_web       = datos.origen_web;
            this.sub_proyectos  = datos.sub_proyectos;
        }
    }

    setOrigenWeb(origen_web : any){
        this.origen_web = origen_web;
    }
    setSubProyectoWeb(origen_web : any){
        this.sub_proyecto_web = origen_web;
    }

	obtenerDatos(menu_padre_id : any){

        this.menu_padre_id = menu_padre_id;
        this.arbolLinealObtener(); // <- this.ohbItem.selecciondo = []

        if(menu_padre_id != null){ // No considerar subproyectos

            var proyecto = this.ohbItem.seleccionado[this.ohbItem.seleccionado.length-1];
            
            this.ohbItem.preFijoPlantilla = proyecto.plantilla;

            // Buscando estructura de rutas

            if(this.ohbItem.seleccionado.length>1){

                var plantillaPadre = "";
                var plantillaGet = "";
                var plantillaGetProy = "";

                for(var i = 0; i <  this.ohbItem.seleccionado.length -1; i++){
                    var item = this.ohbItem.seleccionado[i];
                    
                    // Obteniendo raiz de la fuente
                    if(item.plantillaMenu){
                        plantillaPadre = item.plantillaMenu.folder +"/"+ plantillaPadre;
                    }
    
                    // Obteniendo la raiz de la petición GET
                    if(item.menu_padre_id != null){
                        plantillaGet = item.plantilla+((item.tiene_id)?'/:id':'')+((plantillaGet.length==0)?'':'/')+plantillaGet;
                    }

                    plantillaGetProy = item.plantilla+((item.tiene_id)?'/:id':'')+((plantillaGetProy.length==0)?'':'/')+plantillaGetProy;

                }

                this.ohbItem.plantillaPadre = plantillaPadre;
                this.ohbItem.plantillaGet = plantillaGet;
                this.ohbItem.plantillaGetProy = plantillaGetProy;

            } else {
                this.ohbItem.plantillaPadre = "";
                this.ohbItem.plantillaGet = "";
                this.ohbItem.plantillaGetProy = "";
            }
        }

    }

    private arbolLinealObtener(){
        this.ohbItem.seleccionado = [];
        this.noPlantillaMenu = true;
        this.arbolLinealAgregar(this.arbol, this.menu_padre_id);
    }

    private arbolLinealAgregar(arbolItem : any, menu_id : number){
		if(arbolItem.menu_id == menu_id && typeof(arbolItem.menu_padre_id) != "undefined"){
            var pmItem = this.plantillaMenuBuscar(arbolItem.menu_id);
			if(pmItem){
				arbolItem.plantillaMenu = pmItem;
            } else {
                if(arbolItem.menu_padre_id != null){
                    this.noPlantillaMenu = false;
                }
            }
			this.ohbItem.seleccionado.push(arbolItem);
			this.arbolLinealAgregar(this.arbol, arbolItem.menu_padre_id);
		} else {
			for(var i in arbolItem.hijos){
				this.arbolLinealAgregar(arbolItem.hijos[i], menu_id);
			}
		}
    }

    private plantillaMenuBuscar(menu_id : number){
        return this.plantillas_menu.find(it => it.menu_id == menu_id);
    }
/*
    obtener(item : any, menu_id : number){
		if(item.menu_id == (menu_id!=0?menu_id:null)){
			return item;
		} else {
			var retorno = false;
			for(var i in item.hijos){
				var retorno_hijo = this.obtener(item.hijos[i], menu_id);
				if(retorno_hijo){
					retorno = retorno_hijo;
					break;
				}
			}
			return retorno;
		}
	}
*/
    setItem(item : any, asignarRuta ?: boolean){
        this.item = item;
        if(!this.esSubroyecto){
            if(asignarRuta){
                var pmItem = this.plantillaMenuBuscar(item.menu_id);
                if(pmItem){
                    this.ohbItem.template_menu_id = pmItem.plantilla_menu_id;
                    this.ohbItem.ruta = pmItem.folder;
                    this.ohbItem.claseNombre = this.ohbItem.ruta[0].toUpperCase()+this.ohbItem.ruta.substr(1);
                }
            } else {
                this.ohbItem.claseNombre = this.ohbItem.ruta[0].toUpperCase()+this.ohbItem.ruta.substr(1);
            }
        }
    }
    
    tienePlantilla : boolean
    validarTienePlantilla(){
        if(this.esSubroyecto) {
            this.tienePlantilla = (this.sub_proyectos.find(it => it.abreviatura == this.ohbItem.plantilla.toUpperCase()))?true:false;
        } else {
            this.tienePlantilla = this.plantillaMenuBuscar(this.item.menu_id)?true:false;
        }
    }

    archivosBaseAgregar(coreTs : string, moduleTs : string, routingTs : string){

        // core.ts Agregando la nueva referencia
        coreTs +="export * from './"+this.ohbItem.plantillaPadre+this.ohbItem.ruta+"/"+this.ohbItem.preFijoPlantilla+"."+this.ohbItem.ruta+"';\n"

        // module.ts Agregando al módulo principal
        var moduleTsFilas = moduleTs.split("\n");
        var nuevoModuleTs = [];
        var buscaC = false; // Activamos la opción de buscar el corchete
        for(var i in moduleTsFilas){
            if(moduleTsFilas[i].indexOf("from './view/"+this.ohbItem.preFijoPlantilla+".core'") > 0){
                var fila = moduleTsFilas[i];
                var filaPartes = fila.split("}");
                nuevoModuleTs.push(filaPartes[0].trim()+", "+this.ohbItem.claseNombre+" }"+filaPartes[1]);
            } else {
                if(moduleTsFilas[i].indexOf("declarations") >= 0){
                    buscaC = true;
                }
                if(buscaC && moduleTsFilas[i].indexOf("]") >= 0){
                    var indexAnt = Number(i)-1;
                    nuevoModuleTs[indexAnt] = "\t\t"+nuevoModuleTs[indexAnt].trim()+", "+this.ohbItem.claseNombre;
                    buscaC = false;
                }
                nuevoModuleTs.push(moduleTsFilas[i]);
            }
        }
        moduleTs = nuevoModuleTs.join("\n");

        // routing.ts Agregando la ruta
        var routingTsFilas = routingTs.split("\n");
        var nuevoRoutingTs = [];
        for(var i in routingTsFilas){
            if(routingTsFilas[i].indexOf("from './view/"+this.ohbItem.preFijoPlantilla+".core'") > 0){
                var fila = routingTsFilas[i];
                var filaPartes = fila.split("}");
                nuevoRoutingTs.push(filaPartes[0].trim()+", "+this.ohbItem.claseNombre+" }"+filaPartes[1]);
            } else {
                if(routingTsFilas[i].indexOf("];") >= 0){
                    var indexAnt = Number(i)-1;
                    nuevoRoutingTs[indexAnt] = "\t"+nuevoRoutingTs[indexAnt].trim()+",";
                    var conId = (this.item.tiene_id=='1')?'/:id':'';
                    var preRutua = (this.ohbItem.plantillaGet)?this.ohbItem.plantillaGet+'/':''
					nuevoRoutingTs.push("\t"+"{ path: '"+preRutua+this.ohbItem.plantilla+conId+"', component: "+this.ohbItem.claseNombre+", canActivate: [tisCanActivateModule] }")
                }
                nuevoRoutingTs.push(routingTsFilas[i]);
            }
        }
        routingTs = nuevoRoutingTs.join("\n");

        return {
            coreTs : coreTs, 
            moduleTs : moduleTs, 
            routingTs : routingTs
        }

    }

    archivosBaseSubProyectoAgregar(routingTs : string, prefijoL : string){
        var prefijoU = prefijoL.toUpperCase();
        var routingTsFilas = routingTs.split("\n");
        var nuevoRoutingTs = [];
        for(var i in routingTsFilas){

            var ultima = routingTsFilas[i].charAt(routingTsFilas[i].length - 1);
            if(ultima == "}" && routingTsFilas[i].indexOf("module") >= 0){

                nuevoRoutingTs.push(routingTsFilas[i]+",");
                nuevoRoutingTs.push("    { path: '"+prefijoL+"', canActivate: [tisCanActivate], loadChildren: () => import('./module/"+prefijoU+"/"+prefijoL+".module').then(m => m."+prefijoU+"Module) }");
                
            } else {
                nuevoRoutingTs.push(routingTsFilas[i]);
            }

        }
        routingTs = nuevoRoutingTs.join("\n");

        return routingTs

    }

    archivosBaseQuitar(coreTs : string, moduleTs : string, routingTs : string){

        var rutaNueva = "export * from './"+this.ohbItem.plantillaPadre+this.ohbItem.preFijoPlantilla+"."+this.ohbItem.ruta+"';\n";
        coreTs = coreTs.replace(rutaNueva, "");

        // module.ts Agregando al módulo principal
        moduleTs = moduleTs.replace(new RegExp(", "+this.ohbItem.claseNombre+",", 'g'), ",");
        moduleTs = moduleTs.replace(new RegExp(", "+this.ohbItem.claseNombre+" }", 'g'), " }");
        moduleTs = moduleTs.replace(new RegExp(", "+this.ohbItem.claseNombre+"\n", 'g'), "\n");
        
        // routing.ts Agregando la ruta
        var data = ",\n\t{ path: '"+this.ohbItem.plantillaGet+"', component: "+this.ohbItem.claseNombre+", canActivate: [tisCanActivateModule] }";
        
        routingTs = routingTs.replace(data, "");
        routingTs = routingTs.replace(new RegExp(", "+this.ohbItem.claseNombre+",", 'g'), ",");
        routingTs = routingTs.replace(new RegExp(", "+this.ohbItem.claseNombre+" }", 'g'), " }");
        routingTs = routingTs.replace(new RegExp(", "+this.ohbItem.claseNombre+"\n", 'g'), "\n");

        return {
            coreTs : coreTs, 
            moduleTs : moduleTs, 
            routingTs : routingTs
        }

    }

    archivosBaseSubProyectoQuitar(routingTs : string){

        var prefiloL = this.ohbItem.plantilla.toLowerCase();
        var prefiloU = this.ohbItem.plantilla.toUpperCase();
        
        // routing.ts Agregando la ruta
        var data = ",\n    { path: '"+prefiloL+"', canActivate: [tisCanActivate], loadChildren: () => import('./module/"+prefiloU+"/"+prefiloL+".module').then(m => m."+prefiloU+"Module) }";
        //console.log("data");
        //console.log(data);
        routingTs = routingTs.replace(data, "");

        return routingTs;

    }

    getPlantillaTS(){
		var prefijo = this.ohbItem.preFijoPlantilla.toUpperCase();
		var temp = [];

		temp.push("import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';\n\n");

		temp.push("import { OHService } from 'src/app/tis.ohService';\n");
		temp.push("import { CoreService } from 'src/app/ind.coreService';\n\n");
		
		temp.push("import { "+prefijo+"CoreService } from 'src/app/module/"+prefijo+"/"+this.ohbItem.preFijoPlantilla+".coreService';\n");
		temp.push("import { "+prefijo+"Base } from 'src/app/module/"+prefijo+"/"+this.ohbItem.preFijoPlantilla+".base';\n\n");
		
		temp.push("@Component({\n");
		temp.push("\ttemplateUrl: './"+this.ohbItem.preFijoPlantilla+"."+this.ohbItem.ruta+".html'\n");
		temp.push("})\n");
        temp.push("export class "+this.ohbItem.claseNombre+" extends "+prefijo+"Base implements OnInit, AfterViewInit, OnDestroy {\n\n");
        
        var letterFirst = prefijo.charAt(0).toLowerCase();
		
		temp.push("\tconstructor(private ohService : OHService, public cse : CoreService, public "+letterFirst+"cs : "+prefijo+"CoreService){\n");
		temp.push("\t\tsuper(ohService, cse, "+letterFirst+"cs);\n");
		temp.push("\t}\n\n");
		
		temp.push("\tngOnInit(){\n\n");
		temp.push("\t}\n\n");
		
		temp.push("\tngAfterViewInit(){\n\n");
		temp.push("\t}\n\n");
		
		temp.push("\tngOnDestroy(){\n\n");
		temp.push("\t}\n\n");
		
		temp.push("}\n");

		return temp.join("");
    }
    
    getPlantillaSubPBase(prefijoL : string){
        var prefijoU = prefijoL.toUpperCase();
        var temp = [];

            temp.push("import { OHService } from 'src/app/tis.ohService';\n\n");

            temp.push("import { "+prefijoU+"CoreService } from './"+prefijoL+".coreService';\n");
            temp.push("import { ohStorage } from 'src/app/ohCore/services/oh.core';\n");
            temp.push("import { CoreService } from 'src/app/ind.coreService';\n\n");
            
            temp.push("export class "+prefijoU+"Base {\n\n");
            
            temp.push("    public precarga : Promise<any>;\n");
            temp.push("    storage : ohStorage;\n\n");
            
            temp.push("    constructor(ohService : OHService, public cse : CoreService, public "+prefijoL.charAt(0)+"cs : "+prefijoU+"CoreService){\n");
            temp.push("        this.storage = new ohStorage();\n");

            temp.push("        this.precarga = new Promise((resolve, reject) => {\n");
            temp.push("            this.loadData(() => {\n");
            temp.push("                resolve();\n");
            temp.push("            });\n");
            temp.push("        });\n\n");
            temp.push("    }\n\n");
            
            temp.push("    loadData(resolve : any){\n\n");
            
            temp.push("        if(this.storage.has(\"APM_"+prefijoU+"_DATA\")){\n");
            temp.push("            this."+prefijoL.charAt(0)+"cs.data = this.storage.get(\"APM_"+prefijoU+"_DATA\");\n");
            temp.push("            resolve();\n");
            temp.push("        } else {\n");
            temp.push("            this.storage.set(\"APM_"+prefijoU+"_DATA\", this."+prefijoL.charAt(0)+"cs.data);\n");
            temp.push("            resolve();\n");
            temp.push("        }\n\n");
            
            temp.push("    }\n\n");
            
            temp.push("}");

        return temp.join("");

    }

    getPlantillaSubPCore(prefijoU : string){

        var temp = [];
            temp.push("import { Injectable } from '@angular/core';\n\n");

            temp.push("@Injectable()\n");
            temp.push("export class "+prefijoU+"CoreService {\n\n");
            
            temp.push("    public data : any = {};\n");
            temp.push("    public config : any = {};\n\n");
            
            temp.push("}");

        return temp.join("");

    }

    getPlantillaSubModule(prefijoL : string){
        var prefijoU = prefijoL.toUpperCase();

        var temp = [];
            temp.push("import { NgModule } from '@angular/core';\n");
            temp.push("import { FormsModule } from '@angular/forms';\n");
            temp.push("import { CustomFormsModule } from 'ng2-validation';\n");
            temp.push("import { CommonModule } from '@angular/common';\n");
            temp.push("import { HttpClientModule } from '@angular/common/http';\n");
            
            temp.push("import { NgbModule } from '@ng-bootstrap/ng-bootstrap';\n");
            
            temp.push("import { TinyMceModule } from 'angular-tinymce';\n");
            temp.push("import { tinymceDefaultSettings } from 'angular-tinymce';\n");
            temp.push("import { QRCodeModule } from 'angularx-qrcode';\n");
            temp.push("import { NgxCurrencyModule } from 'ngx-currency';\n");
            
            temp.push("import { OHCore } from 'src/app/ohCore/oh.module';\n");
            
            temp.push("import { routing } from './"+prefijoL+".routing';\n");
            temp.push("import { "+prefijoU+"CoreService } from './"+prefijoL+".coreService';\n");
            temp.push("import { "+prefijoU+"Main } from './view/"+prefijoL+".core';\n\n");
            
            temp.push("@NgModule({\n");
            temp.push("    imports: [\n");
            temp.push("        routing,\n");
            temp.push("        NgbModule,\n");
            temp.push("        TinyMceModule.forRoot(tinymceDefaultSettings()),\n");
            temp.push("        QRCodeModule,\n");
            temp.push("        CommonModule, HttpClientModule, FormsModule, CustomFormsModule, OHCore,\n");
            temp.push("        NgxCurrencyModule],\n");
            temp.push("    declarations: [\n");
            temp.push("        "+prefijoU+"Main\n");
            temp.push("    ],\n");
            temp.push("    providers: ["+prefijoU+"CoreService]\n");
            temp.push("})\n");
            temp.push("export class "+prefijoU+"Module {}");

        return temp.join("");

    }

    getPlantillaSubRouting(prefijoL : string){
        var prefijoU = prefijoL.toUpperCase();

        var temp = [];

            temp.push("import { ModuleWithProviders } from '@angular/core';\n");
            temp.push("import { Routes, RouterModule } from '@angular/router';\n\n");
            
            temp.push("import { "+prefijoU+"Main } from './view/"+prefijoL+".core';\n");
            temp.push("import { tisCanActivateModule } from 'src/app/ind.canActivateModule';\n\n");
            
            temp.push("const routes: Routes = [\n");
            temp.push("    { path: '', component: "+prefijoU+"Main }\n");
            temp.push("];\n\n");
            
            temp.push("export const routing: ModuleWithProviders = RouterModule.forChild(routes);");

        return temp.join("");

    }

    getPlantillaSubViewCore(prefijoL : string){
        return "export * from './main/"+prefijoL+".main';\n";
    }

    getPlantillaSubViewStyle(){
        return "";
    }

    getPlantillaSubMainHTML(prefijoL : string){
        var temp = [];
            temp.push("<div class=\"container-fluid\">\n");
            temp.push("	<div class=\"row\">\n");
            temp.push("		<div class=\"col-6 col-sm-4 col-md-3\" *ngFor=\"let item of cse.getTreeChild('/Be/"+prefijoL+"') | ohFilterField: 'type' : 2\">\n");
            temp.push("			<oh-link [link]=\"item.urlTree\" [text]=\"item.name\" [icon]=\"item.icon\"></oh-link>\n");
            temp.push("		</div>\n");
            temp.push("	</div>\n");
            temp.push("</div>\n");
        return temp.join("");
    }

    getPlantillaSubMainTS(prefijoL : string){
        var prefijoU = prefijoL.toUpperCase();

        var temp = [];
            temp.push("import { Component, AfterViewInit, OnInit} from '@angular/core';\n");
            temp.push("import { Router } from '@angular/router';\n\n");
            
            temp.push("import { OHService } from 'src/app/tis.ohService';\n");
            temp.push("import { CoreService } from 'src/app/ind.coreService';\n\n");
            
            temp.push("import { "+prefijoU+"Base } from 'src/app/module/"+prefijoU+"/"+prefijoL+".base';\n");
            temp.push("import { "+prefijoU+"CoreService } from 'src/app/module/"+prefijoU+"/"+prefijoL+".coreService';\n\n");
            
            temp.push("@Component({\n");
            temp.push("  templateUrl: './"+prefijoL+".main.html'\n");
            temp.push("})\n");
            temp.push("export class "+prefijoU+"Main extends "+prefijoU+"Base implements OnInit, AfterViewInit {\n\n");
                
            temp.push("    constructor(private router : Router, private ohService : OHService, public cse : CoreService, public "+prefijoL.charAt(0)+"cs : "+prefijoU+"CoreService){\n");
            temp.push("        super(ohService, cse, "+prefijoL.charAt(0)+"cs);\n");
            temp.push("    }\n\n");
            
            temp.push("    ngOnInit(){\n");
            temp.push("        var childrens = this.cse.getTreeChild('/Be/"+prefijoL+"').filter(child => child.type == 2);\n");
            temp.push("        if(childrens.length == 1){\n");
            temp.push("            this.router.navigate([childrens[0].urlTree]);\n");
            temp.push("        }\n");
            temp.push("    }\n\n");
            
            temp.push("    ngAfterViewInit(){\n");
            temp.push("         this.ohService.getOH().getLoader().close();\n");
            temp.push("    }\n\n");
            
            temp.push("}");

        return temp.join("");

    }

    setDatos(datos : any){
        this.ohbItem.plantilla = datos.plantilla;
        this.esSubroyecto = datos.esSubroyecto;
    }

	validarNombres(menu_padre_id : number) : string {

		var datos = this.arbolObtener(this.arbol, menu_padre_id);

		var urlPlantilla = (menu_padre_id != 0)?this.ohbItem.plantilla:this.ohbItem.plantilla.toLowerCase();

		var encontroRuta = datos.hijos.find(it => it.plantilla == urlPlantilla);

		if(menu_padre_id != 0 && encontroRuta){ // Valida que las urls no sean las mismas
			return "La URL referencia ya esta siendo usada, ingrese otro";
		}

		if(this.ohbItem.habilitar){

			var datosBase = null;
			if(datos.menu_base_id == null){ // Es un subproyecto y deberá regirse dentro de 
				datosBase = this.arbolObtener(this.arbol, menu_padre_id);
			} else {
				datosBase = this.arbolObtener(this.arbol, datos.menu_base_id);
			}
			
			var datos = this.arbolObtener(this.arbol, 179);
			
			var encontroCarpeta = this.validarPlantillaHijos(datosBase, this.ohbItem.ruta);
			if(menu_padre_id != 0 && encontroCarpeta){ // Valida que no se repitan carpetas (clase) dentro del mismo proyecto
				return "El nombre de plantilla ya esta siendo usado, ingrese otro";
            }
            
			var entronSubProyecto = this.sub_proyectos.find(it => (it.abreviatura && it.abreviatura.toLowerCase()) == urlPlantilla);
			if(menu_padre_id == 0 && entronSubProyecto){
				return "La URL referencia (Prefijo) ya existe en otro subproyecto, ingrese otro";
			}
        }
                
       return "";

	}

		private arbolObtener(item : any, menu_id : number){
			if(item.menu_id == (menu_id!=0?menu_id:null)){
				return item;
			} else {
				var retorno = false;
				for(var i in item.hijos){
					var retorno_hijo = this.arbolObtener(item.hijos[i], menu_id);
					if(retorno_hijo){
						retorno = retorno_hijo;
						break;
					}
				}
				return retorno;
			}
		}

		private validarPlantillaHijos(item : any, plantilla : string){
			var respuesta = false;
			for(var i in item.hijos){
                var pmItem = this.plantillaMenuBuscar(item.hijos[i].menu_id);

				if(pmItem && pmItem.folder == plantilla){
					respuesta = true;
					break;
				} else {
					respuesta = this.validarPlantillaHijos(item.hijos[i], plantilla);
					if(respuesta){
						break;
					}
				}
			}
			return respuesta;
		}


}