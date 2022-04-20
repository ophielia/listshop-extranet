import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardHandler} from "../shared/handlers/auth-guard-handler";
import {SearchComponent} from "./search/search.component";
import {EditUserComponent} from "./edit-user/edit-user.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'search'
  },
  {
    path: 'search',
    component: SearchComponent,
    data: {
      title: 'The List Shop - Admin Console | User Search',
      content: 'The List Shop - Admin Console | User Search'
    },
    canActivate: [AuthGuardHandler]
  },
  {
    path: 'edit/:id',
    component: EditUserComponent,
    data: {
      title: 'The List Shop - Admin Console | User Edit',
      content: 'The List Shop - Admin Console | User Edit'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule {
}
