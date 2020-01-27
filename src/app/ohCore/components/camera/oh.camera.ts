import { Component, Input, OnInit, ElementRef, ViewChild, HostListener, Output, EventEmitter } from '@angular/core';
import { Ad } from '../ad/oh.ad';
// import { isAbsolute } from 'path';
// <oh-camera #cameraId></oh-camera>
// this.camera.show();
// this.camera.close();
// this.camera.showError("");
// this.ohService.getOH().getcamera().show();
@Component({
	selector: 'oh-camera',
	templateUrl: './oh.camera.html',
	styleUrls: ['./oh.camera.css']
})

export class Camera implements OnInit {

	@ViewChild("videoCamera", { static: true }) video: ElementRef;
	@ViewChild("captured", { static: true }) canvas: ElementRef;
	@ViewChild("imgPreview", { static: true }) imgPreview: ElementRef;
	@ViewChild("lanePhoto", { static: true }) lanePhoto: ElementRef;
	@ViewChild("inp_archivo", { static: true }) inp_archivo: ElementRef;

	config: any;
	stream: any;
	error: any;
	cameras: any = [];
	dataVideo: any;

	enableSwitch: boolean; // has more cameras
	@Input() photos: any;
	@Input() ad: Ad;
	@Input() size: number;
	@Input() maxResizeWidth: number; // maximo de redimensionamiento de ancho
	@Input() maxResizeHeight: number; // maximo de redimensionamiento de alto

	@Output() beforeDelete: EventEmitter<any>; // hace binding al padre.

	isOpenedFlash: boolean;
	onClosed: any;
	onDelete: any;
	isOpened: boolean;
	closeOnFull: boolean;
	videoSelect: any;
	enableZoom: boolean;
	enableZooms: boolean;
	enableFlash: boolean;
	doNotResize: boolean = true;
	zoom: number = 1;
	canDelete: boolean = false

	_size: number;
	photoPreview: string;
	file: {
		multiple: true,
		formatos: 'image/png, image/jpeg',
		pesoMaximo: 2048,
		cantidadMaxima: 3
	}
	constructor() {
		this.photos = [];
		this._size = 10; // Default max length of photos
		this.config = {
			/*video : {
				facingMode : "environment"
			}*/
		}
		this.error = (e: any) => {
			//console.log('Ha ocurrido un error', e)
		}
		this.photoPreview = "";
		this.enableFlash = false;
		this.enableZooms = false;
		this.beforeDelete = new EventEmitter<any>();
	};

	ngOnInit() {
		if (!this.photos) {
			this.photos = [];
		}
		if (this.size) {
			this._size = this.size;
		}
	}

	public open(config: {
		source: any,
		closeOnFull?: boolean,
		onClose?: any,
		size?: number,
		maxResizeWidth?: number,
		maxResizeHeight?: number,
		onDelete?: any,
		canDelete?: boolean
	}) {
		this.videoSelect = null;
		this.listDevices();

		if (config.source) {
			this.photos = config.source;
		} else {
			this.photos = [];
		}
		if (config.onClose) {
			this.onClosed = config.onClose;
		}

		this.onDelete = null;
		if (config.onDelete) {
			this.onDelete = config.onDelete;
		}

		if (config.size) {
			this._size = config.size;
		}

		if (config.maxResizeWidth) {
			this.maxResizeWidth = config.maxResizeWidth;
		}

		if (config.maxResizeHeight) {
			this.maxResizeHeight = config.maxResizeHeight;
		}
		this.canDelete = config.canDelete

		this.isOpened = true;
		this.closeOnFull = config.closeOnFull;

		this.enableCamera();

		let video = this.video.nativeElement;
		video.addEventListener('loadeddata', () => {
			this.dataVideo = {
				vw: video.videoWidth,
				vh: video.videoHeight
			};
			this.position();
		});
	}

	trackById(index, item) {
		return item.id; // unique id corresponding to the item
	}

