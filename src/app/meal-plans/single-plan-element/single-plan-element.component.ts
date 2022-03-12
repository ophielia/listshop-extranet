import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LandingFixService} from "../../shared/services/landing-fix.service";
import {ActivatedRoute} from "@angular/router";
import {Title} from "@angular/platform-browser";

@Component({
    selector: 'app-single-plan-element',
    templateUrl: './single-plan-element.component.html',
    styleUrls: ['./single-plan-element.component.css']
})
export class SinglePlanElementComponent implements OnInit {

    @Input() planName: string = "List";
    @Input() planId: string;
    @Output() delete: EventEmitter<String> = new EventEmitter<String>();
    @Output() edit: EventEmitter<String> = new EventEmitter<String>();

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

    deletePlan() {
        this.delete.emit(this.planId);
    }

    editPlan() {
        this.edit.emit(this.planId);
    }
}
