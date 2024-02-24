import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TagManagementRoutingModule} from './tag-management-routing.module';
import {TagManagementComponent} from './tag-management.component';
import {SharedModule} from "../shared/shared.module";
import {TagReviewComponent} from './tag-review/tag-review.component';
import {RouterModule} from "@angular/router";
import {TagHeaderComponent} from "./tag-header/tag-header.component";
import {FormsModule} from "@angular/forms";
import {InputSwitchModule} from "primeng/inputswitch";
import {TagToolComponent} from './tag-tool/tag-tool.component';
import {TagStatusSelectComponent} from './tag-status-select/tag-status-select.component';


@NgModule({
    declarations: [TagManagementComponent,
        TagReviewComponent, TagHeaderComponent, TagToolComponent, TagStatusSelectComponent],
    exports: [
    ],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule,
        TagManagementRoutingModule,
        FormsModule,
        InputSwitchModule
    ]
})
export class TagManagementModule {
}
