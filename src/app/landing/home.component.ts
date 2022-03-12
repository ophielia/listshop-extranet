import { Component, OnInit } from '@angular/core';


import { Router, Event, NavigationStart, RoutesRecognized,
  RouteConfigLoadStart, RouteConfigLoadEnd,
  NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    ngOnInit(): void {
        //throw new Error("Method not implemented.");
    }



  constructor(private router: Router) {
    router.events.subscribe( (event: Event) => {
    if (event instanceof NavigationStart) {
      // Navigation started.
    } else if (event instanceof NavigationEnd) {
      // Navigation Ended Successfully.
    /*
      this.isLogin = event.url.includes("login");
      this.isSignup = !this.isLogin;
     */
    }

  });
}

}
