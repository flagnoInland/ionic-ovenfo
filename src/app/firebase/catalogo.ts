import { map } from "rxjs/operators";
import { AngularFirestore } from "@angular/fire/firestore";

export interface catalogo {
	catalogo_id?: number,
	catalogo_padre_id?: number,
	descripcion?: string,
	descricion_larga?: string,
	estado?: string,
	variable_1?: string,
	variable_2?: string,
	variable_3?: number
}

export class FIRECatalogo {

    private firestore: AngularFirestore;
    private coleccion : string = "catalogos"; // '/APM_DESA/ADM/catalogos/'
    private enviroment : string;
	private document : string;

    
    constructor(firestore : AngularFirestore, enviroment : string, document : string){
        this.firestore = firestore;
        this.enviroment = enviroment;
        this.document = document;
    }

    getCatalogoByPadre(id) {
        return this.firestore.collection<catalogo>('/'+this.enviroment+'/'+this.document+'/'+this.coleccion, ref => ref.where('catalogo_padre_id', '==', id)).snapshotChanges().pipe(
			map(actions => {
				return actions.map((a: any) => {
					const data = a.payload.doc.data();
					const id = a.payload.doc.id;
					return { id, ...data };
				});
			})
		);
    }
    
    getCatalogosAll() {
        return this.firestore.collection<catalogo>('/'+this.enviroment+'/'+this.document+'/'+this.coleccion).snapshotChanges().pipe(
			map(actions => {
				return actions.map((a: any) => {
					const data = a.payload.doc.data();
					const id = a.payload.doc.id;
					return { id, ...data };
				});
			})
		);
    }
    
    addCatalogo(catalogo: catalogo) {
		this.firestore.doc<catalogo>('/'+this.enviroment+'/'+this.document+'/'+this.coleccion+'/' + catalogo.catalogo_id).set(catalogo).then(function () {
		})
	}

	editCatalogo(catalogo: catalogo) {
		this.firestore.doc<catalogo>('/'+this.enviroment+'/'+this.document+'/'+this.coleccion+'/' + catalogo.catalogo_id).update(catalogo).catch(error=>{
			this.addCatalogo(catalogo)
		})
	}

	removeCatalogo(catalogo: catalogo) {
		this.firestore.doc<catalogo>('/'+this.enviroment+'/'+this.document+'/'+this.coleccion+'/' + catalogo.catalogo_id).delete();
	}

	removeAll(){
		return this.firestore.collection('/'+this.enviroment+'/'+this.document+'/'+this.coleccion).get().forEach((doc) => {
			var batch = this.firestore.firestore.batch();
			doc.docs.forEach((doc) => {
				batch.delete(doc.ref);
			});
			return batch.commit().then(() => {
				return doc.size;
			  });
		})
	}

	eliminarCatalogoPadre(catalogo : catalogo){
		return this.firestore.collection('/'+this.enviroment+'/'+this.document+'/'+this.coleccion, ref => ref.where('catalogo_padre_id', '==', catalogo.catalogo_id)).get().forEach((doc) => {
			var batch = this.firestore.firestore.batch();
			doc.docs.forEach((doc) => {
				batch.delete(doc.ref);
			});
			return batch.commit().then(() => {
				return doc.size;
			  });
		})
	}

}