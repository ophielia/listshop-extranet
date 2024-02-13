import {Routes} from '@angular/router';
import {ListsComponent} from "./lists/lists.component";
import {UserComponent} from "./user/user.component";
import {MealPlansComponent} from "./meal-plans/meal-plans.component";
import {HomeComponent} from "./landing/home.component";
import {UserManagementComponent} from "./user-management/user-management.component";
import {TagManagementComponent} from "./tag-management/tag-management.component";

export const rootRouterConfig: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
    },
    {
        path: 'home',
        component: HomeComponent,
        pathMatch: 'prefix',
        loadChildren: () => import('./landing/home.module').then(m => m.HomeModule)
    },
    {
        path: 'user',
        component: UserComponent,
        loadChildren: () => import('./user/user.module').then(m => m.UserModule)
    },
    {
        path: 'manage/users',
        component: UserManagementComponent,
        loadChildren: () => import('./user-management/user-management.module').then(m => m.UserManagementModule)
    },
    {
        path: 'manage/tags',
        component: TagManagementComponent,
        loadChildren: () => import('./tag-management/tag-management.module').then(m => m.TagManagementModule)
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

