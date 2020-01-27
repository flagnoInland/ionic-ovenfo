import { Component, EventEmitter, Output, OnInit, AfterViewInit, Input, NgZone, ViewChild, SimpleChanges } from '@angular/core';
import { OHService } from 'src/app/tis.ohService';
import { NgForm, NgModel } from '@angular/forms';
import { ohStorage } from 'src/app/ohCore/services/oh.core';
import { ADMUbigeoServiceJPO, pGesubigeoObtenerEstructura, pGesubigeoListar } from 'src/app/module/ADM/service/adm.aDMUbigeoService';

declare var google: any;

/**
* Implementacion:
    <shi-ubiquitousRegister [(obj_ubigeo)]="item" binding_select="true" [form]="form_nuevo" type="list"></shi-ubiquitousRegister>
*/

@Component({
    selector: 'shi-ubiquitousRegister',
    styleUrls: ['./shi.ubiquitousRegister.css'],
    templateUrl: './shi.ubiquitousRegister.html',
})

export class UbiquitousRegister implements OnInit, AfterViewInit {

    @Input() public obj_ubigeo: any; // {departamento: 1, provincia: 0, distrito: 5, direcion: ''};

    @Input() public type: string = 'lineal'; // lineal, list
    @Input() public textLabel: string = 'Ubigeo'; // text for lineal view
    @Input() public levelR: number = 3; // scale valid for lineal view
    @Input() public showName: boolean = true;
    @Input() public showDirection: boolean = true;
    @Input() public showMap: boolean = true;
    @Input() public marker: string = 'https://firebasestorage.googleapis.com/v0/b/apm-inland.appspot.com/o/marker_selected_tiny.png?alt=media&token=fb36f55d-e837-40ec-b279-50dd1e1bfd9d';
    @Input() public latitud: number = -11.954824105441862;
    @Input() public longitud: number = -77.12714552879333;
    @Input() public unidadNegocio: number = 1;
    @Input() public bindingSelect: boolean = true;
    @Input() public ubigeoId: number = 0;
    @Input() public direcion: string = '';

    @Input() public form: NgForm;
    @Output() public setAddress: EventEmitter<any> = new EventEmitter();

    @ViewChild('departamento_id', { static: false }) departamento_id: NgModel;
    @ViewChild('provincia_id', { static: false }) provincia_id: NgModel;
    @ViewChild('distrito_id', { static: false }) distrito_id: NgModel;
    @ViewChild('nombre_lugar', { static: false }) nombre_lugar: NgModel;

    public ubigeo: any;
    private aDMUbigeoService: ADMUbigeoServiceJPO;
    public storage: ohStorage;
    public data_local: any;
    public departamento: any;
    public provincia: any;
    public distrito: any;

    constructor(private ohService: OHService, private zone: NgZone) {
        this.aDMUbigeoService = new ADMUbigeoServiceJPO(ohService);
        this.storage = new ohStorage();
        this.ubigeo = {
            show: {},
            departamentos: [],
            provincias: [],
            distritos: [],
            desc_ini: '',
        };
        this.data_local = this.storage.get('APM_UBIGEO');
    }

