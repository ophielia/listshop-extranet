import {Routes} from '@angular/router';
import {ListsComponent} from "./lists/lists.component";
import {DishesComponent} from "./dishes/dishes.component";
import {UserComponent} from "./user/user.component";
import {MealPlansComponent} from "./meal-plans/meal-plans.component";
import {HomeComponent} from "./landing/home.component";

export const rootRouterConfig: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
    },
    {
        path: 'home',
        component: HomeComponent,
        loadChildren: () => import('./landing/home.module').then(m => m.HomeModule)
    },
    {
        path: 'user',
        component: UserComponent,
        loadChildren: () => import('./user/user.module').then(m => m.UserModule)
    },
    {
        path: 'dishes',
        component: DishesComponent,
        loadChildren: () => import('./dishes/dishes.module').then(m => m.DishesModule)
    },
    {
        path: 'lists',
        component: ListsComponent,
        pathMatch: 'prefix',
        loadChildren: () => import('./lists/lists.module').then(m => m.ListsModule)
    },

    {
        path: 'mealplans',
        component: MealPlansComponent,
        loadChildren: () => import('./meal-plans/meal-plans.module').then(m => m.MealPlansModule)
    },

];

