import { Component, ViewChild, ElementRef } from '@angular/core';
import { UserServiceJPO, pSegusuarioObtener, pSegusuarioEditarEmailPlantillas, pSegusuarioEditar, pSegusuarioFotoEliminar, pSegusuarioFotoAdjuntar, pSegusuarioConfiguracionObtener, pSegusuarioConfiguracionEditar } from 'src/app/service/tis.userService';
import { NgForm } from '../../../../node_modules/@angular/forms';
import { ohStorage } from '../../ohCore/services/oh.core';
import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';
import { Rules } from 'src/app/ind.rules';
import { NgbTabChangeEvent, NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Messaging } from 'src/app/ind.messaging';

@Component({
  templateUrl: './ind.preferences.html'
})

export class Preferences {

  userService: UserServiceJPO;
  dateUpdate: any;
  private storage: ohStorage;

  emailConfigView: any;
  emailConfigSend: any;

  rules: Rules;

  disableCompany: boolean = false;
  config: pSegusuarioConfiguracionObtener;

  @ViewChild("inputPhoto", { static: true }) inputPhoto: ElementRef;
  @ViewChild('photo', { static: true }) photo: ElementRef;
  @ViewChild("modalSubUnidad", { static: true }) public modalSubUnidad: NgbModalRef;
  
  contraste : boolean;
  notificacion : boolean;

  constructor(public coreService: CoreService, private ohService: OHService, public cse: CoreService, private modalService: NgbModal, private messagingService: Messaging) {

    this.storage = new ohStorage();
    this.dateUpdate = {};
    this.userService = new UserServiceJPO(ohService);

    

    this.rules = new Rules();
    this.config = new pSegusuarioConfiguracionObtener();

    var rules = this.storage.item("APM_DATA", "rules");
    if (rules) {
      rules = rules.find(item => item.regla_id == 1);
      this.disableCompany = this.rules.disableEditCompany(this.storage.item("APM_DATA", "roles"), JSON.parse(rules.parametros));
    }

    if(this.cse.data.user.data.token_message){
      this.notificacion = true;
    } else {
      this.notificacion = false;
    }

  }

  validarNotificacion(){
    if(this.notificacion){
      this.messagingService.subscribirse(() => {
        
      });
    } else {
      this.messagingService.dessubscribirse(true);
    }
  }


  ngOnInit() {
    this.loadUser();
  }

  loadUser() {

    this.emailConfigView = [];
    this.emailConfigSend = [];

    this.userService.segusuarioObtener({
      Usuario_id: this.coreService.data.user.data.userid
    }, (resp: pSegusuarioObtener) => {
      this.dateUpdate = {
        email: resp.userInfo.email,
        name: this.coreService.data.user.data.name,
        lastName: this.coreService.data.user.data.lastName,
        middleName: this.coreService.data.user.data.lastMiddle,
        company: resp.userInfo.company,
        RUC: resp.userInfo.RUC,
        photoId: resp.userInfo.photoId,
        photoBase64: 'data:image/jpg;base64,' + resp.userInfo.photoBase64
      };
      for (var i in resp.emailConfig) {
        this.emailConfigView[i] = resp.emailConfig[i].description;
        this.emailConfigSend[i] = {
          usuario_id: this.coreService.data.user.data.userid,
          email_plantilla_id: resp.emailConfig[i].emailTemplateId,
          estado: (resp.emailConfig[i].state == "1") ? true : false,
          habilitado: (resp.emailConfig[i].enable == "1") ? true : false
        }
      }
    });

  }

  uploadPhoto(event: any) {

    this.userService.segusuarioFotoAdjuntar({
      Usuario_id: this.coreService.data.user.data.userid
    }, {
        photo: event.target.files[0]
      }, (percent: number) => {
        //console.log(percent);
      }, (resp: pSegusuarioFotoAdjuntar) => {
        this.dateUpdate.photoId = resp.Adjunto_id;
        this.dateUpdate.photoBase64 = 'data:image/jpg;base64,' + resp.Archivo_base64;
      })

  }

  deletePhoto() {

    this.userService.segusuarioFotoEliminar({
      Usuario_id: this.coreService.data.user.data.userid,
      Adjunto_id: this.dateUpdate.photoId
    }, (resp: pSegusuarioFotoEliminar) => {
      if (resp.estado == 1) {
        this.dateUpdate.photoId = null;
        this.photo.nativeElement.src = null;
        this.ohService.getOH().getAd().success(resp.mensaje);
      } else {
        if (resp.estado == 0) {
          this.ohService.getOH().getLoader().showError(resp.mensaje);
        } else {
          this.ohService.getOH().getAd().warning(resp.mensaje);
        }
      }
    })

  }

  updateUser(frm: NgForm) {
    if (frm.valid) {
      this.userService.segusuarioEditar({
        Usuario_id: this.coreService.data.user.data.userid,
        Correo: this.dateUpdate.email,
        Nombre: this.dateUpdate.name,
        Apellido_paterno: this.dateUpdate.lastName,
        Apellido_materno: this.dateUpdate.middleName,
        Ruc: this.dateUpdate.RUC,
        Empresa: this.dateUpdate.company
      }, (resp: pSegusuarioEditar) => {
        if (resp.estado == 1) {
          this.coreService.data.user.data.name = this.dateUpdate.name;
          this.coreService.data.user.data.lastName = this.dateUpdate.lastName;
          this.coreService.data.user.data.lastMiddle = this.dateUpdate.middleName;
          this.coreService.data.user.data.company = this.dateUpdate.company;
          this.coreService.data.user.data.companyId = this.dateUpdate.RUC;
          this.storage.set("APM_DATA", this.coreService.data.user);
          this.ohService.getOH().getAd().success(resp.mensaje);
        } else {
          if (resp.estado == 0) {
            this.ohService.getOH().getLoader().showError(resp.mensaje);
          } else {
            this.ohService.getOH().getAd().warning(resp.mensaje);
          }
        }
      })
    }
  }

