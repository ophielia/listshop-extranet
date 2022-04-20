import {Component, OnInit} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-reset-confirm',
    templateUrl: './reset-confirm.component.html',
    styleUrls: ['./reset-confirm.component.scss']
})
export class ResetConfirmComponent implements OnInit {

    email: string = "support@the-list-shop.com";

    private returnUrl: string;

    constructor(private route: ActivatedRoute,
                private title: Title,
                private meta: Meta,
                private router: Router) {
    }

    ngOnInit() {
        this.title.setTitle(this.route.snapshot.data['title']);
        this.meta.updateTag({name: 'description', content: this.route.snapshot.data['content']});
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/lists/manage';
    }


}
