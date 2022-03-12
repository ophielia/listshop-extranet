import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';


@Component({
    selector: 'app-generate-list',
    templateUrl: './generate-list.component.html',
    styleUrls: ['./generate-list.component.scss']
})
export class GenerateListComponent implements OnInit, OnDestroy {
    @Output() optionsSelected: EventEmitter<Map<string, boolean>> = new EventEmitter<Map<string, boolean>>();
    @Output() cancelGenerateList: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() title: string = "Add From List";


    saveAsMealPlan: boolean;
    addStarterToList: boolean = true;
    static includeStarter: string = "includeStarter";
    static createMealPlan: string = "createMealPlan";

    constructor() {
    }

    ngOnInit() {
    }


    sendProperties() {
        const properties = new Map<string, boolean>();
        properties.set(GenerateListComponent.includeStarter, this.addStarterToList);
        properties.set(GenerateListComponent.createMealPlan, this.saveAsMealPlan);
        this.optionsSelected.emit(properties);

    }

    cancelInput() {
        this.cancelGenerateList.emit(true);
    }

    ngOnDestroy() {

    }


}


