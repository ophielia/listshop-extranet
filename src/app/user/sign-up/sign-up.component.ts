import {Component, OnInit} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from "../../shared/services/authentication.service";
import {FormBuilder, FormGroup} from '@angular/forms';
import {Subscription} from "rxjs";
import EmailValidator from "../../shared/validators/email-validator";
import {ErrorType} from "../../model/error-type";
import PasswordValidator from "../../shared/validators/password-validator";

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

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
            email: [""],
            userPassword: [""],
            confirmPassword: [""]
        });
    }

    ngOnDestroy() {
        //this.fix.removeFixBlog();
        this.unsubscribe.forEach(s => s.unsubscribe())
    }

    get email() {
        return this.signUpForm.get('email');
    }

    get userPassword() {
        return this.signUpForm.get('userPassword');
    }

    get confirmPassword() {
        return this.signUpForm.get('confirmPassword');
    }

    signUp() {
        this.emailErrors = [];
        this.passwordErrors = [];

        this.emailErrors = EmailValidator.isValid(this.email.value);
        if (this.emailErrors.length > 0) {
            return;
        }
        this.passwordErrors = PasswordValidator.isValidAndVerified(this.userPassword.value, this.confirmPassword.value);
        if (this.passwordErrors.length > 0) {
            return;
        }

        // we're validated, and ready to go!
        this.authenticationService.createUserAndList(this.signUpForm.get('email').value.trim(),
            this.signUpForm.get('userPassword').value.trim())
            .subscribe(success => {
                if (!success) {
                    var error: Error = Error("BADCREDENTIALS");
                    throw error;
                }
                this.router.navigateByUrl(this.returnUrl);
            });
    }

    validateEmailNotTaken() {
        this.emailErrors = [];
        let $sub = this.authenticationService.nameIsTaken(this.email.value)
            .subscribe(p => {
                if (p) {
                    this.emailErrors.push(ErrorType.emailTaken);
                }
            });
        this.unsubscribe.push($sub);
    }

    errorsContain(emailErrors: ErrorType[], searchType: string) {
        return emailErrors.filter(t => t.valueOf() == searchType).length > 0;
    }
}