    ngOnInit() {
        this.ubigeo.type = this.type;
        this.ubigeo.marker = this.marker;
        this.ubigeo.latitud = this.latitud;
        this.ubigeo.longitud = this.longitud;
        this.ubigeo.show.map = this.showMap;
        this.ubigeo.desc_ini = this.direcion;
        this.ubigeo.ubigeo_id = this.ubigeoId;
        this.ubigeo.show.name = this.showName;
        this.ubigeo.show.direction = this.showDirection;
        this.ubigeo.unidad_negocio = this.unidadNegocio;
        if (Object.prototype.toString.call(this.obj_ubigeo) === '[object Object]') {
            if (this.obj_ubigeo.unidad_negocio != undefined) {
                this.ubigeo.unidad_negocio = this.obj_ubigeo.unidad_negocio;
            }
            if (this.obj_ubigeo.departamento_id != undefined) {
                this.ubigeo.ubigeo_id = +this.obj_ubigeo.departamento_id;
            }
            if (this.obj_ubigeo.provincia_id != undefined) {
                this.ubigeo.ubigeo_id = +this.obj_ubigeo.provincia_id;
            }
            if (this.obj_ubigeo.distrito_id != undefined) {
                this.ubigeo.ubigeo_id = +this.obj_ubigeo.distrito_id;
            }
            if (this.obj_ubigeo.ubigeo_id != undefined) {
                this.ubigeo.ubigeo_id = +this.obj_ubigeo.ubigeo_id;
            }
            if (this.obj_ubigeo.latitud != undefined) {
                this.ubigeo.latitud = +this.obj_ubigeo.latitud;
            }
            if (this.obj_ubigeo.longitud != undefined) {
                this.ubigeo.longitud = +this.obj_ubigeo.longitud;
            }
            if (this.obj_ubigeo.direccion != undefined) {
                this.ubigeo.desc_ini = this.obj_ubigeo.direccion;
            }
        } else {
            this.obj_ubigeo = {};
        }

        /* storage */
        let check_storage = this.storage.has('APM_UBIGEO');
        let obj = {};
        obj[this.ubigeo.unidad_negocio] = [];

        if (!check_storage) {
            this.storage.set('APM_UBIGEO', obj);
        } else {
            let check_unidad_negcio = this.storage.exists('APM_UBIGEO', this.ubigeo.unidad_negocio);
            if (!check_unidad_negcio) {
                this.storage.add('APM_UBIGEO', this.ubigeo.unidad_negocio, []);
            }
        }
        this.data_local = this.storage.get('APM_UBIGEO');
        /* storage */

        this.gesubigeoListarFirst();
        if (this.ubigeo.ubigeo_id != 0 && this.ubigeo.ubigeo_id != undefined && this.ubigeo.ubigeo_id != null) {
            this.gesubigeoObtenerEstructura();
        }
    }

    ngAfterViewInit() {
        if (this.form) {
            this.departamento_id.name = this.textLabel + 'dp_name';
            this.form.addControl(this.departamento_id);
            this.provincia_id.name = this.textLabel + 'pv_name';
            this.form.addControl(this.provincia_id);
            this.distrito_id.name = this.textLabel + 'ds_name';
            this.form.addControl(this.distrito_id);
            if (this.nombre_lugar) {
                this.nombre_lugar.name = this.textLabel + 'nl_name';
                this.form.addControl(this.nombre_lugar);
            }
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.ubigeoId) {
            this.ubigeo.ubigeo_id = this.ubigeoId;
            if (this.ubigeo.ubigeo_id != 0 && this.ubigeo.ubigeo_id != undefined) {
                this.gesubigeoObtenerEstructura();
            }
        }
    }

    trackByFn(index, item) {
        return item.id;
    }

    gesubigeoObtenerEstructura() {
        let pl1_: any = {};
        let pl2_: any = {};
        let nivel: number = 0;
        let arr_aux = this.data_local[this.ubigeo.unidad_negocio];
        if (arr_aux != undefined && Object.prototype.toString.call(arr_aux) === '[object Array]') {
            let element = arr_aux.find(function (el_a) {
                if (el_a.ubigeo_id == this.ubigeo.ubigeo_id) {
                    nivel = 1;
                    return el_a;
                } else {
                    if (el_a.childs) {
                        return el_a.childs.find(function (el_b) {
                            if (el_b.ubigeo_id == this.ubigeo.ubigeo_id) {
                                pl1_ = el_a;
                                nivel = 2;
                                return el_b;
                            } else {
                                if (el_b.childs) {
                                    return el_b.childs.find(function (el_c) {
                                        if (el_c.ubigeo_id == this.ubigeo.ubigeo_id) {
                                            pl2_ = el_a;
                                            pl1_ = el_b;
                                            nivel = 3;
                                            return el_c;
                                        }
                                    }.bind(this));
                                }
                            }
                        }.bind(this));
                    }
                }
            }.bind(this));
            if (element) {
                this.eval_estructura({
                    nivel: nivel,
                    padre1_id: pl1_.ubigeo_id,
                    padre2_id: pl2_.ubigeo_id
                });
            } else {
                this.call_estructura();
            }
        } else {
            this.call_estructura();
        }
    }

    call_estructura() {
        this.aDMUbigeoService.gesubigeoObtenerEstructura({
            ubigeo_id: this.ubigeo.ubigeo_id // Optional
        }, (resp: pGesubigeoObtenerEstructura) => {
            this.eval_estructura(resp);
        });
    }

