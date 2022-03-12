import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-intro-two',
  templateUrl: './intro-two.component.html',
  styleUrls: ['./intro-two.component.scss']
})
export class IntroTwoComponent {

  constructor(private modalService: NgbModal) { }
  openVerticallyCentered(content) {
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

}
