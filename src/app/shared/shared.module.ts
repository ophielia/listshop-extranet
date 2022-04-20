import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NgxPageScrollModule} from 'ngx-page-scroll';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
// Services
import {WINDOW_PROVIDERS} from './services/windows.service';
import {LandingFixService} from '../shared/services/landing-fix.service';
import {LoaderComponent} from './loader/loader.component';
import {AuthenticationService} from "./services/authentication.service";
import {ListService} from "./services/list.service";
import {DishService} from "./services/dish.service";
import {DishSelectComponent} from "./components/dish-select/dish-select.component";
import {AutoCompleteModule} from "primeng/autocomplete";
import {FormsModule} from "@angular/forms";
import {TagSelectComponent} from "./components/tag-select/tag-select.component";
import {TagService} from "./services/tag.service";
import {ListSelectComponent} from "./components/list-select/list-select.component";
import {MealPlanService} from "./services/meal-plan.service";
import {GenerateListComponent} from "./components/generate-list/generate-list.component";
import {ModalComponent} from "./components/modal/modal";
import {UserHeaderComponent} from "./components/user-header/user-header.component";
import {ListShopHeaderComponent} from "./components/list-shop-header/list-shop-header.component";
import {SingleDishElementComponent} from "./components/single-dish-element/single-dish-element.component";
import {AlertComponent} from "./alert/alert.component";
import {ConfirmDialogService} from "./services/confirm-dialog.service";
import {ConfirmDialogComponent} from "./components/confirm-dialog/confirm-dialog.component";

@NgModule({
    exports: [
        CommonModule,
        HeaderComponent,
        FooterComponent,
        LoaderComponent,
        UserHeaderComponent,
        ListShopHeaderComponent,
        DishSelectComponent,
        TagSelectComponent,
        ListSelectComponent,
        GenerateListComponent,
        ModalComponent,
        AlertComponent,
        SingleDishElementComponent,
        ConfirmDialogComponent

    ],
    imports: [
        CommonModule,
        RouterModule,
        NgxPageScrollModule,
        NgbModule,
        AutoCompleteModule,
        FormsModule
    ],
    declarations: [
        HeaderComponent,
        FooterComponent,
        LoaderComponent,
        AlertComponent,
        UserHeaderComponent,
        ListShopHeaderComponent,
        DishSelectComponent,
        TagSelectComponent,
        GenerateListComponent,
        ListSelectComponent,
        ModalComponent,
        SingleDishElementComponent,
        ConfirmDialogComponent
    ],
    providers: [
        WINDOW_PROVIDERS,
        LandingFixService,
        AuthenticationService,
        ListService,
        DishService,
        TagService,
        MealPlanService,
        ConfirmDialogService

    ]
})
export class SharedModule {
}
