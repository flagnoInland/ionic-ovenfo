import { map } from "rxjs/operators";
import { INLANDusuarios_conectados } from "./usuarios_conectados";
import { AngularFirestore } from "@angular/fire/firestore";
import { INLANDLog } from "./log";

export interface Inland {
    habilitar_log : boolean,
	version ?: string,
	version_actualizacion ?: number
}

export class INLANDmain {

    private firestore: AngularFirestore;
    private enviroment : string;
	private document : string;

	public usuarios_conectados : INLANDusuarios_conectados;
	public logs : INLANDLog;
    
    constructor(firestore : AngularFirestore, enviroment : string, document : string){
		
        this.firestore = firestore;
        this.enviroment = enviroment;
		this.document = document;
		
		this.usuarios_conectados = new INLANDusuarios_conectados(firestore, enviroment, document);
		this.logs = new INLANDLog(firestore, enviroment, document);

    }

    enlazar(){
        return this.firestore.doc<any>('/'+this.enviroment+'/'+this.document).snapshotChanges().pipe(
            map(({ payload }) => ({ ...payload.data(), id: payload.id }))
        );
    }

	editar(usuario: Inland) {
		this.firestore.doc<Inland>('/'+this.enviroment+'/'+this.document).update(usuario).then(() => {
        });
	}

}