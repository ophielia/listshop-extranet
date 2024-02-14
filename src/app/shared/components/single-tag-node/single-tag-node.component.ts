import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subscription} from "rxjs";
import {NGXLogger} from "ngx-logger";
import {ITag} from "../../../model/tag";
import {TagTreeService} from "../../services/tag-tree.service";

@Component({
    selector: 'app-single-tag-node',
    templateUrl: './single-tag-node.component.html',
    styleUrls: ['./single-tag-node.component.scss']
})
export class SingleTagNodeComponent implements OnInit {
    unsubscribe: Subscription[] = [];
    @Input() tag: ITag;
    @Input() userId: string;
    @Input() canExpand: boolean = true;
    @Output() select: EventEmitter<ITag> = new EventEmitter<ITag>();

    constructor(private logger: NGXLogger,
                private tagTreeService: TagTreeService) {
    }

    ngOnInit(): void {
    }

    ngOnDestroy() {
        this.unsubscribe.forEach(s => s.unsubscribe());

    }

    toggleExpanded() {
        let newExpanded = !this.tag.is_expanded;
        this.tagTreeService.setTagExpansion(this.tag.tag_id, newExpanded);
    }

    selectTag(tag: ITag) {
        this.select.emit(tag);
    }
}
