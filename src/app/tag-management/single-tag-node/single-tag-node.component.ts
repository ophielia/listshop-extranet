import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subscription} from "rxjs";
import {ITag} from "../../model/tag";
import {NGXLogger} from "ngx-logger";
import {TagTreeService} from "../../shared/services/tag-tree.service";
import {ContentType, GroupType} from "../../shared/services/tag-tree.object";

@Component({
    selector: 'app-single-tag-node',
    templateUrl: './single-tag-node.component.html',
    styleUrls: ['./single-tag-node.component.css']
})
export class SingleTagNodeComponent implements OnInit {
    unsubscribe: Subscription[] = [];
    @Input() tag: ITag;
    @Input() userId: string;
    @Output() select: EventEmitter<ITag> = new EventEmitter<ITag>();
    tagGroups: ITag[];
    tagChildren: ITag[];

    constructor(private logger: NGXLogger,
                private tagTreeService: TagTreeService) {
    }

    ngOnInit(): void {
        this.refreshGrid();
    }

    ngOnDestroy() {
        this.unsubscribe.forEach(s => s.unsubscribe());

    }

    toggleExpanded() {
        let newExpanded = !this.tag.is_expanded;
        this.tagTreeService.setTagExpansion(this.tag.tag_id, newExpanded);
        this.refreshGrid();
    }

    private refreshGrid() {
        let $sub = this.tagTreeService.allContentList(this.userId, this.tag.tag_id,
            ContentType.Direct, false, GroupType.GroupsOnly, [this.tag.tag_type])
            .subscribe(data => {
                this.logger.debug("in subscribe in tag-select. data: " + data.length)
                this.tagGroups = data;
            });
        this.unsubscribe.push($sub);
        let $sub2 = this.tagTreeService.allContentList(this.userId, this.tag.tag_id,
            ContentType.Direct, false, GroupType.ExcludeGroups, [this.tag.tag_type])
            .subscribe(data => {
                this.logger.debug("in subscribe in tag-select. data: " + data.length)
                this.tagChildren = data;
            });
        this.unsubscribe.push($sub2);
    }

    selectTag(tag: ITag) {
        this.select.emit(tag);
    }
}