    eval_estructura(estructura) {
        switch (estructura.nivel) {
            case 1:
                this.ubigeo.departamento_id = this.ubigeo.ubigeo_id;
                break;
            case 2:
                this.ubigeo.departamento_id = estructura.padre1_id;
                this.ubigeo.provincia_id = this.ubigeo.ubigeo_id;
                this.gesubigeoListarSecond(false);
                break;
            case 3:
                this.ubigeo.departamento_id = estructura.padre2_id;
                this.ubigeo.provincia_id = estructura.padre1_id;
                this.ubigeo.distrito_id = this.ubigeo.ubigeo_id;
                this.gesubigeoListarSecond(true);
                break;
        }
    }

    gesubigeoListarFirst() {
        let arr_n1_aux = this.data_local[this.ubigeo.unidad_negocio];
        if (arr_n1_aux.length == 0) {
            this.aDMUbigeoService.gesubigeoListar({
                unidad_negocio_id: this.ubigeo.unidad_negocio,
            }, (resp: pGesubigeoListar[]) => {
                this.data_local[this.ubigeo.unidad_negocio] = resp;
                this.storage.set('APM_UBIGEO', this.data_local);
                this.ubigeo.departamentos = resp;
                if (this.ubigeo.departamentos.length == 1) {
                    this.ubigeo.departamento = this.ubigeo.departamentos[0].nombre;
                    this.ubigeo.departamento_id = this.ubigeo.departamentos[0].ubigeo_id;
                    this.gesubigeoListarSecond();
                }
            })
        } else {
            this.ubigeo.departamentos = this.data_local[this.ubigeo.unidad_negocio];
            if (this.ubigeo.departamentos.length == 1) {
                this.ubigeo.departamento = this.ubigeo.departamentos[0].nombre;
                this.ubigeo.departamento_id = this.ubigeo.departamentos[0].ubigeo_id;
                this.gesubigeoListarSecond();
            }

        }
    }

    gesubigeoListarSecond(nullable?: boolean) {
        this.obj_ubigeo.departamento_id = this.ubigeo.departamento_id;
        this.departamento = this.ubigeo.departamentos.find(function (el) {
            if (el.ubigeo_id == this.ubigeo.departamento_id) return el;
        }.bind(this));
        this.obj_ubigeo.departamento_nombre = this.departamento.nombre;

        let arr_n1_aux = this.data_local[this.ubigeo.unidad_negocio];
        let idx_: number;
        let arr_n2_aux = arr_n1_aux.find(function (el, idx) {
            if (el.ubigeo_id == this.ubigeo.departamento_id) {
                idx_ = idx;
                return el;
            }
        }.bind(this));


        if (nullable == undefined) {
            this.ubigeo.provincia_id = null;
            this.obj_ubigeo.provincia_id = null;
            this.ubigeo.distrito_id = null;
            this.obj_ubigeo.distrito_id = null;
        }

        if (!arr_n2_aux.childs) {
            this.aDMUbigeoService.gesubigeoListar({
                unidad_negocio_id: this.ubigeo.unidad_negocio,
                ubigeo_padre_id: this.ubigeo.departamento_id,
            }, (resp: pGesubigeoListar[]) => {
                this.ubigeo.provincias = resp;
                this.data_local[this.ubigeo.unidad_negocio][idx_].childs = resp;
                this.storage.set('APM_UBIGEO', this.data_local);
                if (resp.length == 1) {
                    this.ubigeo.provincia = resp[0].nombre;
                    this.ubigeo.provincia_id = resp[0].ubigeo_id;
                    if (nullable == undefined) {
                        this.gesubigeoListarThird();
                    }
                }
                if (nullable === true) {
                    this.gesubigeoListarThird(nullable);
                } else if (nullable === false) {
                    this.gesubigeoListarThird();
                }
            });
        } else {
            this.ubigeo.provincias = this.data_local[this.ubigeo.unidad_negocio][idx_].childs;
            if (this.ubigeo.provincias.length == 1) {
                this.ubigeo.provincia = this.ubigeo.provincias[0].nombre;
                this.ubigeo.provincia_id = this.ubigeo.provincias[0].ubigeo_id;
                if (nullable == undefined) {
                    this.gesubigeoListarThird();
                }
            }
            if (nullable === true) {
                this.gesubigeoListarThird(nullable);
            } else if (nullable === false) {
                this.gesubigeoListarThird();
            }
        }
    }

