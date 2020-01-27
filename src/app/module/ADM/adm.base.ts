import { OHService } from './../../tis.ohService';

import { ADMCoreService } from './adm.coreService';
import { ohStorage } from '../../ohCore/services/oh.core';
import { CoreService } from 'src/app/ind.coreService';
import { pGesinicializar } from './service/adm.aDMPrincipalService';
import { ADMPrincipalServiceImpJPO } from './service/adm.aDMPrincipalServiceImp';

export class ADMBase {

	precarga : Promise<any>;
	storage : ohStorage;
	
	aDMPrincipalService : ADMPrincipalServiceImpJPO;

    constructor(ohService : OHService, public cse : CoreService, public acs : ADMCoreService){

		this.storage = new ohStorage();
		this.aDMPrincipalService = new ADMPrincipalServiceImpJPO(ohService);
		
        this.precarga = new Promise((resolve, reject) => {
            this.loadData(resolve);
        });
	}

	loadData(resolve){

		if(!this.storage.has("APM_ADM_DATA")){

            this.acs.data = {
                catalogo : {}
            };

            var mycatalogo = [
                {id : 7,    nombre : "estado"},
                {id : 1,    nombre : "usuario_estado"},
                {id : 11,   nombre : "documento_unidad_negocio"},
                {id : 15,   nombre : "tipo_direccion"},
                {id : 17,   nombre : "rol_empresa"},
                {id : 19,   nombre : "empresa_config"},
                {id : 20,   nombre : "tipo_contacto"},
                {id : 22,   nombre : "carga_masiva_options"}
            ];
            for(var i in mycatalogo){
                this.cargarCatalogo(mycatalogo[i], (catalogo) => {
                    if(catalogo.nombre=="estado"){
                        this.parsearEstados("estado");
                    }
                });
            }
			
			this.aDMPrincipalService.gesinicializar({
				unidad_negocio_id : this.cse.data.user.profile,
				usuario_id : this.cse.data.user.data.userid
			}, (resp : pGesinicializar) => {
				this.acs.data = Object.assign({}, this.acs.data, resp);
				this.storage.set("APM_ADM_DATA", this.acs.data);
				resolve();
			});

		} else {
			this.acs.data = this.storage.get("APM_ADM_DATA");
			resolve();
		}

	}

    private cargarCatalogo(catalogo : any, call ?: any){
        this.cse.adm_catalogo.getCatalogoByPadre(catalogo.id).subscribe((elementos : any) => {
            this.acs.data.catalogo[catalogo.nombre] = elementos;
            this.storage.set("APM_ADM_DATA", this.acs.data);
            if(call){
                call(catalogo);
            }
        });
    }
    
    private parsearEstados(estado_nombre : string){
        var estado_objetos = {};
        for(var i in this.acs.data.catalogo[estado_nombre]){
            let estado = this.acs.data.catalogo[estado_nombre][i];
            estado_objetos[estado.catalogo_id] = Object.assign({descripcion : estado.descripcion}, JSON.parse(estado.variable_2));
        }
        this.acs.data[estado_nombre] = estado_objetos;
        this.storage.set("APM_ADM_DATA", this.acs.data);
    }
	
}