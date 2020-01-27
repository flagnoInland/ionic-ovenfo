import { Injectable } from '@angular/core';
import { OHService } from 'src/app/tis.ohService';
import { ADMMenuServiceJPO, pSegmenuListar } from '../ADM/service/adm.aDMMenuService';
import { BUIGNPlantillaMenuServiceJPO, pBuiplantillaMenuListar } from '../BUI/service/bui.bUIGNPlantillaMenuService';

@Injectable()
export class SHACoreService {

	public bUIGNPlantillaMenuService : BUIGNPlantillaMenuServiceJPO;

	public menuArbol : any = {
		loaded : false,
		menu_id : null,
		icono : "fas fa-hdd",
		titulo : "Inlandnet",
		hijos : [],
		hide : true
	};
	public plantillas_menu : any;
	public config : any = {
        proyecto_id : 2
    };

	private aDMMenuService : ADMMenuServiceJPO;;
	
	constructor(private ohService: OHService){
		this.aDMMenuService = new ADMMenuServiceJPO(ohService);
		this.bUIGNPlantillaMenuService = new BUIGNPlantillaMenuServiceJPO(ohService);
	}

    buiplantillaMenuListar(reRead ?: any){
        return new Promise((resolve, reject) => {
			if(this.plantillas_menu && !reRead){
				resolve();
			} else {
                this.bUIGNPlantillaMenuService.buiplantillaMenuListar({
                    proyecto_id : this.config.proyecto_id
                }, (resp : pBuiplantillaMenuListar) => {
					this.plantillas_menu = resp.plantillas;
                    resolve();
                });
			}
		});
	}

	listarArbolMenu(reRead ?: any){
		return new Promise((resolve, reject) => {
			if(this.menuArbol && this.menuArbol.loaded && !reRead){
				resolve();
			} else {
				this.aDMMenuService.segmenuListar((resp : pSegmenuListar[]) => {
					this.menuArbol.loaded = true;
					this.menuArbol.hijos = [];
					for(var i in resp){
						var item = resp[i];
							item["hijos"] = [];
							item["hide"] = true;
						this.menuArbol = this.buscarArbol(this.menuArbol, item);
					}
					resolve();
				});
			}
		});
	}

	private buscarArbol(item : any, itemAdd : any){
		if(item.menu_id == itemAdd.menu_padre_id){
			item.hijos.push(itemAdd);
		} else {
			for(var i in item.hijos){
				item.hijos[i] = this.buscarArbol(item.hijos[i], itemAdd);
			}
		}
		return item;
	}

}