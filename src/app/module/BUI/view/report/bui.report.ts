import { Component, AfterViewInit, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';

import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';

import { BUICoreService } from 'src/app/module/BUI/bui.coreService';
import { BUIBase } from 'src/app/module/BUI/bui.base';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BUIReporteServiceJPO, gesreporteListar_reportes, pGesreporteListar, pGesreporteEliminar } from '../../service/bui.bUIReporteService';
import { Router } from '@angular/router';

@Component({
	templateUrl: './bui.report.html'
})
export class Report extends BUIBase implements OnInit, OnDestroy {
	
	private bUIReporteService : BUIReporteServiceJPO;

	@ViewChild("filterWindow", { static: true }) objFilter: TemplateRef<NgbActiveModal>;
	@ViewChild("modalVistaPrevia", { static: true }) modalVistaPrevia: TemplateRef<NgbActiveModal>;

	filter : any;
	pagin_page : number;
	pagin_size : number;
	pagin_total : number;
	reportes : any;

	constructor(private ohService : OHService, public cse : CoreService, public bcs : BUICoreService, private router : Router, private modalService: NgbModal){
		super(ohService, cse, bcs);

		this.bUIReporteService = new BUIReporteServiceJPO(ohService);
		this.pagin_page = 1;
		this.pagin_size = 10;
		this.reportes = [];
		this.instanceFilter();
	}

	ngOnInit(){
		this.cse.config.disableSeparator = true;
		this.list();
	}

	ngOnDestroy(){
		this.cse.config.disableSeparator = false;
	}

	instanceFilter(){

		this.filter = {};
		this.filter.field = {};
		this.filter.fields = {};

		this.filter.fields.estado = {
			label : "Estado",
			type : "",
			closeFilter : true
		};

		this.filter.fields.nombre = {
			label : "Nombre",
			type : "",
			closeFilter : true
		};

		this.filter.fields.nombre_store = {
			label : "Store",
			type : "",
			closeFilter : true
		};

		this.filter.beforeFilter = () => {
			this.filter.fields = this.filter.field;
			if(this.filter.fields.estado.value != null){
				this.filter.fields.estado.descValue = (this.filter.fields.estado.value==1)?'Activo':'Inactivo';
			}
			if(this.filter.fields.nombre.value && this.filter.fields.nombre.value.length == 0){
				this.filter.fields.nombre.value = null;
			}
			if(this.filter.fields.nombre_store.value && this.filter.fields.nombre_store.value.length == 0){
				this.filter.fields.nombre_store.value = null;
			}
     		this.filter.doFilter();
		};

		this.filter.doFilter = () => {
			this.list();
		};

	}

	list(){
        this.bUIReporteService.gesreporteListar({
            estado : this.filter.fields.estado.value, // Optional
            nombre : this.filter.fields.nombre.value, // Optional
            nombre_store : this.filter.fields.nombre_store.value, // Optional
			Page : this.pagin_page,
			Size : this.pagin_size,
        }, (resp : pGesreporteListar) => {
			this.reportes = resp.reportes;
			this.pagin_total = resp.resultado.total;
        });
	}

	eliminarConfirmar(reporte_id : number){
		this.ohService.getOH().getUtil().confirm("¿Confirma eliminar el reporte seleccionado?", () => {
			this.bUIReporteService.gesreporteEliminar({
				reporte_id : reporte_id
			}, (resp : pGesreporteEliminar) => {
				if(resp.estado == 1){
					this.ohService.getOH().getAd().success(resp.mensaje);
					this.list();
				} else {
					this.ohService.getOH().getAd().warning(resp.mensaje);
				}
			});
		});
	}


	vistaPrevia(item : gesreporteListar_reportes){
		this.itemReporte = item;
		this.vistaPreviaStore(item);
		this.vistaPreviaSQL(item);
	}

