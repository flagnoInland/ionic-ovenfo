import { Component, AfterViewInit, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';

import { ADMCoreService } from 'src/app/module/ADM/adm.coreService';
import { ADMBase } from 'src/app/module/ADM/adm.base';
import { ADMFormatoServiceJPO, pGesformatoPadreListar, pGesformatoObtener, pGesformatoActualizar, pGesformatoRegistrar } from 'src/app/module/ADM/service/adm.aDMFormatoService';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	templateUrl: './adm.emailtemplateEdit.html'
})
export class EmailtemplateEdit extends ADMBase implements OnInit, AfterViewInit, OnDestroy {

    private aDMFormatoService : ADMFormatoServiceJPO;
	
	@ViewChild('formatoContenido', { static: true }) tinymce;

	formatoEdit : any;
	atributo: string;
	descrip_config: any;
	content_config: any;

	constructor(private ohService : OHService, public cse : CoreService, public ccs : ADMCoreService, private route: ActivatedRoute, private router: Router, private modalService: NgbModal){
		super(ohService, cse, ccs);
		
		this.aDMFormatoService = new ADMFormatoServiceJPO(ohService);

		this.formatoEdit = {
			titulo : "",
			username : "",
			usuario_actualiza: this.cse.data.user.data.name + ' ' + this.cse.data.user.data.lastName,
			estados_options: [{
				label : "Activo",
				value : 1
			},{
				label : "Inactivo",
				value : 0
			}],
			estado : 1,
			descripcion: "",
			plantillas_padre: [],
			plantilla_padre: 1,
			atributos : [],
			atributos_clase : [],
			contenido: "",
			invalid : false
		};
		
		this.descrip_config = Object.assign({}, this.cse.tinymceConfig, {height: 270});
        this.content_config = Object.assign({}, this.cse.tinymceConfig, {height: 350});
		this.atributo = "";
	}

	ngOnInit(){
		this.gesformatoPadreListar();
        this.route.params.subscribe(params => {
			if(params['id']){
				this.formatoEdit.email_plantilla_id = params['id'];
				this.aDMFormatoService.gesformatoObtener({
					formato_id : this.formatoEdit.email_plantilla_id // Optional
				}, (resp : pGesformatoObtener) => {
					this.formatoEdit.email_plantilla_id = resp.formato.email_plantilla_id;
					this.formatoEdit.username = resp.formato.usuario_registro;
					this.formatoEdit.titulo = resp.formato.titulo;
					this.formatoEdit.destinatario = resp.formato.destinatario;
					this.formatoEdit.copia = resp.formato.copia;
					this.formatoEdit.copia_oculta = resp.formato.copia_oculta;
					this.formatoEdit.estado = +resp.formato.estado;
					this.formatoEdit.descripcion = resp.formato.descripcion;
					this.formatoEdit.plantilla_padre = resp.formato.email_plantilla_padre_id;
					this.formatoEdit.contenido = resp.formato.contenido;
					for (let index = 0; index < resp.atributos.length; index++) {
						this.formatoEdit.atributos.push(resp.atributos[index].campo);
						this.formatoEdit.atributos_clase.push("list-group-item list-group-item-success mb-2");
					}
				});
			}
        }); 
	}

	ngAfterViewInit(){}

	ngOnDestroy(){}
	
	gesformatoPadreListar(){
        this.aDMFormatoService.gesformatoPadreListar((resp : pGesformatoPadreListar[]) => {
			this.formatoEdit.plantillas_padre = resp;
        });
    }

	addAtributo(){
		if (this.atributo != ""){
			this.formatoEdit.invalid = true;
			let check: boolean = true;		
			for(var i = 0; i < this.formatoEdit.atributos.length; i++){ 
				if (this.formatoEdit.atributos[i] === this.atributo || this.formatoEdit.atributos[i] === "${" + this.atributo + "}") {
					check = false;
				}
			}
			if (check){
				this.formatoEdit.atributos.push(this.atributo);
				this.formatoEdit.atributos_clase.push("list-group-item list-group-item-danger mb-2");
				this.atributo = "";
			} else {
				this.ohService.getOH().getAd().warning('Atributo ' + this.atributo + ' ya en uso');
			}
		}
	}

	removeAtributo(atributo){
		for( var i = 0; i < this.formatoEdit.atributos.length; i++){ 
			if ( this.formatoEdit.atributos[i] === atributo) {
				this.formatoEdit.contenido = this.formatoEdit.contenido.split("${" + this.formatoEdit.atributos[i] + "}").join('');
				this.formatoEdit.atributos.splice(i, 1);
				this.formatoEdit.atributos_clase.splice(i, 1);
			  	i--;
			}
		}
	}

