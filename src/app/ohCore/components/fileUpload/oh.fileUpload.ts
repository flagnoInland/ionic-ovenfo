import { Component, Input, Output, EventEmitter } from '@angular/core';

import * as FileSaver from 'file-saver';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { MainService } from '../../services/oh.mainService';
import { OHService } from 'src/app/tis.ohService';
import { of } from 'rxjs';

/*
    <oh-fileUpload [adjuntos]="adjuntos" (eventoEliminar)="adjuntoEliminar($event)"></oh-fileUpload>
    ruta = '';
    adjuntos = [
      {
        	uid : ,
					nombre : ,
					tamano : ,
					archivo: ,
					descripcion : 
      }
    ]

    eventoEliminar Cuando vamos a eliminar de una edicion de archivos
    Ejemplo
    adjuntoEliminar(evento : any){
          this.oPLPropuestaService.oplpropuestaEliminarAdjunto({
              propuesta_id : this.propuesta.propuesta_id,
              usuario_id : this.cse.data.user.data.userid,
              adjunto_id : evento.adjunto_id
          }, (resp : pOplpropuestaEliminarAdjunto) => {
          });
    }
  
    Eventos adicionale
    <oh-fileUpload [adjuntos]="adjuntos" (eventoEliminar)="adjuntoEliminar($event)" vista="editor" formatos="image/png, image/jpeg" [multiple]="false" [pesoMaximo]="5120" [cantidadMaxima]="5"></oh-fileUpload>

    <oh-fileUpload [adjuntos]="adjuntos" [ruta]="ocs.config.ruta_firestore" [config]="{'formatos':'image/png, image/jpeg','pesoMaximo':2048, 'cantidadMaxima':3}"></oh-fileUpload>

    <oh-fileUpload [adjuntos]="adjuntos" [ruta]="ocs.config.ruta_firestore" [config]="ocs.config.file"></oh-fileUpload>
    vista Editor
    Formatos png y jpg
    No soporta la carga múltiple
    peso máximo 5 MBs por archivo
*/
@Component({
  selector: 'oh-fileUpload',
	styles: ['button.text-success:hover {color: #19692c!important;}'],
  templateUrl: './oh.fileUpload.html'
})

export class FileUpload {

  private ohMainService: MainService;
  private tipo_adjunto_id: number = 30892;
  private _adjuntos: any;

  @Input() disabled: any = false;     
  @Input() vista: string = "editor";  // Defecto Editor | Vita de pantalla como Edición o Solo lectura
  @Input() formatos: string = "";     // Defecto Todos  | Agrega los formatos aceptados
  @Input() multiple: boolean = true;  // Defecto Si     | Configuración del input a ser múltiple o no.
  @Input() pesoMaximo: number = 2048; // Defecto 2 MB   | Configuración por archivo validar el peso máximo.
  @Input() cantidadMaxima: number = 5;// Defecto 5      | Cantidad máxima a subir
  @Input() tipos : any;
  @Input() tipo_id : string;
  @Input() tipo_value : string;

  @Input('config')
  set config(config: any) {
    if (config) {
      if (config.vista) {
        this.vista = config.vista;
      }
      if (config.formatos) {
        this.formatos = config.formatos;
      }
      if (config.multiple) {
        this.multiple = config.multiple;
      }
      if (config.pesoMaximo) {
        this.pesoMaximo = config.pesoMaximo;
      }
      if (config.cantidadMaxima) {
        this.cantidadMaxima = config.cantidadMaxima;
      }
    }
  }

  @Input('adjuntos')
  set adjuntos(adjuntos: any) {
    this._adjuntos = adjuntos; //this._adjuntos.adjunto_id  // Si tiene adjunto_id es edición sino es nuevo
    if (adjuntos) {
      for (var i = 0; i < adjuntos.length; i++) {
        this.archivos.push({
          uid: adjuntos[i].id,
          nombre: adjuntos[i].nombre,
          tamano: Math.round((adjuntos[i].peso / 1024) * 100) / 100,
          porcentaje: of(100)
        })
      }
    }
  }

