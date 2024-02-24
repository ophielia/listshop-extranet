import {Component, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {ITag} from "../../model/tag";
import {NGXLogger} from "ngx-logger";
import {ActivatedRoute} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {TagService} from "../../shared/services/tag.service";
import {TagSearchCriteria} from "../../model/tag-search-criteria";

@Component({
    selector: 'app-tag-review',
    templateUrl: './tag-review.component.html',
    styleUrls: ['./tag-review.component.scss']
})
export class TagReviewComponent implements OnInit {
    unsubscribe: Subscription[] = [];

    tagList: ITag[] = []
    selectedTags: ITag[] = []
    public userId: string = null;
    sortDirection: number = -1
    currentSortBy: string = "created";


    constructor(private logger: NGXLogger,
                private route: ActivatedRoute,
                private title: Title,
                private tagService: TagService) {
    }

    ngOnDestroy() {
        this.unsubscribe.forEach(s => s.unsubscribe());
    }

    ngOnInit(): void {
        this.title.setTitle(this.route.snapshot.data['title']);

        this.getTags()
    }

    private getTags() {
        let searchCriteria = new TagSearchCriteria();
        searchCriteria.user_id = this.userId;
        const promise = this.tagService.getTagListForCriteria(searchCriteria);
        console.log(promise);
        promise.then((data) => {
            this.logger.debug("tag data retrieved.");
            this.tagList = data;
            this.sortTagList();
        }).catch((error) => {
            console.log("Promise rejected with " + JSON.stringify(error));
        });
    }

    private sortTagList() {
        if (this.currentSortBy == 'created') {
            this.sortByCreated(this.tagList);
        } else if (this.currentSortBy == 'name') {
            this.sortByTagName(this.tagList);
        }

    }

    private sortByTagName(tagList: ITag[]) {
        tagList.sort((a, b) => {
            return a.name.localeCompare(b.name) * this.sortDirection;
        });
    }


    private sortByCreated(tagList: ITag[]) {
        tagList.sort((a, b) => {
            let aNum = parseInt(a.tag_id, 10);
            let bNum = parseInt(b.tag_id, 10);

            if (aNum < bNum) return -1 * this.sortDirection;
            else if (aNum > bNum) return 1 * this.sortDirection;
            else return 0;
        });
    }


    changeSorting(sortType: string) {
        let sortTypeChanged = sortType != this.currentSortBy;
        this.currentSortBy = sortType;
        if (!sortTypeChanged) {
            this.sortDirection = this.sortDirection * -1;
        }
        this.sortTagList();
    }

    selectTag(result: ITag) {
        this.selectedTags.push(result);
    }

    deSelectTag(result: ITag) {
        this.selectedTags = this.selectedTags.filter(t => t.tag_id != result.tag_id);
    }


    markAsReviewed() {
        let tagIds = this.selectedTags.map(t => t.tag_id);
        this.tagService.markTagsAsReviewed(tagIds).subscribe(r => {
            this.getTags();
            this.selectedTags = [];
        });
    }


    createStandard() {
        let tagIds = this.selectedTags.map(t => t.tag_id);
        this.tagService.createStandardFromUserTags(tagIds).subscribe(r => {
            this.getTags();
            this.selectedTags = [];
        });
    }
}