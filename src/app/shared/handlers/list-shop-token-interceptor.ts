import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {AuthenticationService} from "../services/authentication.service";
import {Observable} from "rxjs";

@Injectable()
export class ListShopTokenInterceptor implements HttpInterceptor {
    constructor(public authenticationService: AuthenticationService) {
    }


    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        var token = this.authenticationService.getToken();

        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${this.authenticationService.getToken()}`,
                    'Content-Type': 'application/json'
                }
            });
            return next.handle(request);
        } else {
            request = request.clone({
                setHeaders: {
                    'Content-Type': 'application/json'
                }
            });
            return next.handle(request);
        }
    }
}
