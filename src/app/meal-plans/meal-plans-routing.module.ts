import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardHandler} from "../shared/handlers/auth-guard-handler";
import {ManageMealPlansComponent} from "./manage-mealplans/manage-meal-plans.component";
import {EditPlanComponent} from "./edit-plan/edit-plan.component";
import {AddDishToPlanComponent} from "./add-dish-to-plan/add-dish-to-plan.component";


const routes: Routes = [
     {
        path: 'list',
         component: ManageMealPlansComponent,
         data: {
             title: 'The List Shop | My Meal Plans',
             content: 'The List Shop | My Meal Plans'
         },
         canActivate: [AuthGuardHandler]
    },
   {
        path: 'edit/:id',
        component: EditPlanComponent,
        data: {
            title: 'The List Shop | Edit Meal Plan',
            content: 'The List Shop | Edit Meal Plan'
        }
    },
    {
        path: 'edit/:id/dish',
        component: AddDishToPlanComponent,
        data: {
            title: 'The List Shop | Add Dish to Meal Plan',
            content: 'The List Shop | Add Dish to Meal Plan'
        }
    },
    {
        path: '',
        component: ManageMealPlansComponent,
        data: {
            title: 'The List Shop | My Meal Plans',
            content: 'The List Shop | My Meal Plans'
        },
        canActivate: [AuthGuardHandler]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MealPlansRoutingModule {
}
