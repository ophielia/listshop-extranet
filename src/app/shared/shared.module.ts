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
import {UserService} from "./services/user.service";
import {TagSelectComponent} from "./components/tag-select/tag-select.component";
import {TagsAsGridComponentComponent} from "./components/tags-as-grid-component/tags-as-grid-component.component";
import {TagsAsListComponentComponent} from "./components/tags-as-list-component/tags-as-list-component.component";
import {SingleTagNodeComponent} from "./components/single-tag-node/single-tag-node.component";
import {SingleTreeNodeComponent} from "./components/single-tree-node/single-tree-node.component";

@NgModule({
    exports: [
        CommonModule,
        HeaderComponent,
        FooterComponent,
        LoaderComponent,
        UserHeaderComponent,
        ListShopHeaderComponent,
        DishSelectComponent,
        ListSelectComponent,
        TagSelectComponent,
        GenerateListComponent,
        ModalComponent,
        AlertComponent,
        SingleDishElementComponent,
        ConfirmDialogComponent,
        TagsAsGridComponentComponent,
        TagsAsListComponentComponent,
        SingleTagNodeComponent,
        SingleTreeNodeComponent
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
        GenerateListComponent,
        TagSelectComponent,
        ListSelectComponent,
        ModalComponent,
        SingleDishElementComponent,
        ConfirmDialogComponent,
        TagsAsGridComponentComponent,
        TagsAsListComponentComponent,
        SingleTagNodeComponent,
        SingleTreeNodeComponent
    ],
    providers: [
        WINDOW_PROVIDERS,
        LandingFixService,
        AuthenticationService,
        ListService,
        DishService,
        TagService,
        MealPlanService,
        UserService,
        ConfirmDialogService

    ]
})
export class SharedModule {
}