	itemReporte : any
	vistaPreviaStore(item : gesreporteListar_reportes){
		var params = JSON.parse(item.parametros);
		var params_dynamic = params.filter(it => it.parametroTipo == "dynamic");
		var params_fixed = params.filter(it => it.parametroTipo == "fixed");
		
		var vista = [];
		var vistaBusq = [];

			vista.push("CREATE PROC "+item.nombre_store+" (\n");

			if(params_fixed.find(it => it.variable == "pf_unidad_negocio_id")){
				vista.push("	@pf_unidad_negocio_id INT,\n");
			}
			if(params_fixed.find(it => it.variable == "pf_usuario_id")){
				vista.push("	@pf_usuario_id INT,\n");
			}
			if(params_fixed.find(it => it.variable == "pf_usuario_identificador")){
				vista.push("	@pf_usuario_identificador VARCHAR(100),\n");
			}

			
			for(var i in params_dynamic){
				var it = params_dynamic[i];
				
				var tipoParam = "";
				switch(it.tipo){
					case "1" : tipoParam = "VARCHAR("+it.longitudMaxima+")"; break;
					case "2" : tipoParam = "INT"; break;
					case "3" : tipoParam = "VARCHAR(MAX)"; break;
					case "4" : tipoParam = "DATE"; break;
					case "5" : tipoParam = "DATE"; break;
					case "6" : tipoParam = "BIT"; break;
					case "7" : tipoParam = "VARCHAR(MAX)"; break;
				}

				if(it.tipo == "5"){
					vista.push("	@pd_"+it.parametro+"_desde DATE,\n");
					vista.push("	@pd_"+it.parametro+"_hasta DATE,\n");
				} else {
					vista.push("	@pd_"+it.parametro+" "+tipoParam+",\n");
				}

				// Busqueda
				if(it.tipo == "1"){
					vistaBusq.push("		(@pd_"+it.parametro+" IS NULL OR TAB."+it.parametro+" LIKE @pd_"+it.parametro+") AND\n");
				} else if(it.tipo == "5") {
					vistaBusq.push("		((@pd_"+it.parametro+"_desde IS NULL AND @pd_"+it.parametro+"_hasta IS NULL) OR TAB."+it.parametro+" BETWEEN @pd_"+it.parametro+"_desde AND CONVERT(VARCHAR(10), @pd_"+it.parametro+"_hasta, 111)+' 23:59:59') AND\n");
				} else {
					vistaBusq.push("		(@pd_"+it.parametro+" IS NULL OR TAB."+it.parametro+" = @pd_"+it.parametro+") AND\n");
				}
				
			}

			vistaBusq.push("		1 = 1");
			
			vista.push("	@pagina INT,\n");
			vista.push("	@cantidad INT\n");
			vista.push(")\n");
			vista.push("AS\n\n");
			
			vista.push("SET NOCOUNT ON\n\n");
			
			vista.push("	SELECT\n");
			vista.push("		TAB.campo_1                             AS 'Campo 1',\n");
			vista.push("		CONVERT(VARCHAR(10), TAB.campo_2, 111)  AS 'Campo 2',\n");
			vista.push("		ISNULL(TAB.campo_3, '')                 AS 'Campo 3'\n");
			vista.push("	FROM \n");
			vista.push("		esq.tabla TAB\n");
			vista.push("	WHERE\n");

				if(params_fixed.find(it => it.variable == "pf_unidad_negocio_id")){
					vista.push("		(@pf_unidad_negocio_id IS NULL OR TAB.unidad_negocio_id = @pf_unidad_negocio_id) AND\n");
				}
				if(params_fixed.find(it => it.variable == "pf_usuario_id")){
					vista.push("		(@pf_usuario_id IS NULL OR TAB.usuario_id = @pf_usuario_id) AND\n");
				}
				if(params_fixed.find(it => it.variable == "pf_usuario_identificador")){
					vista.push("		(@pf_usuario_identificador IS NULL OR TAB.usuario_identificador = @pf_usuario_identificador) AND\n");
				}

				vista.push(vistaBusq.join("")+"\n\n");

			vista.push("	ORDER BY 1 DESC\n");
			vista.push("	OFFSET ((@pagina - 1)* @cantidad) ROWS\n");
			vista.push("	FETCH NEXT @cantidad ROWS ONLY;\n\n");
			
			vista.push("	SELECT COUNT(*)\n");
			vista.push("	FROM \n");
			vista.push("		esq.tabla TAB\n");
			vista.push("	WHERE\n");

			if(params_fixed.find(it => it.variable == "pf_unidad_negocio_id")){
				vista.push("		(@pf_unidad_negocio_id IS NULL OR TAB.unidad_negocio_id = @pf_unidad_negocio_id) AND\n");
			}
			if(params_fixed.find(it => it.variable == "pf_usuario_id")){
				vista.push("		(@pf_usuario_id IS NULL OR TAB.usuario_id = @pf_usuario_id) AND\n");
			}
			if(params_fixed.find(it => it.variable == "pf_usuario_identificador")){
				vista.push("		(@pf_usuario_identificador IS NULL OR TAB.usuario_identificador = @pf_usuario_identificador) AND\n");
			}

			vista.push(vistaBusq.join("")+"\n");

		this.itemReporte.vistaPrevia = vista.join("");
		this.modalService.open(this.modalVistaPrevia, { size: 'lg' }).result.then((result) => {
				
			}, (reason) => {
			
		});
		

	}

