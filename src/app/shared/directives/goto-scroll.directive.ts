import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appGotoScroll]'
})
export class GotoScrollDirective {

  constructor(private elementRef: ElementRef) { }

  @HostListener('click')
  public onClick() {
    if (window && window.pageYOffset) {
      window.scroll(0, 0);
    }

    console.log('directive');
  }

}
