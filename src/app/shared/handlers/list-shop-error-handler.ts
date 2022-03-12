import {ErrorHandler, Injectable, Injector} from "@angular/core";
import {HttpErrorResponse} from "@angular/common/http";
import {AlertService} from "../services/alert.service";

@Injectable()
export class ListShopErrorHandler implements ErrorHandler {
    private notificationService: AlertService;

    constructor(injector: Injector) {
        setTimeout(() => this.notificationService = injector.get(AlertService));
    }

    handleError(error: Response | HttpErrorResponse) {
        console.log(error);

        if (error instanceof HttpErrorResponse) {
            // Server or connection error happened
            if (!navigator.onLine) {
                // Handle offline error
                return this.notificationService.error('No Internet Connection');
            } else if (error.status == 0) {
                console.error('Server error!!: No server - ', `${error.error.status} - ${error.error.message}`);
                return this.notificationService.error("Looks like the site is temporarily down.  Please try again later.");
            } else if (error.status == 401) {
                console.error('Server error!!: 401 unauthorized - ', `${error.error.status} - ${error.error.message}`);
                return this.notificationService.error("That combination didn't work.  Please try again.");
            } else if (error.status == 406) {
                console.error('Server error!: 406 unauthorized - ', `${error.error.status} - ${error.error.message}`);
                // indicates that no error occurred, but the action was nonetheless not taken
                // no notification for the front end
            } else {
                // Handle Http Error (error.status === 403, 404...)
                var errorObject: Object = `${error.error}`;
                if (errorObject) {
                    console.error('Server error!!: ', `${error.error.status} - ${error.error.message}`);

                } else {
                    console.error('Server error!!: ', `${error.status} + ${error.message}`);

                }
                return this.notificationService.error("Oh no - something has gone wrong - desperately wrong....");
            }
        } else if (error instanceof Error) {
            if (error.message && error.message == 'BADCREDENTIALS') {
                return this.notificationService.error("That combination didn't work.  Please try again.");
            }
        }
        // Log the error anyway
        console.error('It happens: ', error);
    }
}
