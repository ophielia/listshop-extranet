import {Component, OnInit} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {AuthenticationService} from "../../shared/services/authentication.service";
import {Subscription} from "rxjs";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ErrorType} from "../../model/error-type";
import EmailValidator from "../../shared/validators/email-validator";
import PasswordValidator from "../../shared/validators/password-validator";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


    private unsubscribe: Subscription[] = [];
    show: boolean;
    signInForm: FormGroup;

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
        this.title.setTitle(this.route.snapshot.data['title']);
        this.meta.updateTag({name: 'description', content: this.route.snapshot.data['content']});
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/lists/manage';
        this.signInForm = this.fb.group({
            email: [""],
            userPassword: [""]
        });

    }

    ngOnDestroy() {
        //this.fix.removeFixBlog();
        this.unsubscribe.forEach(s => s.unsubscribe())
    }

    get email() {
        return this.signInForm.get('email');
    }

    get userPassword() {
        return this.signInForm.get('userPassword');
    }

    // click event function toggle
    showPassword() {
        this.show = !this.show;
    }


    doLogin() {
        this.emailErrors = [];
        this.passwordErrors = [];

        this.emailErrors = EmailValidator.isValid(this.email.value)
        if (this.emailErrors.length > 0) {
            return;
        }
        this.passwordErrors = PasswordValidator.isValid(this.userPassword.value);
        if (this.passwordErrors.length > 0) {
            return;
        }

        let $sub = this.authenticationService.login(this.signInForm.get('email').value.trim(),
            this.signInForm.get('userPassword').value.trim())
            .subscribe(success => {
                if (!success) {
                    throw Error("BADCREDENTIALS");
                }
                console.log(this.returnUrl);
                this.router.navigateByUrl(this.returnUrl);
            });
        this.unsubscribe.push($sub);
    }

    errorsContain(emailErrors: ErrorType[], searchType: string) {
        return emailErrors.filter(t => t.valueOf() == searchType).length > 0;
    }

    goToForgotPassword() {
        let eml = this.email;
        var navigationExtras: NavigationExtras = {
            state: {
                email: ''
            }
        };
        navigationExtras.state.email = this.email.value;

        this.router.navigate(['/user/reset'], navigationExtras);

    }

}
