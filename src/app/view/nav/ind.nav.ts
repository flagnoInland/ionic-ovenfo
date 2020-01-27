import { Component, Input, Output, EventEmitter, HostListener, ViewChild, ElementRef, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

import { ohTransition, ohLeftMenu } from './../../ohCore/animations/oh.core';

import { OHService } from './../../tis.ohService';
import { CoreService } from './../../ind.coreService';
import { NgbModal } from '../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { shared } from 'src/environments/environmentShared';
import { Messaging } from 'src/app/ind.messaging';
import { OHSUserServiceJPOImp } from 'src/app/service/ohs.oHSUserServiceImp';

declare var apmdata: any;

@Component({
  selector: 'ind-nav',
  animations: [ohTransition, ohLeftMenu],
  templateUrl: './ind.nav.html',
  styleUrls: ['./ind.nav.css'],
  encapsulation: ViewEncapsulation.None
})

export class Nav implements AfterViewInit {

	@ViewChild("liBreadC", { static: true }) liBreadC: ElementRef;
	@ViewChild('dialogAdds', { static: true }) dialogAdds : ElementRef;

	@Input() openMenu : boolean;
	@Output() openMenuChange: EventEmitter<boolean>;

	openedIndex : any;
	//private myStore : ohStorage;
	currentWidth : number;

	urlTree : any;
	baseBe : string;

	openUoOption : boolean;
	private oHSUserService : OHSUserServiceJPOImp;

	constructor(private ohService : OHService, private router: Router, public coreService : CoreService, private title : Title, private modalService: NgbModal, private messagingService: Messaging) {
		
		this.baseBe = shared.baseBackEnd;
		this.urlTree = {
			list : []
		};
		this.openMenuChange = new EventEmitter<boolean>();
		this.oHSUserService = new OHSUserServiceJPOImp(ohService);

		this.router.errorHandler = (error: any) => {
			ohService.getOH().getLoader().showError({
				error : error.stack,
				errorCodigo : "router.errorHandler"
			});
		}
		
		this.openedIndex = -1;
		router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(e => {
		
			this.loadTitle(e["url"]);

			this.urlTree = {
				list : []
			}; 
			this.openUoOption = false;
			if(coreService.data && coreService.data.uo){
				var index = coreService.data.uo_id[e["url"]];
				if(index>=0){
					this.openUoOption = true;
					this.urlTree.list.push({
						urlTree : "",
						icon : coreService.data.uo[Number(index)].icon,
						name : coreService.data.uo[Number(index)].name
					});
				}
			}
			if(coreService.data && coreService.data.routeRol){

				var parts = e["url"].split("/");

				var initBase = "/"+shared.baseBackEnd; // /Be

				if(e["url"].indexOf(initBase)==0 && parts.length>=3){
					parts = e["url"].substr(initBase.length).split("/");
				}

				let isSuccess : boolean = false;
				let subTrace : string = initBase;
				for(var i = 1;i < parts.length; i++){ // desde /
					subTrace += "/"+parts[i];
					if(coreService.data.routeRol[subTrace]){
						if(coreService.data.routeRol[subTrace].hasId){
							coreService.data.routeId[subTrace] = {
								id : parts[i+1],
								url : subTrace+"/"+parts[i+1]
							};
							i++;
						} else {
							isSuccess = true;
						}
					} else {
						isSuccess = false;
						break;
					}
				}

				if(isSuccess){
					this.urlTree = coreService.data.routeRol[subTrace];
					for(var i = 0;i < this.urlTree.list.length; i++){ 
						if(this.urlTree.list[i].id == this.urlTree.id){
							this.title.setTitle(shared.proyect+" - "+this.urlTree.list[i].name);
						}
						var urlObj = coreService.data.routeId[this.urlTree.list[i].urlTree];
						if(urlObj){
							this.urlTree.list[i].urlTree = urlObj.url;
						}
					}
				}
			}
			//this.myStore.add("APM_DATA","routeCurrentTree", this.urlTree.list);
			if(this.openMenu && this.currentWidth < 1024){
				this.changeMenu();
			}
		});

	}

	ngAfterViewInit(): void {
		this.renderBread(window.innerWidth);
	}

	loadTitle(url : string){
		if(this.coreService.data && this.coreService.data.uo){
			var index = this.coreService.data.uo_id[url];
			if(index){
				this.title.setTitle(shared.proyect+" - "+this.coreService.data.uo[Number(index)].name);
			}
		}
	}

	// Compat IE Fire plus 5
	renderBread(innerWidth : number){
		this.currentWidth = innerWidth;
		if(this.liBreadC){
			var totl;
			if(innerWidth < 1024){
				totl = innerWidth - 148 - 4; 
			} else {
				totl = innerWidth - 395 - 4;
			}

			if((window.innerWidth - 250) <= 360){
				if(totl <= (window.innerWidth - 250)){
					totl = 223;
				}
			}

			this.liBreadC.nativeElement.style['width'] = totl+"px";
		}
	}

	@HostListener('window:resize', ['$event'])
	onResize(event) {
		this.renderBread(event.target.innerWidth);
	}

	changeMenu(){
		this.openMenu = !this.openMenu;
		this.openMenuChange.emit(this.openMenu);
		if(window.innerWidth < 1024){
			if(this.openMenu){
				this.renderBread(window.innerWidth - 250);
			} else {
				setTimeout(() => {
					this.renderBread(window.innerWidth);
				}, 300);
			}
		}
	}

	logOut(){

		let modalParams = {
			title : "Cerrar sessión",
			btnAccept : "Cerrar",
			btnAcceptIcon : "fas fa-power-off",
			btnAcceptBack : "btn btn-danger",
			btnCancel : "Retornar",
			btnCancelIcon : "fas fa-reply",
			btnCancelBack : 'btn btn-outline-info'
		};

		this.ohService.getOH().getUtil().confirm("¿Desea cerrar sessión?, asegúrese de no estar en alguna transacción ya que se perderán los datos de usuario guardados en su dispositivo",() => {
			this.doLogout(true);
		},(tipomensaje) => {
			
		}, modalParams);
	}

	onUpdate(){
		apmdata.service.update();
		window.setTimeout(() => {
			window.location.reload();
		});
	}

	doLogout(desabilitar : boolean){
		this.ohService.getOH().getLoader().show();
		this.coreService.inland_main.usuarios_conectados.eliminar(this.coreService.data.user.data.token);
		if(desabilitar){
			this.oHSUserService.segloginDesconectar();
		}
		this.messagingService.dessubscribirse(false, () => {
			window.setTimeout(() => {
				localStorage.removeItem("APM_DATA");
				localStorage.removeItem("APM_FIRST");
				for(var i = 0; i < this.coreService.data.user.systems.length; i++){
					localStorage.removeItem("APM_"+this.coreService.data.user.systems[i].id.trim().toUpperCase()+"_DATA");
				}
				//this.coreService.logoutHref();
				this.router.navigate(['/Login']);

			}, 500);
		});
	}

	loaderError(e){
		e.preventDefault();
		this.ohService.getOH().getLoader().showError("Ha ocurrido un error");
	}

	modalRef : any;
	openNews() {
		this.openedIndex = -1;
		this.modalRef = this.modalService.open(this.dialogAdds, {
			ariaLabelledBy: 'modal-basic-title',
			windowClass: 'dark-modal'
		});
		this.modalRef.result.then((result) => {
		}, (reason) => {
		});
	}

	openAdd(index : number){
		this.openedIndex = index;
		this.modalRef = this.modalService.open(this.dialogAdds, {
			ariaLabelledBy: 'modal-basic-title',
			windowClass: 'dark-modal'
		});
		this.modalRef.result.then((result) => {
		}, (reason) => {
		});
	}

	closeAdd(){
		if(this.modalRef){
			this.modalRef.dismiss();
		}
	}

}