import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DishesRoutingModule} from './dishes-routing.module';
import {SharedModule} from "../shared/shared.module";
import {InputSwitchModule} from "primeng/inputswitch";
import {FormsModule} from "@angular/forms";
import {ManageDishesComponent} from "./manage-dishes/manage-dishes.component";
import {DishesComponent} from "./dishes.component";
import {MealplanSelectComponent} from "./mealplan-select/mealplan-select.component";
import {EditDishComponent} from "./edit-dish/edit-dish.component";
import {NgbRatingModule} from "@ng-bootstrap/ng-bootstrap";
import {AddDishComponent} from "./add-dish/add-dish.component";
import {AddDishIngredientComponent} from "./add-dish/add-dish-ingredient.component";


@NgModule({
    declarations: [DishesComponent,
        ManageDishesComponent,
        EditDishComponent,
        AddDishComponent,
        AddDishIngredientComponent,
        MealplanSelectComponent],
    imports: [
        CommonModule,
        DishesRoutingModule,
        SharedModule,
        InputSwitchModule,
        FormsModule,
        NgbRatingModule
    ]
})
export class DishesModule {
}
