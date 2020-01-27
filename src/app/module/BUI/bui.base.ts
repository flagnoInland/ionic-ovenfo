import { OHService } from 'src/app/tis.ohService';

import { BUICoreService } from './bui.coreService';
import { ohStorage } from 'src/app/ohCore/services/oh.core';
import { CoreService } from 'src/app/ind.coreService';
import { BUIUnidadNegocioServiceJPO, pSegunidadNegocioListar } from './service/bui.bUIUnidadNegocioService';
import { BUIMenuServiceJPO, pSegmenuListarProyectos } from './service/bui.bUIMenuService';
import { BUIPrincipalServiceJPO } from './service/bui.bUIPrincipalService';
import { pBuiinicializar } from './service/bui.bUIGNPrincipalService';
import { BUIGNPrincipalServiceJPOImp } from './service/bui.bUIGNPrincipalServiceImp';

export class BUIBase {
    
    precarga : Promise<any>;
    storage : ohStorage;

    bUIGNPrincipalService : BUIGNPrincipalServiceJPOImp;

    bUIPrincipalService : BUIPrincipalServiceJPO;
    bUIUnidadNegocioService : BUIUnidadNegocioServiceJPO;
    bUIMenuService : BUIMenuServiceJPO;

    constructor(ohService : OHService, public cse : CoreService, public bcs : BUICoreService){ // call ?: any deprecated
        this.storage = new ohStorage();

        this.bUIGNPrincipalService = new BUIGNPrincipalServiceJPOImp(ohService);
        this.bUIPrincipalService = new BUIPrincipalServiceJPO(ohService);
        this.bUIUnidadNegocioService = new BUIUnidadNegocioServiceJPO(ohService);
        this.bUIMenuService = new BUIMenuServiceJPO(ohService);

        this.precarga = new Promise((resolve, reject) => {
            this.loadData(resolve);
        });        
    }

    loadData(resolve : any){
        if(!this.storage.has("APM_BUI_DATA")){
            
            this.bcs.data.catalogo = {};

            var mycatalogo = [
                {id : 11,    nombre : "tipo_documento"},
                {id : 23,    nombre : "menu_configuracion"},
                {id : 25,    nombre : "tipo_un"},
                {id : 22,    nombre : "carga_masiva_options"}
            ];
            for(var i in mycatalogo){
                this.cargarCatalogo(mycatalogo[i]);
            }
            
            this.bUIGNPrincipalService.buiinicializar({
                proyecto_id : this.bcs.config.proyecto_id,
                usuario : this.cse.data.user.data.id
            }, (resp : pBuiinicializar) => {
                
                this.bcs.data = Object.assign({}, this.bcs.data, resp);
                this.bcs.data.origenes.forEach((item) => {
                    item.sub_tipo_nombre = this.bcs.config.origen[item.tipo][item.sub_tipo];
                    return item;
                })

                this.bcs.data.sub_proyectos_rest = this.bcs.data.sub_proyectos.filter(it => it.tipo == 1);
                this.bcs.data.sub_proyectos_web = this.bcs.data.sub_proyectos.filter(it => it.tipo == 2);
                
                var origenes_web = this.bcs.data.origenes.filter(it => it.tipo == 1);
                if(origenes_web && origenes_web.length>0){
                    this.bcs.data.origen_id_web = origenes_web[0].origen_id;
                }
                var origenes_rest = this.bcs.data.origenes.filter(it => it.tipo == 2);
                if(origenes_rest && origenes_rest.length>0){
                    this.bcs.data.origen_id_rest = origenes_rest[0].origen_id;
                }

                this.storage.set("APM_BUI_DATA", this.bcs.data);
                resolve();
            });
            
        } else {
            this.bcs.data = this.storage.get("APM_BUI_DATA");
            resolve();
        }

    }

    private cargarCatalogo(catalogo : any){
        this.cse.adm_catalogo.getCatalogoByPadre(catalogo.id).subscribe((elementos : any) => {
            this.bcs.data.catalogo[catalogo.nombre] = elementos;
            this.storage.set("APM_BUI_DATA", this.bcs.data);
        });
    }

    unidad_negocio_listar(){
        this.bUIUnidadNegocioService.segunidadNegocioListar({
            page : 1,
            size : 9999
        }, (resp : pSegunidadNegocioListar) => {
            this.bcs.item.unidades = resp.resultado;
        });
    }
    
    menu_proyectos_listar(){ // report edit new posible eliminacion
        this.bUIMenuService.segmenuListarProyectos((resp : pSegmenuListarProyectos[]) => {
            this.bcs.item.proyectos = resp;
        });
    }

    coreAgregar(campo : any, valor : any){
		this.bcs.data[campo] = valor;
		this.storage.add("APM_BUI_DATA", campo, valor);
    }

}