import { Injectable } from '@angular/core';

import { Jpo } from 'src/app/ohCore/services/oh.core';

@Injectable()
export class BUICoreService {

    jpo : Jpo;

    public data : any = {
        indicador_cargado : false
    };
    public plantillas_menu : any;
    public menu_configuraciones : any; // Lista de confitguraciones por menu
    public item : any = {};
    public config : any = {
        sub_proyecto_inlandnet : 23,
        proyecto_id : 2,
        sub_proyecto_tipo : {
            rest : 1,
            web : 2
        },
        sub_proyecto_sub_modulo : {
            si : 1,
            no : 0
        },
        origen : {
            1 : {
                1 : "ANGULAR IO v8"
            },
            2 : {
                1 : "JAVA EJB",
                2 : "JAVA AZURE FUNCTION"
            }
        }
    };
    public loadingConfig : boolean = false;

    setJpo(jpo: Jpo){
        if(!this.jpo){
            this.jpo = jpo;
        }
    }

}