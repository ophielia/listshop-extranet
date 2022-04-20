import {Component, OnInit} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {AuthenticationService} from "../../shared/services/authentication.service";
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TokenType} from "../../model/token-request";


@Component({
    selector: 'app-token-gateway',
    templateUrl: './token-gateway.component.html',
    styleUrls: ['./token-gateway.component.scss']
})
export class TokenGatewayComponent implements OnInit {


    show: boolean;

    private returnUrl: string;

    constructor(private route: ActivatedRoute,
                private title: Title,
                private meta: Meta,
                private router: Router,
                private fb: FormBuilder,
                private authenticationService: AuthenticationService) {
        // initialize variable value
        this.show = false;
    }

    ngOnInit() {
        this.title.setTitle(this.route.snapshot.data['title']);
        this.meta.updateTag({name: 'description', content: this.route.snapshot.data['content']});
        this.route.params.subscribe(params => {
            let type = params['type'];
            let token = params['token'];

            var navigationExtras: NavigationExtras = {
                state: {
                    token: ''
                }
            };
            console.log("type: " + TokenType.PasswordReset.valueOf());
            console.log("type: " + (type == TokenType.PasswordReset.valueOf()));
            navigationExtras.state.token = token;
            if (type == TokenType.PasswordReset.valueOf()) {
                this.router.navigate(['/user/password/token'], navigationExtras);
            }
        });
    }

}
