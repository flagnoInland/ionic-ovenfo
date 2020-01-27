import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { mergeMap, mergeMapTo } from 'rxjs/operators';
import { CoreService } from './ind.coreService';
import { OHService } from './tis.ohService';
import { ohStorage } from './ohCore/services/oh.core';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable()
export class Messaging {

	public myStorage : ohStorage;

  constructor(public cse : CoreService, private ohService : OHService, private angularFireMessaging: AngularFireMessaging, private router: Router, private route: ActivatedRoute){
    this.myStorage = new ohStorage();
    this.angularFireMessaging.messaging.subscribe(
      (_messaging) => {
        _messaging.onMessage = _messaging.onMessage.bind(_messaging);
        _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
      }
    )
  }

  token : string;
  subscribirse(call : any, callError ?: any){
      this.angularFireMessaging.requestToken.subscribe((token) => {
        this.token = token;
        this.subscribirUsuario(token);
        call();
      },(err) => {
        if(err.code=="messaging/notifications-blocked"){
          if(callError){
            var aviso = {
              id : 0, 
              type : 2, 
              icon : "fas fa-bell test",
              title : "Notificaciones v2",
              subtitle : "Bloqueado subtitulo",
              description : "Prueba",
              nivel : "1",
              sendDate : new Date(),
              read : 0
            };
            callError(aviso);
          }
        } else {
          this.desubscribirUsuario();
        }
      });
  }

  usuarios_fire : any;

  private subscribirUsuario(token) {
    this.usuarios_fire = this.cse.inland_main.usuarios_conectados.obtener(this.cse.data.user.data.token).subscribe((usuarios : any) => {
      this.usuarios_fire.unsubscribe();
      if(token != usuarios[0].token_message){
        usuarios[0].token_message = token;
        this.cse.data.user.data.token_message = token;
        this.myStorage.add("APM_DATA", "data", this.cse.data.user.data);
        this.cse.inland_main.usuarios_conectados.editar(usuarios[0]);
        this.ohService.getOH().getAd().success("Subscrito correctamente");
      }
    });
  }

  dessubscribirse(actualizarUsuario : boolean, call ?: any){

    this.angularFireMessaging.getToken.pipe(mergeMap(token => this.angularFireMessaging.deleteToken(token))).subscribe((resultado) => { 
      if(resultado){
        console.log(resultado);
        this.token = null;
        if(actualizarUsuario){
          this.desubscribirUsuario();
          this.ohService.getOH().getAd().success("Desuscrito correctamente");
        }
        if(call){
          call();
        }
      }
    }, () => {
      if(call){
        call();
      }
    });
  }

    private desubscribirUsuario() {
      this.usuarios_fire = this.cse.inland_main.usuarios_conectados.obtener(this.cse.data.user.data.token).subscribe((usuarios : any) => {
        this.usuarios_fire.unsubscribe();
        if(usuarios && usuarios.length == 1){
          usuarios[0].token_message = null;
        }
        this.cse.data.user.data.token_message = null;
        this.myStorage.add("APM_DATA", "data", this.cse.data.user.data);
        this.cse.inland_main.usuarios_conectados.editar(usuarios[0]);
      });
    }

  recibirMensaje(call : any) {
    this.angularFireMessaging.messages.subscribe((result) => {
      console.log(result);
      if(result["data"] && result["data"]["gcm.notification.data"]){
        let data = JSON.parse(result["data"]["gcm.notification.data"]);
        if(data){
          if(call && data.add){
            call(JSON.parse(data.add));
          }
          if(data.redirect){
            this.ohService.getOH().getLoader().show();
            this.router.navigate([data.redirect]);
            console.log("redireccionando");
          }
        }
      }
    })
  }

  obtenerToken(){
    this.angularFireMessaging.requestPermission.pipe(mergeMapTo(this.angularFireMessaging.tokenChanges)).subscribe(
      (token) => { console.log('Permission granted! Save to the server!', token); },
      (error) => { console.error(error); },  
    );
  }

}