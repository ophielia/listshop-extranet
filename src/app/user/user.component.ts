import { Component, OnInit } from '@angular/core';

import {logger} from "codelyzer/util/logger";
import { Router, Event, NavigationStart, RoutesRecognized,
  RouteConfigLoadStart, RouteConfigLoadEnd,
  NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
    ngOnInit(): void {
        //throw new Error("Method not implemented.");
    }

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

}
