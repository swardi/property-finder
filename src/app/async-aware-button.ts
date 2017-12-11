import {Directive, ElementRef} from '@angular/core'


var spinnerElement= document.createElement("i");
    spinnerElement.setAttribute("class","fa fa-spinner")


@Directive({
  selector:'[async-aware-button]',
  inputs: ['waitUntil']
})
export class AsyncAwareButton {
  private dataPromise: Promise<any>;
  private element:ElementRef;

  constructor(el: ElementRef){
    this.element=el;
  }
  
  set waitUntil(data:Promise<any>) {
    if(!data) return;
    this.element.nativeElement.appendChild(spinnerElement);
    this.element.nativeElement.disabled=true;
    this.dataPromise = data;
    this.dataPromise.then(message => {
      this.element.nativeElement.disabled=false;
      this.element.nativeElement.removeChild(spinnerElement)
    }
    )

  }
}