    gesubigeoListarThird(nullable?: boolean) {
        this.obj_ubigeo.provincia_id = this.ubigeo.provincia_id;
        this.provincia = this.ubigeo.provincias.find(function (el) {
            if (el.ubigeo_id == this.ubigeo.provincia_id) return el;
        }.bind(this));
        this.obj_ubigeo.provincia_nombre = this.provincia.nombre;

        let arr_n1_aux = this.data_local[this.ubigeo.unidad_negocio];
        let idx_: number;
        let arr_n2_aux = arr_n1_aux.find(function (el, idx) {
            if (el.ubigeo_id == this.ubigeo.departamento_id) {
                idx_ = idx;
                return el;
            }
        }.bind(this));
        let idx2_: number;
        let arr_n3_aux = arr_n2_aux.childs.find(function (el, idx) {
            if (el.ubigeo_id == this.ubigeo.provincia_id) {
                idx2_ = idx;
                return el;
            }
        }.bind(this));

        if (nullable == undefined) {
            this.ubigeo.distrito_id = null;
            this.obj_ubigeo.distrito_id = null;
        }

        if (!arr_n3_aux.childs) {
            this.aDMUbigeoService.gesubigeoListar({
                unidad_negocio_id: this.ubigeo.unidad_negocio,
                ubigeo_padre_id: this.ubigeo.provincia_id,
            }, (resp: pGesubigeoListar[]) => {
                this.ubigeo.distritos = resp;
                this.data_local[this.ubigeo.unidad_negocio][idx_].childs[idx2_].childs = resp;
                this.storage.set('APM_UBIGEO', this.data_local);
                if (resp.length == 1) {
                    this.ubigeo.distrito = resp[0].nombre;
                    this.ubigeo.distrito_id = resp[0].ubigeo_id;
                }
                if (nullable === true) {
                    this.lastSelect(nullable);
                }
            });
        } else {
            this.ubigeo.distritos = this.data_local[this.ubigeo.unidad_negocio][idx_].childs[idx2_].childs;
            if (this.ubigeo.distritos.length == 1) {
                this.ubigeo.distrito = this.ubigeo.distritos[0].nombre;
                this.ubigeo.distrito_id = this.ubigeo.distritos[0].ubigeo_id;
            }
            if (nullable === true) {
                this.lastSelect(nullable);
            }
        }
    }

    lastSelect(nullable?: boolean) {
        this.obj_ubigeo.distrito_id = this.ubigeo.distrito_id;
        this.distrito = this.ubigeo.distritos.find(function (el) {
            if (el.ubigeo_id == this.ubigeo.distrito_id) return el;
        }.bind(this));
        this.obj_ubigeo.distrito_nombre = this.distrito.nombre;
        if (this.bindingSelect && nullable == undefined) {
            this.ubigeo.desc_ini = this.departamento.nombre + ' ' + this.provincia.nombre + ' ' + this.distrito.nombre;
        }
        if (nullable === true) {
            this.ubigeo.desc_ini = this.obj_ubigeo.direccion;
        }
        this.obj_ubigeo.direccion = this.ubigeo.desc_ini;
        if (this.departamento.ubigeo_id) {
            this.obj_ubigeo.ubigeo_id = this.departamento.ubigeo_id;
        }
        if (this.provincia.ubigeo_id) {
            this.obj_ubigeo.ubigeo_id = this.provincia.ubigeo_id;
        }
        if (this.distrito.ubigeo_id) {
            this.obj_ubigeo.ubigeo_id = this.distrito.ubigeo_id;
        }
    }

    setLatLng(lat, lng, place_text) {
        this.ubigeo.latitud = lat;
        this.ubigeo.longitud = lng;
        this.obj_ubigeo.latitud = this.ubigeo.latitud;
        this.obj_ubigeo.longitud = this.ubigeo.longitud;
        this.obj_ubigeo.direccion = place_text;
    }

    getAddress(place: any) {
        this.setLatLng(place.geometry.location.lat(), place.geometry.location.lng(), place.place_text);
        this.ubigeo.desc_ini = place.place_text;
        this.zone.run(() => this.ubigeo.formatted_address = place['formatted_address']);
    }

    getInput(input: any) {
        this.obj_ubigeo.direccion = input
    }

    onChoseLocation(event) {
        this.setLatLng(event.coords.lat, event.coords.lng, this.ubigeo.desc_ini);
    }
}