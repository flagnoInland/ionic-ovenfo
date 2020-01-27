import { Component, AfterViewInit, OnInit, ViewChild, TemplateRef} from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';
import { ADMBase } from '../../adm.base';
import { ADMUsuarioServiceJPO, pSegusuarioListar, pSegusuarioEliminarValidar, pSegusuarioEliminar } from '../../service/adm.aDMUsuarioService';
import { ADMCoreService } from '../../adm.coreService';

@Component({
  templateUrl: './adm.user.html'
})
export class User extends ADMBase implements OnInit, AfterViewInit {

	private aDMUsuarioService : ADMUsuarioServiceJPO;
	usuarios_fire : any;

	@ViewChild("modalConfElim", { static: true }) modalConfElim: TemplateRef<NgbActiveModal>;
	
	dateList : any = [];
	currentItem : any;

	pagin: any;
	filter : any;

	_fechaI : any = null;
	_fechaF : any = null;

	filtro_roles : any;
	empresas : any;
	roles : any = "";

	constructor(private router :Router, private modalService: NgbModal, private ohService : OHService, public cse : CoreService, public acs : ADMCoreService){
		super(ohService, cse, acs);
		this.aDMUsuarioService = new ADMUsuarioServiceJPO(ohService);
		

		this.filtro_roles = [];
		this.empresas = "";

		Promise.all([this.precarga]).then(values => {
			this.filtroTab();
		});
	}

	ngOnInit(){
		this.cse.config.disableSeparator = true;
	}

	ngAfterViewInit(){
		this.filter.startList = true;
	}

	ngOnDestroy(){
		this.cse.config.disableSeparator = false;
		if(this.usuarios_fire){
			this.usuarios_fire.unsubscribe();
		}
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
				estado : {
					label : "Estado",
					type : "",
					closeFilter : true,
					beforeFilter : (estado : any) => {
						if(estado.value && this.acs.data.catalogo.usuario_estado){
							estado.descValue = this.acs.data.catalogo.usuario_estado.find(it => it.variable_3 == estado.value).descripcion;
						}
					}
				},
				usuario_id : {
					label : "Usuario ID",
					type : "",
					closeFilter : true
				},
				id : {
					label : "ID",
					type : "",
					closeFilter : true
				},
				nombres : {
					label : "Nombres",
					type : "",
					closeFilter : true
				},
				correo : {
					label : "Correo",
					type : "",
					closeFilter : true
				},
				roles : {
					label : "Roles",
					type : "list",
					closeFilter : true
				},
				empresas : {
					label : "Empresas",
					type : "list",
					value_id : "empresa_id",
					value_desc : "razon_social",
					closeFilter : true
				}
			}
		};
	}

	list(){
		console.log('this.filter.fields.roles:', this.filter.fields.roles)
        this.aDMUsuarioService.segusuarioListar({
			usuarios_id : this.usuarios_id,
            usuario_id : this.filter.fields.usuario_id.value,
            id : this.filter.fields.id.value,
            correo : this.filter.fields.correo.value,
            nombres : this.filter.fields.nombres.value,
			estado : this.filter.fields.estado.value,
			roles : this.filter.fields.roles.concatValue,
			empresas : this.filter.fields.empresas.concatValue,
			Page : this.pagin.page,
			Size : this.pagin.size_rows
        }, (resp : pSegusuarioListar) => {
			for(var item of resp.lista){
				item['roles_lista'] = this.ohService.getOH().getUtil().StringXMLtoJSONList(item.roles);
				item['empresas_lista'] = this.ohService.getOH().getUtil().StringXMLtoJSONList(item.empresas);
			}
			this.dateList = resp.lista;
			this.pagin.total = resp.resultado.total;
        });
	}

	verEstado(id : any){
		var obj;
		if(this.acs.data.catalogo && this.acs.data.catalogo.usuario_estado){
			obj = this.acs.data.catalogo.usuario_estado.find(it => it.variable_3 == id);
		}
		return (obj)?obj.descripcion:"";
	}

	eliminarConfirmar(usuario_id : number){
		this.ohService.getOH().getUtil().confirm("¿Confirma eliminar el usuario seleccionado?", ()=> {
			this.eliminarValidar(usuario_id);
		})
	}

	elminiarConf : any = {};
	eliminarValidar(usuario_id : number){

		this.aDMUsuarioService.segusuarioEliminarValidar({
            usuario_id : usuario_id
        }, (resp : pSegusuarioEliminarValidar) => {

			var totales = 0;
				totales = (resp.empresas && resp.empresas.length>0)?totales+1:totales;
				totales = (resp.plantillas && resp.plantillas.length>0)?totales+1:totales;
				totales = (resp.roles && resp.roles.length>0)?totales+1:totales;
			
			if(totales > 0){
				this.elminiarConf = resp;
				this.modalService.open(this.modalConfElim).result.then((result) => {
					if(result == "Confirmar"){
						this.eliminarProcesar(usuario_id);
					}
				}, (reason) => {
		
				});
			} else {
				this.eliminarProcesar(usuario_id);
			} 
        });
	}

	eliminarProcesar(usuario_id : number){
        this.aDMUsuarioService.segusuarioEliminar({
            usuario_id : usuario_id,
            usuario_admin_id : this.cse.data.user.data.userid
        }, (resp : pSegusuarioEliminar) => {
			if(resp.estado == 1){
				this.ohService.getOH().getAd().success(resp.mensaje);
				this.list();
			} else {
				this.ohService.getOH().getAd().warning(resp.mensaje);
			}
        });
	}

	seleccionado : boolean;
	conectados : boolean;
	seleccionados : number = 0;
	conexion_usuarios : any;
	usuarios_id : any;
	enLinea(){
		this.conectados = !this.conectados;
		if(this.conectados){
			this.seleccionado = false;
			this.usuarios_fire = this.cse.inland_main.usuarios_conectados.listar().subscribe((usuarios : any) => {
				this.conexion_usuarios = usuarios;

				var usuarios_consulta = [];
				for(var i in usuarios){
					usuarios_consulta.push(usuarios[i].userid);
				}

				this.usuarios_id = usuarios_consulta.join(",");
				this.list();
			});
		} else {
			if(this.usuarios_fire){
				this.usuarios_fire.unsubscribe();
			}
			this.usuarios_id = null;
			this.list();
		}
	}

	notificar(){
		this.enviar("¿Confirma notificar a los usuarios seleccionados?", 2);
	}

	sincronizar(){
		this.enviar("¿Confirma sincronizar a los usuarios seleccionados?", 3);
	}
	
	cerrarSession(){
		this.enviar("¿Confirma cerrar sessión a los usuarios seleccionados?", 4);
	}

	enviar(mensaje : string, accion : number){
		this.ohService.getOH().getUtil().confirm(mensaje, () => {
			var seleccionados = this.dateList.filter(it => it.seleccionado == true);
			for(var i in seleccionados){
				var user = this.conexion_usuarios.find(it => it.userid == seleccionados[i].usuario_id);
				if(user){
					user.conexion_accion = accion;
					if(accion == 4){
						this.cse.inland_main.usuarios_conectados.eliminar(user.userid);
					} else {
						this.cse.inland_main.usuarios_conectados.editar(user);
					}
				}
			}
		})
	}

	cambiarSeleccionado(){
		for(var i in this.dateList){
			this.dateList[i].seleccionado = this.seleccionado;
		}
	}

	validarSeleccionado(){
		this.seleccionados = this.dateList.filter(it => it.seleccionado == true).length;
	}


}