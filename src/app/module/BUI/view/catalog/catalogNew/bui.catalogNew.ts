import { Component, ViewChild } from '@angular/core';

import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';

import { BUICoreService } from 'src/app/module/BUI/bui.coreService';
import { BUIBase } from 'src/app/module/BUI/bui.base';
import { BUICatalogoServiceJPO, pGescatalogoRegistrar } from '../../../service/bui.bUICatalogoService';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

declare var JSONEditor: any;

@Component({
    templateUrl: './bui.catalogNew.html',
    styles: ['.table thead th {text-align: center;}']
})
export class CatalogNew extends BUIBase {

    private bUICatalogoService : BUICatalogoServiceJPO;
    
	@ViewChild("modalEditor", { static: true }) modalEditor: NgbModalRef;

    ohbOptions: any;
	item: any;
	
	constructor(private ohService : OHService, public cse : CoreService, public bcs : BUICoreService, private router: Router, private route: ActivatedRoute, private modalService: NgbModal){
		super(ohService, cse, bcs);
		this.bUICatalogoService = new BUICatalogoServiceJPO(ohService);

		this.item = {
            estadoCatalogo: "1",
            atributos: [{
                estado: "1",
            }]
        };

        this.ohbOptions = [];
        this.ohbOptions["p_gbgiii_option"] = [
            { id: "1", desc: "Activo", icon: "<i class='far fa-thumbs-up'></i>" },
            { id: "0", desc: "Inactivo", icon: "<i class='fas fa-thumbs-down'></i>" }
		];
		
		this.unidad_negocio_listar();
	}

    guardar() {
        this.gescatalogoRegistrar();
    }

    gescatalogoRegistrar() {
        this.bUICatalogoService.gescatalogoRegistrar({
            catalogo: this.item.catalogo,
            descricion: this.item.descricion,
            estadoCatalogo: this.item.estadoCatalogo,
            atributos: this.getAtributos(),
            usuario_id: this.cse.data.user.data.userid
        }, (resp: pGescatalogoRegistrar) => {
            if (resp.resp_estado.estado == 1) {
                this.ohService.getOH().getAd().success(resp.resp_mensaje.mensaje);
                let catalogo: any;
                catalogo = resp.catalogo_padre;
                this.cse.adm_catalogo.addCatalogo(catalogo)
                resp.catalogo.forEach(element => {
                    catalogo = element;
                    this.cse.adm_catalogo.addCatalogo(catalogo)
                });
                this.router.navigate(['../'], { relativeTo: this.route });
            } else {
                this.ohService.getOH().getLoader().showError(resp.resp_mensaje.mensaje);
            }
        });
    }
 

    atributoEliminar(index: number) {
        this.item.atributos.splice(index, 1);
    }

    atributoAgregar() {
        this.item.atributos.push({
            estado: "1",
        });
    }

    getAtributos(): string {
        var xml = [];
        for (var i = 0; i < this.item.atributos.length; i++) {
            xml.push("<Atributo>");
            if (this.item.atributos[i].unidad_negocio_id) {
                xml.push("<unidad_negocio_id>" + this.item.atributos[i].unidad_negocio_id + "</unidad_negocio_id>");
            }
            xml.push("<catalogo>" + this.item.atributos[i].descripcion + "</catalogo>");
            xml.push("<descripcion>" + ((this.item.atributos[i].descricion_larga)?this.item.atributos[i].descricion_larga:'') + "</descripcion>");          
            if(this.item.atributos[i].variable_1){
                xml.push("<variable1>" + this.item.atributos[i].variable_1 + "</variable1>");
            }
            if(this.item.atributos[i].variable_2){
                xml.push("<variable2>" + this.item.atributos[i].variable_2 + "</variable2>");
            }
            if(this.item.atributos[i].variable_3 == 0){
                this.item.atributos[i].variable_3 = '0';
            }
            if(this.item.atributos[i].variable_3){
                xml.push("<variable3>" + this.item.atributos[i].variable_3 + "</variable3>");
            }
            
            xml.push("<estado>" + this.item.atributos[i].estado + "</estado>");
            xml.push("</Atributo>");
        }
        return xml.join("");
    }

    editor_descripcion : string;
    abrirEditorJSON(indice : number){

        try {
            var jsonEdit : any;
            this.editor_descripcion = this.item.atributos[indice].descripcion;
            var jsonToEdit = JSON.parse(this.item.atributos[indice].variable_2 || "{}");
            this.modalService.open(this.modalEditor, {size : 'lg'}).result.then((result) => {
                if(result == "guardar"){
                    this.item.atributos[indice].variable_2 = JSON.stringify(jsonEdit.get());
                }
            }, () => {
            });
            
            setTimeout(() => {
                var jsoneditorDiv = document.getElementById("jsoneditor");
                jsonEdit = new JSONEditor(jsoneditorDiv, {modes : ["tree","view","code","text"]});
                jsonEdit.set(jsonToEdit);
            });
        } catch (e){
			this.ohService.getOH().getAd().warning("No se puede convertir a JSON");
		}
        
    }

	childsEditorJSON() {
		var jsonEdit: any;
		this.editor_descripcion = '';
		try {
			var jsonToEdit = this.item.atributos;
			this.modalService.open(this.modalEditor, { size: 'lg' }).result.then((result) => {
				if(result == "guardar"){                    
					this.item.atributos = jsonEdit.get();
					this.item.atributos.forEach(element => {
						delete element.catalogo_id;
					});
				}
			}, () => {
			});
			setTimeout(() => {
				var jsoneditorDiv = document.getElementById("jsoneditor");
				jsonEdit = new JSONEditor(jsoneditorDiv, { modes: ["tree", "view", "code", "text"] });
				jsonEdit.set(jsonToEdit);
			});;
		} catch (e) {
			this.ohService.getOH().getAd().warning("No se puede convertir a JSON");
		}
	}

}
