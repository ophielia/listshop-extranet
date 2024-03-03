import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardHandler} from "../shared/handlers/auth-guard-handler";
import {TagReviewComponent} from "./tag-review/tag-review.component";
import {TagToolComponent} from "./tag-tool/tag-tool.component";
import {TagEditComponent} from "./tag-edit/tag-edit.component";
import {CategoryReviewComponent} from "./category-review/category-review.component";
import {TagCopyComponent} from "./tag-copy/tag-copy.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'overview'
  },
  {
    path: 'overview',
    component: TagToolComponent,
    data: {
      title: 'The List Shop - Admin Console | Tag Overview',
      content: 'The List Shop - Admin Console | Tag Overview'
    },
    canActivate: [AuthGuardHandler]
  },
  {
    path: 'review',
    component: TagReviewComponent,
    data: {
      title: 'The List Shop - Admin Console | Tag Review',
      content: 'The List Shop - Admin Console | Tag Review'
    },
    canActivate: [AuthGuardHandler]
  },
    {
        path: 'tool',
        component: TagToolComponent,
        data: {
            title: 'The List Shop - Admin Console | Tag List',
            content: 'The List Shop - Admin Console | Tag List'
        },
        canActivate: [AuthGuardHandler]
    },
    {
        path: 'category/review',
        component: CategoryReviewComponent,
        data: {
            title: 'The List Shop - Admin Console | Tag List',
            content: 'The List Shop - Admin Console | Tag List'
        },
        canActivate: [AuthGuardHandler]
    },
    {
        path: 'copy/:id',
        component: TagCopyComponent,
        data: {
            title: 'The List Shop - Admin Console | Tag List',
            content: 'The List Shop - Admin Console | Tag List'
        },
        canActivate: [AuthGuardHandler]
    },
    {
        path: 'edit/:id',
        component: TagEditComponent,
        data: {
            title: 'The List Shop - Admin Console | Tag List',
            content: 'The List Shop - Admin Console | Tag List'
        },
        canActivate: [AuthGuardHandler]
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TagManagementRoutingModule {
}
