import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardHandler} from "../shared/handlers/auth-guard-handler";
import {TagOverviewComponent} from "./tag-overview/tag-overview.component";
import {TagReviewComponent} from "./tag-review/tag-review.component";
import {TagListComponent} from "./tag-list/tag-list.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'overview'
  },
  {
    path: 'overview',
    component: TagOverviewComponent,
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
    path: 'list',
    component: TagListComponent,
    data: {
      title: 'The List Shop - Admin Console | Tag List',
      content: 'The List Shop - Admin Console | Tag List'
    },
    canActivate: [AuthGuardHandler]
  },
  {
    path: 'grid',
    component: TagListComponent,
    data: {
      title: 'The List Shop - Admin Console | Tag Grid',
      content: 'The List Shop - Admin Console | Tag Grid'
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