	writeAtributo(atributo){
		for( var i = 0; i < this.formatoEdit.atributos.length; i++){ 
			if ( this.formatoEdit.atributos[i] === atributo) {
				this.tinymce.editor.execCommand('mceInsertContent', false, "${" + this.formatoEdit.atributos[i] + "}");
			}
		}
		this.checkVariables();
	}

	checkVariables(){
		let var_count: number = 0;
		if(this.formatoEdit.atributos.length > 0){
			for( var i = 0; i < this.formatoEdit.atributos.length; i++){
				if(this.formatoEdit.contenido.includes("${" + this.formatoEdit.atributos[i] + "}")){
					this.formatoEdit.atributos_clase[i] = "list-group-item list-group-item-success mb-2";
					var_count++;
				} else {
					this.formatoEdit.atributos_clase[i] = "list-group-item list-group-item-danger mb-2";
				}
			}
			if(this.formatoEdit.titulo.value != "" && this.formatoEdit.descripcion != "" && this.formatoEdit.atributos.length == var_count){
				this.formatoEdit.invalid = false;
			}
		} else {
			if(this.formatoEdit.titulo.value != "" && this.formatoEdit.descripcion != "" && this.formatoEdit.contenido != ""){
				this.formatoEdit.invalid = false; 
			}
		}
	}

	verFormato(modalVerFormato){
		for (let index = 0; index < this.formatoEdit.plantillas_padre.length; index++) {
			if	(this.formatoEdit.plantilla_padre == this.formatoEdit.plantillas_padre[index].email_plantilla_id){
				this.formatoEdit.cotenido_visualizar = this.formatoEdit.plantillas_padre[index].contenido;
				this.formatoEdit.cotenido_visualizar = this.formatoEdit.cotenido_visualizar.replace('cid:LogoAPM.png', 'https://containerservices.inlandservices.com/assets/img/logo-01.svg');
				this.formatoEdit.cotenido_visualizar = this.formatoEdit.cotenido_visualizar.replace('${container}', this.formatoEdit.contenido);
			}			
		}
		this.modalService.open(modalVerFormato,{size : "lg"}).result.then((result) => {}, (reason) => {});
	}

	registrar(){
		(this.formatoEdit.email_plantilla_id) ? this.gesformatoActualizar() : this.gesformatoRegistrar()
	}

	gesformatoActualizar(){
        this.aDMFormatoService.gesformatoActualizar({
            formato_id : this.formatoEdit.email_plantilla_id, // Optional
            email_plantilla_padre_id : this.formatoEdit.email_plantilla_padre_id, // Optional
            contenido :this.formatoEdit.contenido, // Optional
            destinatario :this.formatoEdit.destinatario, // Optional
            copia :this.formatoEdit.copia, // Optional
            copia_oculta :this.formatoEdit.copia_oculta, // Optional
            titulo :this.formatoEdit.titulo, // Optional
            estado_plantilla : this.formatoEdit.estado, // Optional
            usuario_modificacion_id : this.cse.data.user.data.userid, // Optional
            descripcion :this.formatoEdit.descripcion, // Optional
			atributos : (this.formatoEdit.atributos.length > 0 ? JSON.stringify(this.formatoEdit.atributos) : null) // Optional
        }, (resp : pGesformatoActualizar) => {
			if(resp.estado == 1){
				this.ohService.getOH().getAd().success(resp.mensaje);
				this.router.navigate(['../../'], { relativeTo: this.route });
			} else {
				if(resp.estado == 0){
					this.ohService.getOH().getLoader().showError(resp.mensaje);
				} else {
					this.ohService.getOH().getAd().warning(resp.mensaje);
				}
			}
        });
	}
	
	gesformatoRegistrar(){
		if(!this.formatoEdit.invalid){
			this.aDMFormatoService.gesformatoRegistrar({
				email_plantilla_padre_id : this.formatoEdit.plantilla_padre, // Optional
				contenido : this.formatoEdit.contenido, // Optional
				destinatario : this.formatoEdit.destinatario, // Optional
				copia : this.formatoEdit.copia, // Optional
				copia_oculta : this.formatoEdit.copia_oculta, // Optional
				titulo : this.formatoEdit.titulo, // Optional
				estado_plantilla : this.formatoEdit.estado, // Optional
				usuario_registro_id : this.cse.data.user.data.userid, // Optional
				descripcion : this.formatoEdit.descripcion, // Optional
				atributos : (this.formatoEdit.atributos.length > 0 ? JSON.stringify(this.formatoEdit.atributos) : null) // Optional
			}, (resp : pGesformatoRegistrar) => {
				// console.log(resp);
				if(resp.estado == 1){
					this.ohService.getOH().getAd().success(resp.mensaje);
					this.router.navigate(['../'], { relativeTo: this.route });
				} else {
					if(resp.estado == 0){
						this.ohService.getOH().getLoader().showError(resp.mensaje);
					} else {
						this.ohService.getOH().getAd().warning(resp.mensaje);
					}
				}
			});
		}
	}

}