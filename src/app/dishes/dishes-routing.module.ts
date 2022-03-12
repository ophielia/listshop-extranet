import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardHandler} from "../shared/handlers/auth-guard-handler";
import {ManageDishesComponent} from "./manage-dishes/manage-dishes.component";
import {EditDishComponent} from "./edit-dish/edit-dish.component";
import {AddDishComponent} from "./add-dish/add-dish.component";
import {AddDishIngredientComponent} from "./add-dish/add-dish-ingredient.component";


const routes: Routes = [
    {
        path: 'manage',
        component: ManageDishesComponent,
        data: {
            title: 'The List Shop | My Dishes',
            content: 'The List Shop | My Dishes'
        },
        canActivate: [AuthGuardHandler]
    },
    {
        path: 'edit/:id',
        component: EditDishComponent,
        data: {
            title: 'The List Shop | Edit Dish',
            content: 'The List Shop | Edit Dish'
        }
    },
    {
        path: 'add',
        component: AddDishComponent,
        data: {
            title: 'The List Shop | Add Dish',
            content: 'The List Shop | Edit Dish'
        }
    },
    {
        path: 'add/ingredients/:id',
        component: AddDishIngredientComponent,
        data: {
            title: 'The List Shop | Add Dish',
            content: 'The List Shop | Edit Dish'
        }
    },
    {
        path: '',
        component: ManageDishesComponent,
        data: {
            title: 'The List Shop | My Dishes',
            content: 'The List Shop | My Dishes'
        },
        canActivate: [AuthGuardHandler]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DishesRoutingModule {
}
