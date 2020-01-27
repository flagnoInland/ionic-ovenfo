import { Directive, ElementRef, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
  // <input type="text" ... ohScrollMove ...>
@Directive({
  selector: '[ohScrollMove]'
})

export class ScrollMove {
    
    constructor(private elemento: ElementRef, private router: Router) {

      router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(e => {
        setTimeout(() => {
          this.elemento.nativeElement.scrollLeft = this.elemento.nativeElement.scrollWidth;
        })
      });
      
    }
    
    ngAfterViewInit() {
      setTimeout(() => {
        this.elemento.nativeElement.scrollLeft = this.elemento.nativeElement.scrollWidth;
      })
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
      this.elemento.nativeElement.scrollLeft = event.target.innerWidth;
    }
    
}