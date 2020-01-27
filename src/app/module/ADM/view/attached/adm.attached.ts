import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';

import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';

import { ADMCoreService } from 'src/app/module/ADM/adm.coreService';
import { ADMBase } from 'src/app/module/ADM/adm.base';
import { ADMAdjuntoServiceJPO, pGesadjuntoListar, gesadjuntoListar_adjuntos, pGesadjuntoDescarga, pGesadjuntoEliminar } from '../../service/adm.aDMAdjuntoService';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

/* For download file */
import * as FileSaver from 'file-saver';
import { BUIReferenciaServiceJPO, pGesreferenciaListar } from 'src/app/module/BUI/service/bui.bUIReferenciaService';


@Component({
	templateUrl: './adm.attached.html'
})
export class Attached extends ADMBase implements OnInit, AfterViewInit, OnDestroy {

	public filter: any;
	public pagin: any;

	/* Lista de adjuntos */
	private aDMAdjuntoService : ADMAdjuntoServiceJPO;
	adjuntosList : gesadjuntoListar_adjuntos[];

	/* Visualizar */
	data_file_64: String;
	data_pdf: String;

	/* Referencias */
	private bUIReferenciaService : BUIReferenciaServiceJPO;
	referenciasList : pGesreferenciaListar[];
	have_referencia : boolean;

	/* Eliminar */
	adjuntoSelected : gesadjuntoListar_adjuntos;
	check_del_file: boolean;

	constructor(private ohService : OHService, public cse : CoreService, public ccs : ADMCoreService, private modalService: NgbModal){		
		super(ohService, cse, ccs);

		this.aDMAdjuntoService = new ADMAdjuntoServiceJPO(ohService);
		this.adjuntosList = [];

        this.bUIReferenciaService = new BUIReferenciaServiceJPO(ohService);
		this.have_referencia = false;
		
		this.check_del_file = true;	
		this.filtroTab();
	}

	ngOnInit(){
		this.cse.config.disableSeparator = true;
	}

	ngAfterViewInit(){}

	ngOnDestroy(){
		this.cse.config.disableSeparator = false;
	}

	filtroTab(){
		this.pagin = {
			page: 1,
			total: 0,
			size_rows: 10,
		};
		this.filter = {
			startList : false,
			field : {},
			fields : {
				adjunto_id : {
					label : "Código",
					type : "",
					closeFilter : true
				},
				nombre : {
					label : "Nombre de Adjunto",
					type : "",
					closeFilter : true
				}
			}
		};
	}

	gesadjuntoListar(){
        this.aDMAdjuntoService.gesadjuntoListar({
			adjunto_id : this.filter.fields.adjunto_id.value,
			nombre : this.filter.fields.nombre.value,
            page : this.pagin.page,
            size : this.pagin.size_rows
        }, (resp : pGesadjuntoListar) => {
			this.pagin.total = resp.response.total;
			this.adjuntosList = resp.adjuntos;
        });
	}

	gesadjuntoDescarga(adjuntoSelected: any){
		this.adjuntoSelected = adjuntoSelected;
        this.aDMAdjuntoService.gesadjuntoDescarga({
            adjunto_id : this.adjuntoSelected.adjunto_id // Optional
        }, (resp : pGesadjuntoDescarga) => {
			// console.log(resp);
			if	(resp.data != null){
				this.ohService.getOH().getAd().success('Adjunto Descargado');
				FileSaver.saveAs(this.ohService.getOH().getUtil().base64strToBlog(resp.data), resp.nombre);
			} else {
				this.adjuntoSelected.es_descargable = false;
				this.ohService.getOH().getAd().warning('Adjunto ' + resp.nombre + ' no disponible');
				//this.ohService.getOH().getLoader().showError('Adjunto ' + resp.nombre + ' no disponible');
			}
        });
	}
	
	showFile(content, adjuntoSelected : gesadjuntoListar_adjuntos) {
		this.adjuntoSelected = adjuntoSelected;		
        this.aDMAdjuntoService.gesadjuntoDescarga({
            adjunto_id : this.adjuntoSelected.adjunto_id // Optional
        }, (resp : pGesadjuntoDescarga) => {
			if	(resp.data != null){
				
				var imageBase64 = resp.data;
				var blob = new Blob([imageBase64], {type: 'application/pdf'});
				var file = new File([blob], resp.nombre);

				var file_link = window.URL.createObjectURL(blob);

				this.data_file_64 = "data:application/pdf;base64," + resp.data;

				this.modalService.open(content).result.then((result) => {
				}, (reason) => {
				});

			} else {
				this.adjuntoSelected.es_descargable = false;
				this.ohService.getOH().getAd().warning('Adjunto ' + resp.nombre + ' no disponible');
			}
		});		
	}
	
	showConfirm(content, adjuntoSelected : gesadjuntoListar_adjuntos) {
		this.adjuntoSelected = adjuntoSelected;
		this.have_referencia = false;
		this.referenciasList = [];
	
		this.bUIReferenciaService.gesreferenciaListar({
			owner_in: 'ges',
			tabla_in: 'adjunto',
			value_in : String(this.adjuntoSelected.adjunto_id) // Optional
		}, (resp : pGesreferenciaListar[]) => {
			if	(resp.length > 0){
				this.have_referencia = true;
				this.referenciasList = resp;
			}
			this.modalService.open(content).result.then((result) => {}, (reason) => {});
		});
	}

    gesadjuntoEliminar(adjuntoSelected : gesadjuntoListar_adjuntos){
		this.adjuntoSelected = adjuntoSelected;
        this.aDMAdjuntoService.gesadjuntoEliminar({
			adjunto_id : this.adjuntoSelected.adjunto_id, // Optional
			del_file : Number(this.check_del_file) // Optional
        }, (resp : pGesadjuntoEliminar) => {
			this.modalService.dismissAll();
			if(resp.estado == 1){
				this.ohService.getOH().getAd().success(resp.mensaje);
			} else {
				if(resp.estado == 0){
					this.ohService.getOH().getLoader().showError(resp.mensaje);
				} else {
					this.ohService.getOH().getAd().warning(resp.mensaje);
				}
			}
			this.gesadjuntoListar();
		});
    }

}
