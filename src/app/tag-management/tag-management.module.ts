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
import {TagEditComponent} from './tag-edit/tag-edit.component';
import {CategoryReviewComponent} from './category-review/category-review.component';
import {AutoCompleteModule} from "primeng/autocomplete";
import {CategorySelectComponent} from './category-select/category-select.component';
import {SearchTermSelectComponent} from './search-term-select/search-term-select.component';
import {TagCopyComponent} from './tag-copy/tag-copy.component';
import {TagSearchContext} from "./tag-search-context/tag-search-context";


@NgModule({
    declarations: [TagManagementComponent,
        TagReviewComponent, TagHeaderComponent, TagToolComponent, TagStatusSelectComponent, TagEditComponent, CategoryReviewComponent, CategorySelectComponent, SearchTermSelectComponent, TagCopyComponent],
    exports: [],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule,
        TagManagementRoutingModule,
        FormsModule,
        InputSwitchModule,
        AutoCompleteModule
    ],
    providers: [
        TagSearchContext
    ]
})
export class TagManagementModule {
}
