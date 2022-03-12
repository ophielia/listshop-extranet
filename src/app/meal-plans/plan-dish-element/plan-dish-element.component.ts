import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LandingFixService} from "../../shared/services/landing-fix.service";
import {ActivatedRoute} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {Dish} from "../../model/dish";

@Component({
    selector: 'app-plan-dish-element',
    templateUrl: './plan-dish-element.component.html',
    styleUrls: ['./plan-dish-element.component.css']
})
export class PlanDishElementComponent implements OnInit {

    @Input() dishId: String
    @Input() dishName: String
    @Input() reference: String

    @Output() doubleTap: EventEmitter<String> = new EventEmitter<String>();



    constructor(
        private fix: LandingFixService,
        private route: ActivatedRoute,
        private title: Title,
    ) {
    }

    ngOnInit() {
        // this.fix.addFixBlogDetails();
        this.title.setTitle(this.route.snapshot.data['title']);
    }

    ngOnDestroy() {
        // this.fix.removeFixBlogDetails();
    }

    doubleTapDish() {
        this.doubleTap.emit(this.dishId);
    }
}
