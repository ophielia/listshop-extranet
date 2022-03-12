import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListsRoutingModule } from './lists-routing.module';
import { ManageListsComponent } from './manage-lists/manage-lists.component';
import {ListsComponent} from "./lists.component";
import {SharedModule} from "../shared/shared.module";
import {SingleListElementComponent} from "./single-list-element/single-list-element.component";
import { EditListComponent } from './edit-list/edit-list.component';
import {InputSwitchModule} from "primeng/inputswitch";
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [ManageListsComponent,
      SingleListElementComponent,
  ListsComponent,
  EditListComponent],
    imports: [
        CommonModule,
        ListsRoutingModule,
        SharedModule,
        InputSwitchModule,
        FormsModule
    ]
})
export class ListsModule { }
