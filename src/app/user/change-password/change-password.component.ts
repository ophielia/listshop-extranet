import {Component, OnInit} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from "../../shared/services/authentication.service";
import {FormBuilder, FormGroup} from '@angular/forms';
import {Subscription} from "rxjs";
import {ErrorType} from "../../model/error-type";
import PasswordValidator from "../../shared/validators/password-validator";

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {


    private unsubscribe: Subscription[] = [];
    show: boolean;
    signUpForm: FormGroup;

    passwordErrors: ErrorType[] = [];
    emailErrors: ErrorType[] = [];


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
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/lists/manage';
        this.signUpForm = this.fb.group({
            newPassword: [""],
            originalPassword: [""],
            confirmPassword: [""]
        });
    }

    ngOnDestroy() {
        //this.fix.removeFixBlog();
        this.unsubscribe.forEach(s => s.unsubscribe())
    }

    get originalPassword() {
        return this.signUpForm.get('originalPassword');
    }

    get newPassword() {
        return this.signUpForm.get('newPassword');
    }

    get confirmPassword() {
        return this.signUpForm.get('confirmPassword');
    }

    changePassword() {
        this.passwordErrors = [];

        this.emailErrors = PasswordValidator.isValid(this.originalPassword.value);
        if (this.emailErrors.length > 0) {
            return;
        }

        this.passwordErrors = PasswordValidator.isValidAndVerified(this.newPassword.value, this.confirmPassword.value);
        if (this.passwordErrors.length > 0) {
            return;
        }

        // we're validated, and ready to go!
        this.authenticationService.changePassword(this.originalPassword.value.trim(),
            this.newPassword.value.trim())
            .subscribe(success => {
                this.router.navigateByUrl('/lists/manage');
            }, error => {
                if (error.status == '401') {
                    this.emailErrors.push(ErrorType.passwordIsBad);
                } else {
                    this.emailErrors.push(ErrorType.generalError);
                }
            });
    }

    errorsContain(emailErrors: ErrorType[], searchType: string) {
        return emailErrors.filter(t => t.valueOf() == searchType).length > 0;
    }

}
