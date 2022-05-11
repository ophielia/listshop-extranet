import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TagManagementRoutingModule} from './tag-management-routing.module';
import {TagManagementComponent} from './tag-management.component';
import {TagOverviewComponent} from './tag-overview/tag-overview.component';
import {SharedModule} from "../shared/shared.module";
import {TagReviewComponent} from './tag-review/tag-review.component';
import {RouterModule} from "@angular/router";
import {TagHeaderComponent} from "./tag-header/tag-header.component";
import {TagListComponent} from './tag-list/tag-list.component';
import {TagGridComponent} from './tag-grid/tag-grid.component';
import {FormsModule} from "@angular/forms";
import {SingleTagNodeComponent} from './single-tag-node/single-tag-node.component';


@NgModule({
    declarations: [TagManagementComponent,
        TagOverviewComponent,
        TagReviewComponent, TagHeaderComponent, TagListComponent, TagGridComponent, SingleTagNodeComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule,
        TagManagementRoutingModule,
        FormsModule
    ]
})
export class TagManagementModule {
}
