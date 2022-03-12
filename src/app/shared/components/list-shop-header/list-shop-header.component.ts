import {Component, Inject, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentication.service";
import {WINDOW} from "../../services/windows.service";

@Component({
    selector: 'app-list-shop-header',
    templateUrl: './list-shop-header.component.html',
    styleUrls: ['./list-shop-header.component.scss']
})
export class ListShopHeaderComponent implements OnInit {

    public isOpenMobile = false;

    constructor(private router: Router,
                @Inject(WINDOW) private window,
                private authenticationService: AuthenticationService) {
    }

    ngOnInit(): void {
    }

    logout(): void {
        this.authenticationService.logout().subscribe(t => {
                this.router.navigateByUrl('home');
            },
            error => {
                this.router.navigateByUrl('home');
            });
    }
}
