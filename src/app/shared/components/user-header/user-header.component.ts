import {Component, OnInit} from '@angular/core';
import {Event, NavigationEnd, NavigationStart, Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentication.service";

@Component({
    selector: 'user-header',
    templateUrl: './user-header.component.html',
    styleUrls: ['./user-header.component.scss']
})
export class UserHeaderComponent implements OnInit {


    isLogin: boolean = false
    isSignup: boolean = false
    isLoggedIn: boolean = false

    constructor(private router: Router,
                private authorizationService: AuthenticationService) {
        router.events.subscribe((event: Event) => {
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
        this.isLoggedIn = this.authorizationService.isAuthenticated();
    }
}
