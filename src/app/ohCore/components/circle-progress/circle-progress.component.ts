import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

@Component({
	selector: 'ngx-circle-progress',
	templateUrl: './circle-progress.component.html',
	styleUrls: ['./circle-progress.component.scss']
})
export class CircleProgressComponent implements OnInit {

	@Input() isBig: boolean = false;
	@Input() value: number = 0;
	@Input() color: string = 'blue';
	//a tiempo = inTime, sobre e ltiempo = onTime , fuera de tiempo = outTime
	@Input() config: any = { inTime: 50, onTime: 100 }

	value_rounded: any
	classes = [];

	constructor() { }

	ngOnInit() {

		if (this.value < this.config.inTime) {
			this.color = 'red'
		} else if (this.value > this.config.inTime && this.value < this.config.onTime) {
			this.color = 'orange'
		} else {
			this.color = 'green'
		}

		this.value_rounded = Math.round(this.value)
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.value) {
			this.value_rounded = Math.round(this.value)
			if (this.value < this.config.inTime) {
				this.color = 'orange'
			} else if (this.value > this.config.inTime && this.value < this.config.onTime) {
				this.color = 'green'
			} else {
				this.color = 'red'
			}
		}
	}

}