import { finalize } from "rxjs/operators";
import { AngularFireStorage } from "@angular/fire/storage";
import { OHService } from "../tis.ohService";

export class INLANDimagen {

	private document : string;
    
    constructor(private fireStorage : AngularFireStorage, private enviroment : string, private ohService: OHService){
        this.fireStorage = fireStorage;
        this.enviroment = enviroment;
	}
	
	public setDocument(document : string){
		this.document = document.toUpperCase();
	}

	public getRuta(){
		return '/'+this.enviroment+'/'+this.document;
	}

	inicializar(item : any, nombre : string, fotos : any){
		if(!item[nombre]){
			item[nombre] = [];
		}
		for(var i in fotos){
			if(!item[nombre][i]){
				item[nombre][i] = {
					percent : 0,
					loaded : false
				};
			}
		}
	}

	eliminar(evento : any, charge : any){
		var _charge = charge[evento.indice];
		if(_charge){
			this.eliminarArchivo(_charge.uid);
			charge.splice(evento.indice, 1);
		}
	}

	eliminarArchivo(uid : string){
		this.fireStorage.ref('/'+this.enviroment+'/'+this.document+'/'+uid).delete().pipe(
			finalize(() => {
				console.log("eliminado");
			})
		).subscribe();
	}

	registrar(fotos: any, fotosCharge : any, indice : number, call : any){
		if(fotosCharge[indice] && fotosCharge[indice].loaded == false){
			var base = fotos[indice].split(",");
			var uid = this.ohService.getOH().getUtil().getUID();
			let archivo : Blob = this.ohService.getOH().getUtil().base64strToBlog(base[1]);
			var task = this.fireStorage.upload('/'+this.enviroment+'/'+this.document+'/'+uid, archivo);
			console.log('/'+this.enviroment+'/'+this.document+'/'+uid)
			task.percentageChanges().subscribe((percent) => {
				fotosCharge[indice].percent = percent;
			})
			task.snapshotChanges().pipe(
				finalize(() => {
					fotosCharge[indice].loaded = true;
					fotosCharge[indice].uid = uid;
					fotosCharge[indice].peso = archivo.size;
					if(indice+1 < fotos.length){
						this.registrar(fotos, fotosCharge, indice+1, call);	
					} else {
						if(call){
							call();
						}
					}
				} )
			).subscribe();
		} else {
			if(indice+1 < fotos.length){
				this.registrar(fotos, fotosCharge, indice+1, call);	
			} else {
				if(call){
					call();
				}
			}
		}
	}

    fotosCaptura : any;
	obtener(fotos : any, indice : number, call : any){
		if(indice == 0){
			this.fotosCaptura = [];
		}
		if(fotos && fotos.length>0){
			this.fireStorage.ref('/'+this.enviroment+'/'+this.document+'/'+fotos[indice].uid).getDownloadURL().subscribe((url) => {
				var xhr = new XMLHttpRequest();
				xhr.responseType = 'blob';
				xhr.onload = (event) => {
					let archivo : Blob = xhr.response;
					var reader = new FileReader();
					reader.readAsDataURL(archivo); 
					reader.onloadend = () => {
						let base = (""+reader.result).split(',')[1];
						this.fotosCaptura.push(base);
						if(indice+1 < fotos.length){
							this.obtener(fotos, indice+1, call);
						} else {
							if(call){
								call(this.fotosCaptura);
							}
						}
					}
				};
				xhr.open('GET', url);
				xhr.send();
			})
		} else {
			if(call){
				call(this.fotosCaptura);
			}
		}
	}

	obtenerSimultaneo(fotos : any, call : any, segundoIndice ?: number){
		if(fotos && fotos.length>0){
			for(var i = 0; i < fotos.length; i++){
				this.obtenerProcesar(fotos[i], i, call, segundoIndice);
			}
		}
	}

	private obtenerProcesar(foto : any, indice : number, call : any, segundoIndice ?: number){
		this.fireStorage.ref('/'+this.enviroment+'/'+this.document+'/'+foto.uid).getDownloadURL().subscribe((url) => {
			var xhr = new XMLHttpRequest();
			xhr.responseType = 'blob';
			xhr.onload = (event) => {
				let archivo : Blob = xhr.response;
				var reader = new FileReader();
				reader.readAsDataURL(archivo); 
				reader.onloadend = () => {
					let base = (""+reader.result).split(',')[1];
					if(call){
						call(indice, base, segundoIndice);
					}
				}
			};
			xhr.open('GET', url);
			xhr.send();
		})
	}

}