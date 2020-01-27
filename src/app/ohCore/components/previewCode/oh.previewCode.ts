import { Component, Input } from '@angular/core';

/*
<oh-previewCode [codeText]="vistaPreviaSQL_insert"></oh-previewCode>
 */
@Component({
  selector: 'oh-previewCode',
  templateUrl: './oh.previewCode.html'
})
export class PreviewCode {

	@Input() codeText : string;
	@Input() lang : string = 'sql';

	constructor(){
	}

}