  public cambioTab($event: NgbTabChangeEvent) {
    if ($event.nextId === 'tabUnidadNegocio') {
      if (!this.config.unidades_negocio_base || this.config.unidades_negocio_base.length == 0) {
        this.segusuarioUnidadNegocioListar();
      }
    }
  }

  segusuarioUnidadNegocioListar() {
    this.userService.segusuarioConfiguracionObtener({
		unidad_negocio_id: this.cse.data.user.profile,
		usuario_id: this.coreService.data.user.data.userid
    }, (resp: pSegusuarioConfiguracionObtener) => {
      this.config = resp;
      console.log(resp);
      for(var i in resp.unidades_negocio_base){
        var padre = resp.unidades_negocio_base[i];
        resp.unidades_negocio_base[i]['hijos'] = resp.unidades_negocio_hijos.filter(it => it.unidad_negocio_padre_id == padre.unidad_negocio_id);
      }
    });
  }

  updateEmail() {
    this.userService.segusuarioEditarEmailPlantillas({
      Plantillas_json: JSON.stringify(this.emailConfigSend),
      Usuario_id: this.coreService.data.user.data.userid
    }, (resp: pSegusuarioEditarEmailPlantillas) => {
      if (resp.estado == 1) {
        this.ohService.getOH().getAd().success(resp.mensaje);
      } else {
        if (resp.estado == 0) {
          this.ohService.getOH().getLoader().showError(resp.mensaje);
        } else {
          this.ohService.getOH().getAd().warning(resp.mensaje);
        }
      }
    })
  }
  
  unidadPrincipal(indice: number) {
    for (var i = 0; i < this.config.unidades_negocio_base.length; i++) {
      if (i != indice) {
        this.config.unidades_negocio_base[i].seleccionado = false;
      }
    }
  }

  actualizarConfig(){
    var un_padre = this.config.unidades_negocio_base.find(it => it.seleccionado == true);
    this.userService.segusuarioConfiguracionEditar({
      usuario_id : this.coreService.data.user.data.userid,
      unidad_negocio_padre_id : un_padre.unidad_negocio_id,
      unidades_hijas : this.obtenerHijos()
    }, (resp : pSegusuarioConfiguracionEditar) => {
      if (resp.resp_estado == 1) {

        
        var profiles = this.storage.item("APM_DATA", "profiles");

        for(var i = 0; i < profiles.length; i++){
          profiles[i].default = (profiles[i].id == un_padre.unidad_negocio_id)?1:0;
          profiles[i].un_hijo_predefinido_id = null;

          var un = this.config.unidades_negocio_base.find(it => it.unidad_negocio_id == profiles[i].id);
          if(un){
            var un_hijo = un['hijos'].find(it => it.seleccionado == true);
            if(un_hijo){
              profiles[i].un_hijo_predefinido_id = un_hijo.unidad_negocio_id;
            }
          }
        }

        this.coreService.data.profiles = profiles;
        this.storage.add("APM_DATA", "profiles", profiles);
        
        this.ohService.getOH().getAd().success(resp.resp_mensaje);
      } else {
        if (resp.resp_estado == 0) {
          this.ohService.getOH().getLoader().showError(resp.resp_mensaje);
      } else {
          this.ohService.getOH().getAd().warning(resp.resp_mensaje);
        }
        }
    });
  }

  obtenerHijos() : string {

    var uns = [];

    uns.push("<UNs>");

    for(var i = 0; i < this.config.unidades_negocio_base.length; i++){

      var padre = this.config.unidades_negocio_base[i];

      var un_hijo = padre['hijos'].find(it => it.seleccionado == true);

      if(un_hijo){
        uns.push("<UN>");
        uns.push("	<unidad_negocio_id>"+padre.unidad_negocio_id+"</unidad_negocio_id>");
        uns.push("	<unidad_negocio_hijo_id>"+un_hijo.unidad_negocio_id+"</unidad_negocio_hijo_id>");
        uns.push("</UN>");
      }

    }
    uns.push("</UNs>");

    return uns.join("");
  
  }

  modalSubUnidadAbrir(result?: any, reason?: any) {
		this.modalService.open(this.modalSubUnidad, {}).result.then(result, reason);
	}

  subunidad : any;
  abrirConfiguracionUN(unidad_negocio_id : number){
    this.subunidad = this.config.unidades_negocio_base.find(it => it.unidad_negocio_id == unidad_negocio_id);
    this.modalSubUnidadAbrir((caso) => {
		}, () => {});
  }

  unidadHijoPrincipal(indiceHijo: number) {
    for (var i = 0; i < this.subunidad.hijos.length; i++) {
      if (i != indiceHijo) {
        this.subunidad.hijos[i].seleccionado = false;
      }
    }
  }

}