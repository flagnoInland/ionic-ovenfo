import { map } from "rxjs/operators";
import { AngularFirestore } from "@angular/fire/firestore";
import { ohStorage } from "../ohCore/services/oh.core";

export interface LogWeb {
	id ?: string,
	uid : string,
	fecha : Date,
	rnd : string,
	tiempo : number,
	paquete : string,
	clase : string,
	metodo : string,
	log : string
}

export class INLANDLog {

    private firestore: AngularFirestore;
    private coleccion : string = "log"; // '/APM_DESA/INLAND/log/'
    private enviroment : string;
	private document : string;

	private storage : ohStorage;
    
    constructor(firestore : AngularFirestore, enviroment : string, document : string){
        this.firestore = firestore;
        this.enviroment = enviroment;
		this.document = document;
		this.storage = new ohStorage();
	}
	
	registrar(datos : LogWeb){
		let data = this.storage.item("APM_DATA", "data");

		if(data.habilitar_log){
			console.log(datos);
			datos.id = data.id;
			this.guardar(datos);
		}
		
	}

    listar(){
        return this.firestore.collection<any>('/'+this.enviroment+'/'+this.document+'/'+this.coleccion, ref => ref.orderBy("fecha", "desc").limit(1000)).snapshotChanges().pipe(
			map(actions => {
				return actions.map((a: any) => {
					const data = a.payload.doc.data();
					const id = a.payload.doc.id;
					return { id, ...data };
				});
			})
		);;
    }

    enlazar(uid: string){
        return this.firestore.doc<LogWeb>('/'+this.enviroment+'/'+this.document+'/'+this.coleccion+'/' + uid).snapshotChanges().pipe(
            map(({ payload }) => ({ ...payload.data(), id: payload.id }))
        );
    }

	guardar(usuario: LogWeb) {
		return this.firestore.doc<LogWeb>('/'+this.enviroment+'/'+this.document+'/'+this.coleccion+'/' + usuario.uid).set(usuario);
    }
    
	editar(usuario: LogWeb) {
		this.firestore.doc<LogWeb>('/'+this.enviroment+'/'+this.document+'/'+this.coleccion+'/' + usuario.uid).update(usuario).then(() => {
        });
	}

	eliminar(uid: string){
		this.firestore.collection<LogWeb>('/'+this.enviroment+'/'+this.document+'/'+this.coleccion+'').doc('' + uid).delete().then(() => {
        });
	}

}