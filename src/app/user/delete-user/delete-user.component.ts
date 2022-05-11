import {Component, OnInit} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from "../../shared/services/authentication.service";
import {FormBuilder, FormGroup} from '@angular/forms';
import {Subscription} from "rxjs";
import {ErrorType} from "../../model/error-type";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
    selector: 'app-delete-user',
    templateUrl: './delete-user.component.html',
    styleUrls: ['./delete-user.component.scss']
})
export class DeleteUserComponent implements OnInit {


    private unsubscribe: Subscription[] = [];
    show: boolean;
    signUpForm: FormGroup;

    passwordErrors: ErrorType[] = [];
    emailErrors: ErrorType[] = [];


    private returnUrl: string;
    isLoggedIn: boolean = false;

    constructor(private route: ActivatedRoute,
                private title: Title,
                private meta: Meta,
                private router: Router,
                private fb: FormBuilder,
                private spinner: NgxSpinnerService,
                private authorizationService: AuthenticationService) {
        // initialize variable value
        this.show = false;
    }

    ngOnInit() {
        this.spinner.hide();
        this.title.setTitle(this.route.snapshot.data['title']);
        this.meta.updateTag({name: 'description', content: this.route.snapshot.data['content']});
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/lists/manage';

        this.isLoggedIn = this.authorizationService.isAuthenticated();
        console.log("is logged in: " + this.isLoggedIn);
    }

    ngOnDestroy() {
        //this.fix.removeFixBlog();
        this.unsubscribe.forEach(s => s.unsubscribe())
    }


    errorsContain(emailErrors: ErrorType[], searchType: string) {
        return emailErrors.filter(t => t.valueOf() == searchType).length > 0;
    }

    deleteUser() {
        this.spinner.show();
        let $sub = this.authorizationService.deleteUser()
            .subscribe(success => {
                this.router.navigate(["/home"]);
            });
        this.unsubscribe.push($sub);

    }


}
