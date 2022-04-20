import {Component, OnInit} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from "../../shared/services/authentication.service";
import {FormBuilder, FormGroup} from '@angular/forms';
import {Subscription} from "rxjs";
import {ErrorType} from "../../model/error-type";
import EmailValidator from "../../shared/validators/email-validator";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

    private unsubscribe: Subscription[] = [];
    show: boolean;
    signUpForm: FormGroup;
    passedEmail: string;
    emailErrors: ErrorType[] = [];

    private returnUrl: string;
    generalError: boolean = false;

    constructor(private route: ActivatedRoute,
                private title: Title,
                private meta: Meta,
                private router: Router,
                private fb: FormBuilder,
                private spinner: NgxSpinnerService,
                private authenticationService: AuthenticationService) {
        // initialize variable value
        this.show = false;
        this.spinner.hide();
        var extraNavigation = this.router.getCurrentNavigation().extras;
        if (extraNavigation.state && extraNavigation.state.email) {
            this.passedEmail = extraNavigation.state.email;
        }
    }

    ngOnInit() {
        this.title.setTitle(this.route.snapshot.data['title']);

        this.meta.updateTag({name: 'description', content: this.route.snapshot.data['content']});
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/lists/manage';
        this.signUpForm = this.fb.group({
            email: [this.passedEmail]
        });
    }

    get email() {
        return this.signUpForm.get('email');
    }

    requestReset() {
        this.emailErrors = [];

        this.emailErrors = EmailValidator.isValid(this.email.value);
        if (this.emailErrors.length > 0) {
            return;
        }
        this.spinner.show();
        // request reset
        this.authenticationService.requestPasswordReset(this.signUpForm.get('email').value.trim())
            .subscribe(success => {
                    this.spinner.hide();
                    this.router.navigate(['/user/resetconfirm']);
                },
                err => {
                    this.spinner.hide();
                    if (err.status == 400) {
                        this.emailErrors.push(ErrorType.EmailNotFound);
                    } else {
                        this.generalError = true;
                    }
                });
    }

    errorsContain(emailErrors: ErrorType[], searchType: string) {
        return emailErrors.filter(t => t.valueOf() == searchType).length > 0;
    }

}
