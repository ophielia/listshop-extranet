import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardHandler} from "../shared/handlers/auth-guard-handler";
import {TagOverviewComponent} from "./tag-overview/tag-overview.component";
import {TagReviewComponent} from "./tag-review/tag-review.component";

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TagManagementRoutingModule {
}
