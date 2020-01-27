import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { OHService } from '../../../../../../tis.ohService';
import { CoreService } from '../../../../../../ind.coreService';
import { Jpo } from '../../../../../../ohCore/services/jpo/oh.jpo';
import { BUEBase } from '../../bue.base';
import { BUECoreService } from '../../bue.coreService';

@Component({
	selector: 'bue-plantillaConfig',
	templateUrl: './bue.plantillaConfig.html'
})

export class BUEPlantillaConfig extends BUEBase {
	
	@Input()
	design: any;
	@Output()
	onGrabar: EventEmitter<any>;
	@Output()
	onValidar: EventEmitter<any>;
	view: any;
	
	isEdited: boolean;
	viewOld: any;
	view_id: any;
	jpo: Jpo;
	constructor(private router: Router, private route: ActivatedRoute, private ohService: OHService, public cse: CoreService, private acs: BUECoreService) {
		super(ohService, cse, acs);
		this.onGrabar = new EventEmitter<any>();
		this.onValidar = new EventEmitter<any>();
		this.view = {};
		this.jpo = ohService.getOH().getJPO("IPR", "module.obu", "ViewServiceImp");
	}
	ngOnInit() {
		this.route.params.subscribe(params => {
			if (typeof (params['id']) != "undefined") { // For editing
				this.view_id = params['id'];
				this.isEdited = true;
			}
			else {
				this.view.prefix = this.acs.data.profile.profileId;
			}
		});
		this.loadView();
	}
	ngAfterViewInit() {
	}
	loadView() {
		//this.design.config.package = this.acs.data.sourceA.url_source;
		//this.design.config.prefix = this.acs.data.profile.profileId;
		//this.view.proyect_id = this.acs.data.profile.id;
	}
	validar() {
		this.onValidar.emit();
	}
	build(frm: NgForm, returning: boolean) {
		if (frm.valid) {
			this.onGrabar.emit({
				returning: returning
			});
		}
	}
	reset() {
		this.design = {
			config: {},
			content: [],
			bind: {
				entities: [],
				methods: [],
				services: [],
				predefineds: []
			},
			loaded: false,
			observaciones: []
		};
	}
	relinkear() {
	}
	autogenerar(item: any) {
		if (item.config.value.valor) {
			item.config.id = "inp_" + item.config.value.valor.replace(/\./g, "_");
		}
		this.validar();
	}
}
