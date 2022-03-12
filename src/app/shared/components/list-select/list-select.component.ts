import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {IShoppingList} from "../../../model/shoppinglist";
import {ListService} from "../../services/list.service";


@Component({
    selector: 'app-list-select',
    templateUrl: './list-select.component.html',
    styleUrls: ['./list-select.component.scss']
})
export class ListSelectComponent implements OnInit, OnDestroy {
    @Output() listSelected: EventEmitter<IShoppingList> = new EventEmitter<IShoppingList>();
    @Output() cancelSelectList: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() currentListId: string;
    @Input() title: string = "Add From List";


    listOfLists: IShoppingList[] = [];
    selectedList: any;

    constructor(private listService: ListService) {

    }

    ngOnInit() {
        this.selectedList = null;
        let promise = this.listService.getAllListsAsPromise();
        promise.then(data => {
            this.listOfLists = data.filter( l => l.list_id != this.currentListId);
        })
    }


    listIsSelected(event) {

        this.listSelected.emit(event);
        this.selectedList = null;

    }

    cancelListInput() {
        this.cancelSelectList.emit(true);
    }

    ngOnDestroy() {

    }


}


