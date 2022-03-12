import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Event, NavigationEnd, NavigationStart, Router} from "@angular/router";
import {map} from "rxjs/operators";
import {BehaviorSubject, Observable} from "rxjs";
import {DOCUMENT} from "@angular/common";

@Component({
  selector: 'user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.scss']
})
export class UserHeaderComponent implements OnInit {



  isLogin: boolean = false
  isSignup: boolean = false

  constructor(private router: Router) {
    router.events.subscribe( (event: Event) => {
      if (event instanceof NavigationStart) {
        // Navigation started.
      } else if (event instanceof NavigationEnd) {
        // Navigation Ended Successfully.
        this.isLogin = event.url.includes("login");
        this.isSignup = !this.isLogin;
      }

    });
  }


  ngOnInit(): void {

  }
}
