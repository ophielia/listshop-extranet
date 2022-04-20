import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MealPlansRoutingModule} from './meal-plans-routing.module';
import {SharedModule} from "../shared/shared.module";
import {InputSwitchModule} from "primeng/inputswitch";
import {FormsModule} from "@angular/forms";
import {NgbRatingModule} from "@ng-bootstrap/ng-bootstrap";
import {MealPlansComponent} from "./meal-plans.component";
import {ManageMealPlansComponent} from "./manage-mealplans/manage-meal-plans.component";
import {SinglePlanElementComponent} from "./single-plan-element/single-plan-element.component";
import {EditPlanComponent} from "./edit-plan/edit-plan.component";
import {PlanDishElementComponent} from "./plan-dish-element/plan-dish-element.component";
import {AddDishToPlanComponent} from "./add-dish-to-plan/add-dish-to-plan.component";
import {PlanContext} from "./plan-context/plan-context";


@NgModule({
    declarations: [MealPlansComponent,
        ManageMealPlansComponent,
        SinglePlanElementComponent,
        EditPlanComponent,
        PlanDishElementComponent,
        AddDishToPlanComponent
        ],
    imports: [
        CommonModule,
        MealPlansRoutingModule,
        SharedModule,
        InputSwitchModule,
        FormsModule,
        NgbRatingModule
    ],
    providers: [
        PlanContext
    ]
})
export class MealPlansModule {
}