	cargar(evento: any) {
		// console.log('evento:', evento)
		// console.log('evento.target.files.length:', evento.target.files.length)
		for (let i = 0; i < evento.target.files.length; i++) {
			if (i < (this._size - this.photos.length)) {
				// console.log('evento.target.files[i]:', evento.target.files[i])
				let reader = new FileReader()
				reader.readAsDataURL(evento.target.files[i])
				reader.onload = (readerEvent: any) => {
					var image = new Image();
					image.onload = (imageEvent) => {
						let minimo_ancho = image.naturalWidth;
						let minimo_alto = image.naturalHeight;
						if (this.maxResizeWidth) {
							minimo_ancho = this.maxResizeWidth;
							minimo_alto = Math.floor((minimo_ancho * image.naturalHeight) / image.naturalWidth);
						}
						if (this.maxResizeHeight) {
							minimo_alto = this.maxResizeHeight;
							minimo_ancho = Math.floor((minimo_alto * image.naturalWidth) / image.naturalHeight);
						}
						this.canvas.nativeElement.width = minimo_ancho;
						this.canvas.nativeElement.height = minimo_alto;
						this.canvas.nativeElement.getContext('2d').drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0, 0, minimo_ancho, minimo_alto);
						this.photos.push(this.canvas.nativeElement.toDataURL("image/jpeg"));
					}
					image.src = readerEvent.target.result;
				};
				reader.onerror = function (error) {
					console.log('Error: ', error);
				};
			} else {
				break
			}
		}
		this.inp_archivo.nativeElement.value = '';
	}

	enableCamera() {
		if (this.stream) {
			this.stream.getTracks().forEach(track => {
				track.stop();
			});
		}
		var miAdv = {};
		if (!this.videoSelect) {
			miAdv = {
				facingMode: "environment"
			};
		}
		this.config = {
			video: {
				deviceId: this.videoSelect ? { exact: this.videoSelect } : undefined,
				advanced: [miAdv]
			}
		};

		if (this.doNotResize && this.maxResizeWidth) {
			this.config.video.width = { min: this.maxResizeWidth };
		}
		if (this.doNotResize && this.maxResizeHeight) {
			this.config.video.height = { min: this.maxResizeHeight };
		}

		var _thisId = this;

		let supports = navigator.mediaDevices.getSupportedConstraints();
		// console.log('supports:', supports);
		// if (supports['zoom']) {
		// 	this.enableZoom = true;
		// }
		// if (supports['torch']) {
		// 	this.enableFlash = true;
		// }
		if (supports['facingMode']) {
			this.enableSwitch = true;
		}

		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {	// Put video listeners into place
			navigator.mediaDevices.getUserMedia(this.config).then((stream) => {
				this.stream = stream; // make stream available to console
				this.video.nativeElement.srcObject = stream;
				const track = this.stream.getVideoTracks()[0];
				if (track.getCapabilities) {
					this.videoSelect = track.getCapabilities().deviceId;
					this.video.nativeElement.addEventListener('loadedmetadata', (e) => {
						window.setTimeout(() => {
							var capa = track.getCapabilities();
							// console.log('capa:', capa)
							this.enableFlash = false;
							this.enableZoom = false;
							if (capa.torch) {
								this.enableFlash = true;
							}
							if (capa.zoom) {
								this.enableZoom = true;
							}
						}, 500);
					});
				}
			}).catch(function (err) {
				if (err.name == "OverconstrainedError") {
					_thisId.doNotResize = false;
					_thisId.enableCamera();
				}
			});
		} else {
			this.ad.warning("Incompatibilidad del dispositivo para usar la cámara");
		}
	}

	listDevices() {
		navigator.mediaDevices.enumerateDevices().then((devices) => {
			let cameras = [];
			for (let i = 0; i !== devices.length; ++i) {
				let device = devices[i];
				if (device.kind === 'videoinput') {
					if (device.label.toLowerCase().indexOf("back") >= 0) {
						this.videoSelect = device.deviceId;
					}
					cameras.push({
						id: device.deviceId,
						nombre: device.label
					});
				}
			}
			this.cameras = cameras;
		}).catch(this.error);
	}

	private position() {
		let video = this.video.nativeElement;
		var videoDat = this.dataVideo;
		if (video && videoDat && videoDat.vw && videoDat.vh) {
			var w = window.innerWidth, h = window.innerHeight, vw = videoDat.vw, vh = videoDat.vh;
			if (w < h) {
				video.width = w;
				video.height = (w * vh) / vw;
				video.style.top = Math.floor((h - video.height) / 2) + "px";
				video.style.left = "0px";
			} else {
				video.width = (h * vw) / vh;
				video.height = h;
				video.style.top = "0px";
				video.style.left = Math.floor((w - video.width) / 2) + "px";
			}
		}
	}

	public capture() {
		let video = this.video.nativeElement;
		// console.log(video)
		let minimo_ancho = video.videoWidth;
		let minimo_alto = video.videoHeight;
		if (this.maxResizeWidth) {
			minimo_ancho = this.maxResizeWidth;
			minimo_alto = Math.floor((minimo_ancho * video.videoHeight) / video.videoWidth);
		}
		if (this.maxResizeHeight) {
			minimo_alto = this.maxResizeHeight;
			minimo_ancho = Math.floor((minimo_alto * video.videoWidth) / video.videoHeight);
		}

		this.canvas.nativeElement.width = minimo_ancho;
		this.canvas.nativeElement.height = minimo_alto;
		this.canvas.nativeElement.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, minimo_ancho, minimo_alto);

		this.photos.push(this.canvas.nativeElement.toDataURL("image/jpeg"));
		window.setTimeout(() => {
			this.lanePhoto.nativeElement.scrollLeft = this.lanePhoto.nativeElement.scrollWidth;
			if (this.closeOnFull && this.photos.length == this._size) {
				this.close();
			}
		});

	}

	public openFlash() {
		this.isOpenedFlash = !this.isOpenedFlash;
		const track = this.stream.getVideoTracks()[0];
		if (track.getCapabilities().torch) {
			track.applyConstraints({
				advanced: [{ torch: this.isOpenedFlash }]
			}).catch(e => console.log(e));
		}
	}

	public changeZoom() {
		if (this.stream) {
			const track = this.stream.getVideoTracks()[0];
			if (track.getCapabilities().torch) {
				track.applyConstraints({
					advanced: [{ zoom: this.zoom }]
				}).catch(e => console.log(e));
			}
		}
	}

	public close() {
		this.isOpened = false;
		this.zoom = 1;
		if (this.enableZoom) {
			this.changeZoom();
		}
		if (this.enableFlash && this.isOpenedFlash) {
			this.openFlash();
		}
		this.video.nativeElement.pause();
		this.video.nativeElement.src = "";
		for (var i in this.stream.getTracks()) {
			this.stream.getTracks()[i].stop();
		}
		if (this.onClosed) {
			this.onClosed(this.photos);
		}
	}

	@HostListener('window:resize', ['$event'])
	onResize(event) {
		this.position();
		this.positionPreview();
	}

	private positionPreview() {
		if (this.photoPreview.length > 0) {
			var img = new Image();
			img.setAttribute("src", this.photoPreview);
			if (img && img.width && img.height) {
				var w = window.innerWidth, h = window.innerHeight, vw = img.width, vh = img.height;
				if (w < h) {
					this.imgPreview.nativeElement.width = w;
					this.imgPreview.nativeElement.height = (w * vh) / vw;
				} else {
					this.imgPreview.nativeElement.width = (h * vw) / vh;
					this.imgPreview.nativeElement.height = h;
				}
				this.imgPreview.nativeElement.style['margin-top'] = Math.floor((h - this.imgPreview.nativeElement.height) / 2) + "px";
			}
		}
	}

	deletePhoto(index: number) {
		this.photos.splice(index, 1);
		if (this.onDelete) {
			this.onDelete(index);
		}
	}

	private preview(index: number) {
		this.photoPreview = this.photos[index];
		this.positionPreview();

	}

	public closePreview() {
		this.photoPreview = "";
	}

	public change() {
		if (this.cameras[1]) {
			if (this.cameras[0].id == this.videoSelect) {
				this.videoSelect = this.cameras[1].id;
			} else {
				this.videoSelect = this.cameras[0].id;
			}
			this.enableCamera();
		}
	}

}