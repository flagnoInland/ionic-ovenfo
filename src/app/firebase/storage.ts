import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
    providedIn: 'root'
})

export class FirebaseStorageService {

    constructor(private storage: AngularFireStorage) {
    }

    //subir archivo
    public uploadCloudStorage(nombreArchivo: string, datos: any) {
        return this.storage.upload(nombreArchivo, datos);
    }

    //Referencia del archivo
    public refCloudStorage(nombreArchivo: string) {
        return this.storage.ref(nombreArchivo);
    }
}