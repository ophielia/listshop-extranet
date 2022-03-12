import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {IMealPlan} from "../../model/mealplan";
import {MealPlanService} from "../../shared/services/meal-plan.service";


@Component({
    selector: 'app-mealplan-select',
    templateUrl: './mealplan-select.component.html',
    styleUrls: ['./mealplan-select.component.scss']
})
export class MealplanSelectComponent implements OnInit, OnDestroy {
    @Output() mealplanSelected: EventEmitter<string> = new EventEmitter<string>();
    @Output() cancelSelectMealplan: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() addToNewMealplan: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() title: string = "Add To Mealplan";
    @Input() showNewOption: boolean = false;


    listOfMealplans: IMealPlan[] = [];
    selectedMealplan: any;

    constructor(private mealplanService: MealPlanService) {

    }

    ngOnInit() {
        this.selectedMealplan = null;
        this.mealplanService.getAllMealplans()
            .subscribe(data => {
            this.listOfMealplans = data;
        })
    }


    mealplanIsSelected(id : string) {
        this.mealplanSelected.emit(id);
    }

    cancelMealplanInput() {
        this.cancelSelectMealplan.emit(true);
    }

    ngOnDestroy() {

    }


    createNewMealplan() {
        this.addToNewMealplan.emit(true);
    }
}


