import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LandingFixService} from "../../../shared/services/landing-fix.service";
import {ActivatedRoute} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {Dish, IDish} from "../../../model/dish";

@Component({
    selector: 'app-single-dish-element',
    templateUrl: './single-dish-element.component.html',
    styleUrls: ['./single-dish-element.component.scss']
})
export class SingleDishElementComponent implements OnInit {

    @Input() dish: IDish;
    @Input() fullDisplay: boolean;
    @Input() showViewLink: boolean = true;
    @Input() selectLabel: String = "select";
    @Output() edit: EventEmitter<String> = new EventEmitter<String>();
    @Output() select: EventEmitter<Dish> = new EventEmitter<Dish>();

    constructor(
        private fix: LandingFixService,
        private route: ActivatedRoute,
        private title: Title,
    ) {
        console.log("hi!");
    }

    ngOnInit() {
        // this.fix.addFixBlogDetails();
        this.title.setTitle(this.route.snapshot.data['title']);
    }

    ngOnDestroy() {
        // this.fix.removeFixBlogDetails();
    }

    editDish() {
        this.edit.emit(this.dish.dish_id);
    }

    selectADish() {
        this.select.emit(this.dish);
    }

    selectDishFromLink() {
        this.select.emit(this.dish);
    }

    hasReference() {
        return this.dish.reference && this.dish.reference.length > 0;
    }

    hasDescription() {
        return this.dish.description && this.dish.description.length > 0;
    }
}
