import { Component, HostListener, Inject, AfterViewInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { WINDOW } from '../../shared/services/windows.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import {AuthenticationService} from "../../shared/services/authentication.service";

@Component({
    selector: 'app-content-header',
    templateUrl: './content-header.component.html',
    styleUrls: ['./content-header.component.scss']
})
export class ContentHeaderComponent implements AfterViewInit  {
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
               private authorizationService : AuthenticationService
    ) {
    }

    ngOnInit(): void {
      this.isLoggedIn = this.authorizationService.isAuthenticated();
    }

  ngAfterViewInit() {
}

   active(val) {
      this.activeClass = val;
   }

}