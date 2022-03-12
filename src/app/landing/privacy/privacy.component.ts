import { Component } from '@angular/core';
import {LandingFixService} from "../../shared/services/landing-fix.service";
import {ActivatedRoute} from "@angular/router";
import {Meta, Title} from "@angular/platform-browser";

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent {



  constructor(private fix: LandingFixService,
              private route: ActivatedRoute,
              private title: Title,
              private meta: Meta) { }

  ngOnInit() {
    this.title.setTitle( this.route.snapshot.data['title']);
    this.meta.updateTag({name: 'description', content: this.route.snapshot.data['content']});
    this.meta.addTag({name: this.route.snapshot.data['title'], content: this.route.snapshot.data['content']});
    this.meta.updateTag({property: 'og:title', content: this.route.snapshot.data['content']});
    this.fix.addFixTwo();
  }


}
