import {Component, OnInit} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from "../../shared/services/authentication.service";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import PasswordValidator from "../../shared/validators/password-validator";
import {ErrorType} from "../../model/error-type";

@Component({
    selector: 'app-password-token',
    templateUrl: './password-token.component.html',
    styleUrls: ['./password-token.component.scss']
})
export class PasswordTokenComponent implements OnInit {


    show: boolean;
    signUpForm: FormGroup;
    token: string;
    passwordErrors: ErrorType[] = [];


    private returnUrl: string;
    generalError: boolean = false;

    constructor(private route: ActivatedRoute,
                private title: Title,
                private meta: Meta,
                private router: Router,
                private fb: FormBuilder,
                private authenticationService: AuthenticationService) {
        // initialize variable value
        this.show = false;
        var extraNavigation = this.router.getCurrentNavigation().extras;
        if (extraNavigation.state && extraNavigation.state.token) {
            this.token = extraNavigation.state.token;
        }
    }

    ngOnInit() {
        this.title.setTitle(this.route.snapshot.data['title']);
        this.meta.updateTag({name: 'description', content: this.route.snapshot.data['content']});
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/lists/manage';
        this.signUpForm = this.fb.group({
            userPassword: ["", [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
            confirmPassword: ["", [Validators.required]]
        }, {updateOn: 'blur', validators: this.validatePasswordConfirmation});
    }

    // click event function toggle
    password() {
        this.show = !this.show;
    }

    get userPassword() {
        return this.signUpForm.get('userPassword');
    }

    get confirmPassword() {
        return this.signUpForm.get('confirmPassword');
    }


    resetPassword() {
        this.passwordErrors = PasswordValidator.isValidAndVerified(this.userPassword.value, this.confirmPassword.value);
        if (this.passwordErrors.length > 0) {
            return;
        }

        if (!this.token) {
            this.generalError = true;
        }

        // create user
        this.authenticationService.resetPasswordWithToken(this.token, this.signUpForm.get('userPassword').value.trim())
            .subscribe(success => {
                    this.router.navigate(['/user/login']);
                },
                err => {
                    this.generalError = true;

                });
    }

    validatePasswordConfirmation(group: FormGroup): any {
        var pw = group.controls['userPassword'];
        var pw2 = group.controls['confirmPassword'];

        if (pw.value !== pw2.value) { // this is the trick
            pw2.setErrors({passwordsDontMatch: true});
        }

        // even though there was an error, we still return null
        // since the new error state was set on the individual field
        return null;
    }

    errorsContain(emailErrors: ErrorType[], searchType: string) {
        return emailErrors.filter(t => t.valueOf() == searchType).length > 0;
    }

}
