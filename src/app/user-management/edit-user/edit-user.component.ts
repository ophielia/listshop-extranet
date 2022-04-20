import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  constructor(
      private route: ActivatedRoute,
      private title: Title
  ) {
  }

  ngOnInit(): void {
    this.title.setTitle(this.route.snapshot.data['title']);
    this.route.params.subscribe(params => {
      let id = params['id'];


    });
  }

}
