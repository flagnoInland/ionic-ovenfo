import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';
import { BUIBase } from '../../bui.base';
import { BUICoreService } from '../../bui.coreService';
import { BUIGNPlantillaMenuServiceJPO, pBuiplantillaMenuListar } from '../../service/bui.bUIGNPlantillaMenuService';
import { SHACoreService } from 'src/app/module/sharedAdmin/sha.coreService';

export class BUIMenuBase extends BUIBase {
	
	public bUIGNPlantillaMenuService : BUIGNPlantillaMenuServiceJPO;

	origen_id_web : any;

	proyecto : any;
	proyecto_id : any;
	
	arbol : any = {
		hijos : []
	}

	constructor(ohService : OHService, public cse : CoreService, public bcs : BUICoreService, public scs : SHACoreService){

		super(ohService, cse, bcs);

		this.bUIGNPlantillaMenuService = new BUIGNPlantillaMenuServiceJPO(ohService);

	}

    buiplantillaMenuListar(reRead ?: any){
        return new Promise((resolve, reject) => {
			if(this.bcs.plantillas_menu && !reRead){
				resolve();
			} else {
                this.bUIGNPlantillaMenuService.buiplantillaMenuListar({
                    proyecto_id : this.bcs.config.proyecto_id
                }, (resp : pBuiplantillaMenuListar) => {
					this.bcs.plantillas_menu = resp.plantillas;
                    resolve();
                });
			}
		});
	}
	
	cargarArbol(){
		if(this.scs.menuArbol.hijos && this.scs.menuArbol.hijos.length>0){

			this.arbol = JSON.parse(JSON.stringify(this.scs.menuArbol));
			
			var sub_proyecto_id = this.bcs.data.sub_proyecto_id || this.bcs.config.sub_proyecto_inlandnet;

			var data = this.bcs.data.sub_proyectos.find(it => it.sub_proyecto_id == sub_proyecto_id);

			if(data && data.menu_id){
				var menuSubProyecto = this.arbol.hijos.find(it => it.menu_id == data.menu_id);
				if(menuSubProyecto){
					this.subProyectoObtener(menuSubProyecto.menu_id);
				}
			} else {
				this.subProyectoObtener(this.arbol.hijos[0].menu_id);
			}

		}
	}

	subProyectoObtener(menu_id : any){
		this.proyecto_id = menu_id;
		var menuSubProyecto = this.scs.menuArbol.hijos.find(it => it.menu_id == menu_id);
		if(menuSubProyecto){
			this.proyecto = {
				titulo : menuSubProyecto.titulo,
				icono : menuSubProyecto.icono,
			}
		}
	}

	obtenerOrigen(origen_id : any){
		return this.bcs.data.origenes.find(it => it.origen_id == origen_id);
	}

	obtenerSubProyecto(sub_proyecto_id : any){
		return this.bcs.data.sub_proyectos.find(it => it.sub_proyecto_id == sub_proyecto_id);
	}
	
}