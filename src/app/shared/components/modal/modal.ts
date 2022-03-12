import {Component, EventEmitter, Input, Output} from '@angular/core';


@Component({
  selector: 'app-modal',
  template: `
    <div (click)="onContainerClicked($event)" class="modal fade" tabindex="-1" [ngClass]="{'in': visibleAnimate}"
         [ngStyle]="{'display': visible ? 'block' : 'none', 'opacity': visibleAnimate ? 1 : 0}">
      <div class="modal-dialog modal-dialog-centered" style="margin-top:100px;">
        <div class="modal-content">

          <div class="modal-body">
            <ng-content select=".app-modal-body"></ng-content>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal {
      background: rgba(0, 0, 0, 0.6);
    }
  `]
})
export class ModalComponent {

  public visible = false;
  visibleAnimate = false;
  @Input() autoHide: number = 0;
  @Output() modalResult: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
  }

  public show(): void {
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true, 100);
    if (this.autoHide > 0) {
      setTimeout(() => this.hide(), this.autoHide);
    }
  }

  public hide(): void {
    this.visibleAnimate = false;
    setTimeout(() => this.visible = false, 300);
  }

  public onContainerClicked(event: MouseEvent): void {
    if ((<HTMLElement>event.target).classList.contains('modal')) {
      this.hide();
    } else if ((<HTMLElement>event.target).classList.contains('buttonclick')) {
      var result = (<HTMLButtonElement>event.target).value;
      this.modalResult.emit(result);
      this.hide();
    }
  }

}
