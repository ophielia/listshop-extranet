import {AfterViewInit, Component, HostListener, Inject} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {WINDOW} from '../services/windows.service';
import {BreakpointObserver} from '@angular/cdk/layout';
import {AuthenticationService} from "../services/authentication.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements AfterViewInit {
    public activeClass = 'home';
    public homeOffset: any = null;
    public aboutOffset: any = null;
    public featureOffset: any = null;
    public testimonialOffset: any = null;
    public teamOffset: any = null;
    public blogOffset: any = null;
    public priceOffset: any = null;
    public contactOffset: any = null;
    public isOpenMobile = false;
    public darkHeader = false;
    public menuItems: any[];
    public isLoggedIn: boolean;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        @Inject(WINDOW) private window,
        public breakpointObserver: BreakpointObserver,
        private authorizationService: AuthenticationService
    ) {
    }

    ngOnInit(): void {
        this.isLoggedIn = this.authorizationService.isAuthenticated();
    }

    ngAfterViewInit() {
        console.log("feature offset " + this.featureOffset);
        this.homeOffset = document.getElementById('home') ? document.getElementById('home').offsetTop - 100 : 0;
        this.aboutOffset = document.getElementById('about') ? document.getElementById('about').offsetTop - 100 : 0;
        this.featureOffset = document.getElementById('feature') ? document.getElementById('feature').offsetTop - 100 : 0;
        this.testimonialOffset = document.getElementById('testimonial') ? document.getElementById('testimonial').offsetTop - 100 : 0;
    }

    active(val) {
        this.activeClass = val;
    }

    // @HostListener Decorator
    @HostListener('window:scroll', ['$event'])
    onWindowScroll() {
        const number = this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
        if (number >= 60) {
            this.darkHeader = true;
        } else {
            this.darkHeader = false;
        }
    }

    logout(): void {
        this.authorizationService.logout().subscribe(t => {
                this.isLoggedIn = false;
            });
    }
}