	vistaPreviaSQL(item : gesreporteListar_reportes){
		
		let sql = [];
		var descrip = item.descripcion.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
			return '&#'+i.charCodeAt(0)+';';
		});;

		sql.push("SET IDENTITY_INSERT ges.reporte ON"+"\n");
		sql.push('INSERT INTO ges.reporte (reporte_id, menu_id, nombre, descripcion, nombre_store, parametros, estado, usuario_registro_id, fecha_registro) VALUES ('+item.reporte_id+', (SELECT menu_id FROM seg.menu WHERE plantilla = \''+item.plantilla+'\'), \''+item.nombre+'\', \''+descrip+'\', \''+item.nombre_store+'\', \''+item.parametros+'\', \''+(item.estado?'1':'0')+'\', \'1\', CURRENT_TIMESTAMP)'+'\n');
		sql.push("SET IDENTITY_INSERT ges.reporte OFF"+"\n");

		var roles = this.getRoles(item.roles);
		for(var i = 0; i < roles.length; i++){
			sql.push('INSERT INTO ges.reporte_rol (reporte_id, rol_id) VALUES ('+item.reporte_id+', (SELECT rol_id FROM seg.rol WHERE id = \''+roles[i]+'\'))'+'\n');
		}
		this.itemReporte.vistaSQL = sql.join("");

		sql = [];
		sql.push('UPDATE ges.reporte SET menu_id = (SELECT menu_id FROM seg.menu WHERE plantilla = \''+item.plantilla+'\'), nombre = \''+item.nombre+'\', descripcion = \''+descrip+'\', nombre_store = \''+item.nombre_store+'\', parametros = \''+item.parametros+'\', estado = \''+(item.estado?'1':'0')+'\', usuario_modificacion_id =  \'1\', fecha_modificacion = CURRENT_TIMESTAMP WHERE reporte_id = '+item.reporte_id+'\n');
		sql.push('DELETE FROM ges.reporte_rol WHERE reporte_id = '+item.reporte_id+"\n");

		var roles = this.getRoles(item.roles);
		for(var i = 0; i < roles.length; i++){
			sql.push('INSERT INTO ges.reporte_rol (reporte_id, rol_id) VALUES ('+item.reporte_id+', (SELECT rol_id FROM seg.rol WHERE id = \''+roles[i]+'\'))'+'\n');
		}
		this.itemReporte.vistaSQLUpdate = sql.join("");
		

	}

	getRoles(roles_xml : any){
		var roles = [];
		if(roles_xml){
			var misRoles = this.ohService.getOH().getUtil().StringXMLtoJSON(roles_xml);
			if(misRoles && misRoles.resultado && misRoles.resultado.roles_id){
				var roles_id = [];
				if(misRoles.resultado.roles_id.length){
					for(var i in misRoles.resultado.roles_id){
						roles.push(misRoles.resultado.roles_id[i]["@attributes"].id);
					}
				} else{
					roles.push(misRoles.resultado.roles_id["@attributes"].id);
				}
			}
		}
		return roles;
	}

	copiarStore(){
		var texto_copiar : any = document.getElementById("inp_preview_insert");
		texto_copiar.select();
		document.execCommand("copy");		
		this.ohService.getOH().getAd().success("Copiado correctamente");
	}

	copiarSQL(){
		var texto_copiar : any = document.getElementById("inp_preview_sql");
		texto_copiar.select();
		document.execCommand("copy");		
		this.ohService.getOH().getAd().success("Copiado correctamente");
	}

	copiarSQLUpdate(){
		var texto_copiar : any = document.getElementById("inp_preview_sql_update");
		texto_copiar.select();
		document.execCommand("copy");		
		this.ohService.getOH().getAd().success("Copiado correctamente");
	}

}