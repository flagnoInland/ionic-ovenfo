import { map } from "rxjs/operators";
import { AngularFirestore } from "@angular/fire/firestore";

export interface Usuario {
	changePassword ?: string,
	company ?: string,
	companyId ?: string,
	daysChangekey ?: number,
	id ?: string,
	lastMiddle ?: string,
	lastName ?: string,
	name ?: string,
	source ?: string,
	token ?: string,
	userid ?: string
}

export class INLANDusuarios_conectados {

    private firestore: AngularFirestore;
    private coleccion : string = "usuarios_conectados"; // '/APM_DESA/INLAND/usuarios_conectados/'
    private enviroment : string;
	private document : string;
    
    constructor(firestore : AngularFirestore, enviroment : string, document : string){
        this.firestore = firestore;
        this.enviroment = enviroment;
        this.document = document;
    }

    listar(){
        return this.firestore.collection<any>('/'+this.enviroment+'/'+this.document+'/'+this.coleccion).snapshotChanges().pipe(
			map(actions => {
				return actions.map((a: any) => {
					const data = a.payload.doc.data();
					const id = a.payload.doc.id;
					return { id, ...data };
				});
			})
		);;
	}
	
	obtener(token) {
        return this.firestore.collection<any>('/'+this.enviroment+'/'+this.document+'/'+this.coleccion, ref => ref.where('token', '==', token)).snapshotChanges().pipe(
			map(actions => {
				return actions.map((a: any) => {
					const data = a.payload.doc.data();
					const id = a.payload.doc.id;
					return { id, ...data };
				});
			})
		);
    }

    enlazar(token: string){
        return this.firestore.doc<Usuario>('/'+this.enviroment+'/'+this.document+'/'+this.coleccion+'/' + token).snapshotChanges().pipe(
            map(({ payload }) => ({ ...payload.data(), id: payload.id }))
        );
    }

	guardar(usuario: Usuario) {
		return this.firestore.doc<Usuario>('/'+this.enviroment+'/'+this.document+'/'+this.coleccion+'/' + usuario.token).set(usuario);
    }
    
	editar(usuario: Usuario) {
		this.firestore.doc<Usuario>('/'+this.enviroment+'/'+this.document+'/'+this.coleccion+'/' + usuario.token).update(usuario).then(() => {
        });
	}

	eliminar(token: string){
		this.firestore.collection<Usuario>('/'+this.enviroment+'/'+this.document+'/'+this.coleccion+'').doc('' + token).delete().then(() => {
        });
	}

}