import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-arrow-to-top',
  templateUrl: './arrow-to-top.component.html',
  styleUrls: ['./arrow-to-top.component.scss']
})
export class ArrowToTopComponent {

  displayArrow: boolean = false;
  activeArrow: boolean = false;

  constructor() {
    this.aparecerNaTela()
  }

  @HostListener('window:scroll', [])
  aparecerNaTela() {
    let altura = window.scrollY

    if (altura >= 600) {
      this.displayArrow = true;
      this.activeArrow = true;
    } else if (altura < 600) {
      this.displayArrow = false;
    }
  }

  voltarParaTopo() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
