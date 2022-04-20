import {ErrorHandler, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {BrowserModule} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from './shared/shared.module';
import {UserModule} from './user/user.module';
import {rootRouterConfig} from './app.routes';
import {AppComponent} from './app.component';
import {UserComponent} from "./user/user.component";
import {ListsModule} from "./lists/lists.module";
import {ListShopTokenInterceptor} from "./shared/handlers/list-shop-token-interceptor";
import {ListShopErrorHandler} from "./shared/handlers/list-shop-error-handler";
import {AlertComponent} from "./shared/alert/alert.component";
import {AuthGuardHandler} from "./shared/handlers/auth-guard-handler";
import {LoggerModule, NgxLoggerLevel} from 'ngx-logger';
import {AlertService} from "./shared/services/alert.service";
import {NgxSpinnerModule} from "ngx-spinner";


@NgModule({
    declarations: [
        AppComponent,
        UserComponent
    ],
    imports: [
        BrowserModule.withServerTransition({appId: 'serverApp'}),
        ReactiveFormsModule,
        HttpClientModule,
        NgxSpinnerModule,
        LoggerModule.forRoot({
            //serverLoggingUrl: '/api/logs',
            level: NgxLoggerLevel.TRACE,
            serverLogLevel: NgxLoggerLevel.ERROR,
            disableConsoleLogging: false
        }),
        BrowserAnimationsModule,
        SharedModule,
        UserModule,
        ListsModule,
        // tslint:disable-next-line: max-line-length
        RouterModule.forRoot(rootRouterConfig, {
            useHash: false,
            anchorScrolling: 'enabled',
            scrollPositionRestoration: 'enabled',
            enableTracing: false,
            initialNavigation: 'enabled'
        })
    ],
    providers: [
        AlertService,
        {provide: HTTP_INTERCEPTORS, useClass: ListShopTokenInterceptor, multi: true},
        {provide: ErrorHandler, useClass: ListShopErrorHandler},
        AuthGuardHandler
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
