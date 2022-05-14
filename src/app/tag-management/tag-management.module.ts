import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TagManagementRoutingModule} from './tag-management-routing.module';
import {TagManagementComponent} from './tag-management.component';
import {SharedModule} from "../shared/shared.module";
import {TagReviewComponent} from './tag-review/tag-review.component';
import {RouterModule} from "@angular/router";
import {TagHeaderComponent} from "./tag-header/tag-header.component";
import {TagListComponent} from './tag-list/tag-list.component';
import {TagGridComponent} from './tag-grid/tag-grid.component';
import {FormsModule} from "@angular/forms";
import {SingleTagNodeComponent} from './single-tag-node/single-tag-node.component';
import {InputSwitchModule} from "primeng/inputswitch";


@NgModule({
    declarations: [TagManagementComponent,
        TagReviewComponent, TagHeaderComponent, TagListComponent, TagGridComponent, SingleTagNodeComponent],
    exports: [
        SingleTagNodeComponent
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
