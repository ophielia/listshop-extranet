import {Component, OnInit} from '@angular/core';


import {Event, NavigationEnd, NavigationStart, Router} from '@angular/router';

@Component({
    selector: 'app-meal-plans',
    templateUrl: './meal-plans.component.html',
    styleUrls: ['./meal-plans.component.scss']
})
export class MealPlansComponent implements OnInit {
    ngOnInit(): void {
        //throw new Error("Method not implemented.");
    }


    constructor(private router: Router) {
        router.events.subscribe((event: Event) => {
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
