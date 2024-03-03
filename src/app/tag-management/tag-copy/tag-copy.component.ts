import {Component, OnInit} from '@angular/core';
import {TagSearchCriteria} from "../../model/tag-search-criteria";
import TagType from "../../model/tag-type";
import {NGXLogger} from "ngx-logger";
import {ActivatedRoute, Router} from "@angular/router";
import {TagService} from "../../shared/services/tag.service";
import {Subscription} from "rxjs";
import {ITagFullInfo, TagFullInfo} from "../../model/tag-fullinfo";
import {ITag} from "../../model/tag";

@Component({
    selector: 'app-tag-copy',
    templateUrl: './tag-copy.component.html',
    styleUrls: ['./tag-copy.component.scss']
})
export class TagCopyComponent implements OnInit {
    unsubscribe: Subscription[] = [];
    tagId: string;
    tag: ITagFullInfo = new TagFullInfo();

    selectedTags: ITag[] = [];
    tagSearchCriteria: TagSearchCriteria;
    tagList: ITag[];

    constructor(private logger: NGXLogger,
                private route: ActivatedRoute,
                private router: Router,
                private tagService: TagService) {
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.tagId = params['id'];
            this.logger.debug("tag id is" + this.tagId);
            this.refreshTag()
        });
        this.tagSearchCriteria = new TagSearchCriteria();
        this.tagSearchCriteria.tag_types = [TagType.Ingredient];
        this.tagSearchCriteria.group_include = 'EXCLUDE';

    }

    private refreshTag() {
        let promise = this.tagService.getFullTagInfo(this.tagId);
        promise.then(data => {
            this.tag = data;
        });
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

    copyTag(tag: ITag) {
        let id = tag.tag_id;
        this.router.navigate(['/manage/tags/copy', id]);
    }

    unSelectTag(tagId: string) {
        this.selectedTags = this.selectedTags.filter(t => t.tag_id != tagId);
    }

    doTagSearch(searchTerm: string) {
        console.log("tag search criteria - " + this.tagSearchCriteria);
        this.tagSearchCriteria.text_fragment = searchTerm;
        const promise = this.tagService.getTagListForCriteria(this.tagSearchCriteria);
        promise.then((data) => {
            this.logger.debug("tag data retrieved making list");
            this.tagList = data;
        }).catch((error) => {
            console.log("Promise rejected with " + JSON.stringify(error));
        });
    }

    goToEditTag() {
        let id = this.tag.tag_id;
        this.router.navigate(['/manage/tags/edit', id]);
    }

    selectTag(result: ITag) {
        if (this.selectedTags.includes(result)) {
            return;
        }
        this.selectedTags.push(result);
    }

    copyLiquidForSelected() {
        let tagIds = this.selectedTags.map(t => t.tag_id);
        this.tagService.markSelectedAsLiquidOrSolid(tagIds, this.tag.is_liquid).subscribe(r => {

        });
    }

    copyFoodForSelected() {
        if (!this.tag.food_id) {
            return;
        }
        if (!this.selectedTags || this.selectedTags.length == 0) {
            return;
        }
        let tagIds = this.selectedTags.map(t => t.tag_id);
        this.tagService.assignFoodToTags(tagIds, this.tag.food_id).subscribe(r => {

        });


    }
}