  @Output() eventoEliminar: EventEmitter<any>; // hace binding al padre.
  /* Con el formato
  		[
			{
				"id": "0ec7f269-9322-4d02-8cbf-1747346c12c7",
				"nombre": "arhivo1.jpg",
				"formato": "jpg",
				"peso": 232322,
				"ubicacion": "test",
				"tipo_adjunto": 30892, -- Firebase
				"descripcion": "", -- Opcional adicional
				"tipo": 1 -- Opcional adicional
			},
			{
				"id": "9yc7f269-9322-4d02-8cbf-1747346c1223",
				"nombre": "arhivo2.jpg",
				"formato": "png",
				"peso": 65555,
				"ubicacion": "testb",
				"tipo_adjunto": 30892,
				"descripcion": "",
				"tipo": 1
			}
		*/
  @Input() archivos: any; // Con Metadata incluida
  @Input() ruta: any;

  constructor(private ohCore: OHService, private fireStorage: AngularFireStorage) {
    this.ohMainService = ohCore.getOH();
    this._adjuntos = [];
    this.archivos = [];
    this.tipos = [];
    this.eventoEliminar = new EventEmitter<any>();
  }

  cargar(evento: any) {

    if (evento.target.files && evento.target.files.length > 0) {

      for (var i = 0; i < evento.target.files.length; i++) {

        if (evento.target.files[i].size <= this.pesoMaximo * 1024) { // Validando el peso máximo

          if (this.archivos.length < this.cantidadMaxima) { // Validando la cantidad máxima

            let subFormato = evento.target.files[i].name.split(".");

            var uid = this.ohMainService.getUtil().getUID();

            this.archivos.push({
              uid: uid,
              nombre: evento.target.files[i].name,
              tamano: Math.round((evento.target.files[i].size / 1024) * 100) / 100,
              archivo: evento.target.files[i]
            });

            this._adjuntos.push({
              id: uid,
              nombre: evento.target.files[i].name,
              formato: subFormato[subFormato.length - 1],
              peso: evento.target.files[i].size,
              ubicacion: this.ruta,
              tipo_adjunto: this.tipo_adjunto_id,
              descripcion: '',
              tipo : null
            });

            var cargado = this.archivos[this.archivos.length - 1];
            cargado.storage = this.fireStorage.upload(this.ruta + cargado.uid, cargado.archivo);
            cargado.porcentaje = cargado.storage.percentageChanges();
            cargado.cambios = cargado.storage.snapshotChanges();
            cargado.cambios.pipe(
              finalize(() => {
                evento.target.value = '';
              })
            ).subscribe();

          }

        }

      }

    }

  }

  descargar(indice: number) {
    if (this.archivos[indice].archivo) {
      FileSaver.saveAs(this.archivos[indice].archivo, this.archivos[indice].nombre);
    } else {
      this.ohCore.getOH().getLoader().show();
      this.fireStorage.ref(this.ruta + this.archivos[indice].uid).getDownloadURL().subscribe((url) => {
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = (event) => {
          this.archivos[indice].archivo = xhr.response;
          FileSaver.saveAs(this.archivos[indice].archivo, this.archivos[indice].nombre);
          this.ohCore.getOH().getLoader().close();
        };
        xhr.open('GET', url);
        xhr.send();
      })
    }
  }

  eliminar(indice: number) {

    if (this._adjuntos[indice].adjunto_id) {
      this.ohCore.getOH().getUtil().confirm("¿Confirma eliminar el archivo adjunto?", () => {
        if (this.eventoEliminar.observers.length > 0) {
          this.eventoEliminar.emit({ adjunto_id: this._adjuntos[indice].adjunto_id });
        }
        this.eliminarConfirmar(indice);
      });
    } else {
      this.eliminarConfirmar(indice);
    }

  }

  eliminarConfirmar(indice: number) {
    this.fireStorage.ref(this.ruta + this.archivos[indice].uid).delete();
    this.archivos.splice(indice, 1);
    this._adjuntos.splice(indice, 1);
    this.ohMainService.getAd().success("Adjunto eliminado correctamente");
  }

  cancelar(indice: number) {
    this.archivos[indice].storage.cancel();
    this.archivos.splice(indice, 1);
    this._adjuntos.splice(indice, 1);
    this.ohMainService.getAd().success("Adjunto cancelado correctamente");
  }

}