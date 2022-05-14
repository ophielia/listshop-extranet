import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UserManagementRoutingModule} from './user-management-routing.module';
import {SearchComponent} from './search/search.component';
import {UserManagementComponent} from './user-management.component';
import {SharedModule} from "../shared/shared.module";
import {EditUserComponent} from './edit-user/edit-user.component';
import {FormsModule} from "@angular/forms";
import {TagManagementModule} from "../tag-management/tag-management.module";


@NgModule({
    declarations: [SearchComponent,
        UserManagementComponent,
        EditUserComponent],
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        UserManagementRoutingModule,
        TagManagementModule
    ]
})
export class UserManagementModule {
}
