import { Component, Input, EventEmitter, Output, ViewChild, SimpleChanges } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgModel, NgForm } from '@angular/forms';
import { OHService } from 'src/app/tis.ohService';

/**
* Implementacion
* <oh-datetime [form]="frmSolicitud" [name]="'inp_fecha_cita'" [(fecha_hora)]="solicitud.fecha_cita"></oh-datetime>
*/

@Component({
	selector: 'oh-datetime',
	templateUrl: './oh.datetime.html'
})

export class DateTime {

	@ViewChild("modalSeleccion",{ static: false }) modalSeleccion: NgbModalRef;
	@Input() title: string;

	@Input() fecha_hora: Date;

	@Output() fecha_horaChange: EventEmitter<Date>;

	@Input() name: string;
	@Input() required: boolean;
	@Input() form: NgForm;
	@Input() module: number = 1; // with input = 1 / sin input = 2 
	@Input() min: any
	@Input() max: any
	@Input() disabled: boolean

	@Input() default: any;
	@Input() time: any;

	fecha_hora_descripcion: string;
	fecha: any;
	hora: any;
	min_date: any
	max_date: any
	minDate = { year: 2019, month: 7, day: 25 };

	@Output() onChange: EventEmitter<any> = new EventEmitter();

	@ViewChild('inp_fecha', { static: false }) inp_fecha: NgModel;

	constructor(private servicioModal: NgbModal, private ohCore: OHService) {
		this.fecha_horaChange = new EventEmitter<Date>();
	};

	ngOnInit() {
		if (this.default) {
			this.fecha_hora_descripcion = this.default.getFullYear() + '-' + (this.default.getMonth() + 1) + '-' + this.default.getDate() + ' ' + this.ohCore.getOH().getUtil().pad(this.default.getHours()) + ":" + this.ohCore.getOH().getUtil().pad(this.default.getMinutes()) + ":00";
		}
		if(this.time){
			this.hora = this.time;
		}
	}
	ngAfterViewInit() {
		if (this.form && this.inp_fecha) {
			this.inp_fecha.name = this.name;
			this.form.addControl(this.inp_fecha);
		}
	}

	ngOnChanges(changes: SimpleChanges) {

		if(changes.fecha_hora && changes.fecha_hora.currentValue){
			let fecha = new Date(changes.fecha_hora.currentValue);
			this.fecha_hora_descripcion = this.ohCore.getOH().getUtil().dateToStringTwo(fecha) + " " + this.ohCore.getOH().getUtil().pad(fecha.getHours()) + ":" + this.ohCore.getOH().getUtil().pad(fecha.getMinutes()) + ":00";
		}
		
		if (changes.min) {
			if (this.min) {
				if (typeof this.min.getFullYear === "function") {
					this.min_date = { year: this.min.getFullYear(), month: this.min.getMonth() + 1, day: this.min.getDate() };
				} else {
					this.min_date = { year: this.min.year, month: this.min.month, day: this.min.day };
				}
			}
		}
		if (changes.max) {
			if (this.max) {
				if (typeof this.max.getFullYear === "function") {
					this.max_date = { year: this.max.getFullYear(), month: this.max.getMonth() + 1, day: this.max.getDate() };
				} else {
					this.max_date = { year: this.max.year, month: this.max.month, day: this.max.day };
				}
			}
		}
	}

	abrirModal() {
		const modalRef = this.servicioModal.open(this.modalSeleccion, {centered: true, size: 'sm', scrollable: true, backdrop: 'static'});
		modalRef.result.then((result) => {
			if (result == "GUARDAR") {
				if (typeof this.fecha.getFullYear === "function") {
					this.fecha_hora = new Date(this.fecha.getFullYear(), this.fecha.getMonth(), this.fecha.getDate(), this.hora.hour, this.hora.minute, 0);
				} else {
					this.fecha_hora = new Date(this.fecha.year, this.fecha.month - 1, this.fecha.day, this.hora.hour, this.hora.minute, 0);
				}
				this.fecha_hora_descripcion = this.ohCore.getOH().getUtil().dateToStringTwo(this.fecha_hora) + " " + this.ohCore.getOH().getUtil().pad(this.hora.hour) + ":" + this.ohCore.getOH().getUtil().pad(this.hora.minute) + ":00";

				this.fecha_horaChange.emit(this.fecha_hora);
				this.onChange.emit()
			}
		}, (reason) => {
		});
	}

	ngOnDestroy() {
		if (this.form) {
			this.form.removeControl(this.inp_fecha);
		}
	}

}
