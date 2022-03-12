import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {IDish} from "../../../model/dish";

@Component({
    selector: 'app-dish-select',
    templateUrl: './dish-select.component.html',
    styleUrls: ['./dish-select.component.scss']
})
export class DishSelectComponent implements OnInit, OnDestroy {
    @Output() dishSelected: EventEmitter<IDish> = new EventEmitter<IDish>();
    @Output() cancelSelectDish: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() showText: string;
    @Input() showCancelButton: boolean = false;
    @Input() dishList: IDish[];


    autoSelectedDish: any;
    filteredDishList: IDish[];


    constructor() {

    }

    ngOnInit() {
        this.autoSelectedDish = null;
    }

    filterDishes(event) {
        console.log("in filter dishes: " + event.query)
        if (event.query) {
            if (this.dishList) {
                let filterBy = event.query.toLocaleLowerCase();
                this.filteredDishList = this.dishList.filter((dish: IDish) =>
                    dish.name != null && dish.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
                console.log("filtered dishes length: " + this.filteredDishList.length)
            }
        } else {
            this.filteredDishList = null;
        }
    }

    bingo(event) {
        console.log("was in bingo");
        console.log("event is: " + event)
        this.dishSelected.emit(event);
        this.autoSelectedDish = null;
        this.filteredDishList = null;
        if (event) {
            event.panelVisible = false;
        }
    }

    cancelDishInput() {
        this.cancelSelectDish.emit(true);
    }

    ngOnDestroy() {

    }

}


