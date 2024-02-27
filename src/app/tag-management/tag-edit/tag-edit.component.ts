import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {NGXLogger} from "ngx-logger";
import {ActivatedRoute} from "@angular/router";
import {TagService} from "../../shared/services/tag.service";
import {ITag} from "../../model/tag";
import {ITagFullInfo, TagFullInfo} from "../../model/tag-fullinfo";
import {TagSearchCriteria} from "../../model/tag-search-criteria";
import TagType from "../../model/tag-type";
import {TagTreeTag} from "../../model/tag-tree-tag";

@Component({
    selector: 'app-tag-edit',
    templateUrl: './tag-edit.component.html',
    styleUrls: ['./tag-edit.component.scss']
})
export class TagEditComponent implements OnInit, OnDestroy {
    unsubscribe: Subscription[] = [];
    tagId: string;
    tag: ITagFullInfo = new TagFullInfo();

    showChangeParent: boolean;
    showChangeTagName: boolean;
    assignTag: ITag;
    selectGroupCriteria: TagSearchCriteria;
    tagTypes: TagType[] = [TagType.Ingredient]
    tagNameEntry: string;
    foodNameEntry: string;

    constructor(private logger: NGXLogger,
                private route: ActivatedRoute,
                private tagService: TagService
    ) {
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.tagId = params['id'];
            this.logger.debug("tag id is" + this.tagId);
            this.refreshTag()
        });
        this.selectGroupCriteria = new TagSearchCriteria();
        this.selectGroupCriteria.group_include = 'ONLY';
        this.selectGroupCriteria.tag_types = TagType.listAll();

    }

    ngOnDestroy() {
        this.unsubscribe.forEach(s => s.unsubscribe());
    }

    nullOrValue(value: string) {
        if (value) {
            return value;
        }
        return "--";
    }

    nullOrBooleanValue(value: boolean) {
        if (!value) {
            return false;
        }
        return value;
    }

    toggleShowChangeParent() {
        this.showChangeParent = !this.showChangeParent;
        this.assignTag = null;
    }

    toggleShowChangeName() {
        this.showChangeTagName = !this.showChangeTagName;
        this.assignTag = null;
    }

    createStandard() {
        let tagIds = [this.tagId]
        this.tagService.createStandardFromUserTags(tagIds).subscribe(r => {
            this.refreshTag();
        });
    }

    setToSolid() {
        let tagIds = [this.tagId];
        this.tagService.markSelectedAsLiquidOrSolid(tagIds, false).subscribe(r => {
            this.refreshTag();
        });
    }

    setToLiquid() {
        let tagIds = [this.tagId];
        this.tagService.markSelectedAsLiquidOrSolid(tagIds, true).subscribe(r => {
            this.refreshTag();
        });
    }

    setToVerified() {
        let tagIds = [this.tagId];
        this.tagService.markTagsAsReviewed(tagIds).subscribe(r => {
            this.refreshTag();
        });
    }

    private refreshTag() {
        let promise = this.tagService.getFullTagInfo(this.tagId);
        promise.then(data => {
            this.tag = data;
        });
    }

    selectTagForAssign(tag: ITag) {
        this.assignTag = tag;
    }

    assignToParent() {
        let tagIds = [this.tagId];
        this.tagService.assignTagsToParent(tagIds, this.assignTag.tag_id).subscribe(r => {
            this.refreshTag();
            this.showChangeParent = false;
            this.assignTag = null;
        });
    }

    changeTagName() {
        let tagToUpdate = new TagTreeTag();
        tagToUpdate.tag_id = this.tagId;
        tagToUpdate.is_group = this.tag.is_group;
        tagToUpdate.tag_type = this.tag.tag_type;
        let $sub = this.tagService.changeTagName(this.tagNameEntry, tagToUpdate)
            .subscribe(data => {
                this.refreshTag();
                this.assignTag = null;
                this.tagNameEntry = "";
                this.showChangeTagName = false;
            });
        this.unsubscribe.push($sub);
    }

    hasAssignedFood() {
        return this.tag.food_id != null;
    }
}
