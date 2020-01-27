import { Component, OnInit, AfterViewInit, EventEmitter, Output, Input, ViewChild, SimpleChanges } from '@angular/core';
import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';
import { ADMEmpresaServiceJPO, pGesempresaDireccionListar } from 'src/app/module/ADM/service/adm.aDMEmpresaService';
import { NgForm, NgModel } from '@angular/forms';

@Component({
    selector: 'company-direction-select',
    templateUrl: './shi.companyDirectionSelect.html',
    // styleUrls: ['./shi.companyDirectionSelect.css'],
})

export class CompanyDirectionSelect implements OnInit, AfterViewInit {

    public aDMEmpresaService: ADMEmpresaServiceJPO;
    public list: any;
    public selected: pGesempresaDireccionListar;
    @Input() public disabled: any = false;
    @Input() public required: any = false;
    @Input() public form: NgForm = undefined;
    @Input() public company_id: number = 0;
    @Input() public valueIn: string = 'empresa_direccion_id';
    @Input() public valueOut: string = 'empresa_direccion_id';
    // For valueIn/valueOut values: 'object' or : {empresa_direccion_id, direccion, distrito_id, provincia, departamento_id, latitud, longitud, etc} of the pGesempresaDireccionListar
    @Input() public value: any;

    @Input() public tipo_direccion_id: any;

	@Output() public valueChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() public change: EventEmitter<any> = new EventEmitter();
    @ViewChild('selectItem', { static: false }) public select_item: NgModel;
    @ViewChild('inputItem', { static: true }) public input_item: NgModel;

    constructor(private ohService: OHService, public cse: CoreService) {
        this.aDMEmpresaService = new ADMEmpresaServiceJPO(ohService);
        this.list = [];
        this.selected = null;
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        if (this.form !== undefined) {
            if (this.select_item){
                this.select_item.name = 'si_name';
                this.form.addControl(this.select_item);
            }
            if (this.input_item){
                this.input_item.name = 'in_name';
                this.form.addControl(this.input_item);
            }
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if(changes.company_id && changes.company_id.currentValue != changes.company_id.previousValue){
            this.selected = null;
            this.gesempresaDireccionListar();
        }
    }

    trackByFn(index, item) {
        return item.id;
    }

    gesempresaDireccionListar() {
      
        this.aDMEmpresaService.gesempresaDireccionListar({
            empresa_id: this.company_id,
            tipo_direccion_id : this.tipo_direccion_id
        }, (resp: pGesempresaDireccionListar) => {
            this.list = resp.empresa_direccions;
            if (this.list.length == 0) {
                this.clear();
                this.emitValues(null);
            } else if (this.list.length == 1) {
                this.selected = resp[0];
                this.emitEvent();
            } 
            if (this.value != undefined) {
                this.selected = this.list.find(el => el[this.valueIn] == this.value[this.valueIn]);
            }
        });
    }

    changeOption(event?: any) {
        this.emitEvent();
    }

    emitEvent(){
        this.value = (this.valueOut == 'object' ? this.selected : this.selected[this.valueOut]);
        this.emitValues(this.value);
    }

    emitValues(val: any){
        this.change.emit(val);
        this.valueChange.emit(val);
    }

    clear() {
        this.value = null;
        this.selected = null;
    }
}