import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LandingFixService} from "../../shared/services/landing-fix.service";
import {ActivatedRoute} from "@angular/router";
import {Title} from "@angular/platform-browser";

@Component({
    selector: 'app-single-list-element',
    templateUrl: './single-list-element.component.html',
    styleUrls: ['./single-list-element.component.css']
})
export class SingleListElementComponent implements OnInit {

    @Input() listName: string = "List";
    @Input() itemCount: number;
    @Input() listIsStarter: boolean;
    @Input() listId: string;
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

    deleteList() {
        this.delete.emit(this.listId);
    }

    editList() {
        this.edit.emit(this.listId);
    }
}
