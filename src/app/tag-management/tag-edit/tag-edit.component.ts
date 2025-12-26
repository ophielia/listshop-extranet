import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {ActivatedRoute, Router} from '@angular/router';
import {TagService} from '../../shared/services/tag.service';
import {ITag} from '../../model/tag';
import {ITagFullInfo, TagFullInfo} from '../../model/tag-fullinfo';
import {TagSearchCriteria} from '../../model/tag-search-criteria';
import TagType from '../../model/tag-type';
import {TagTreeTag} from '../../model/tag-tree-tag';
import {IFood} from '../../model/food';
import TagOperationType from '../../model/tag-operation-type';
import {ILayoutCategory} from '../../model/layout-category';

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
    showChangeLayout: boolean;
    assignTag: ITag;
    assignCategory: ILayoutCategory;
    tagTypes: TagType[] = [TagType.Ingredient]
    selectGroupCriteria: TagSearchCriteria;
    tagNameEntry: string;
    foodSuggestions: IFood[];
    selectedTags: any;
    foodToAssign: IFood;
    private isEditFood: boolean = false;

    constructor(private logger: NGXLogger,
                private route: ActivatedRoute,
                private router: Router,
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

    goToCopyTag() {
        let id = this.tag.tag_id;
        this.router.navigate(['/manage/tags/copy', id]);
    }

    toggleShowChangeParent() {
        this.showChangeParent = !this.showChangeParent;
        this.assignTag = null;
    }

    toggleShowChangeName() {
        this.showChangeTagName = !this.showChangeTagName;
        this.assignTag = null;
    }

    toggleShowChangeLayout() {
        this.showChangeLayout = !this.showChangeLayout;
        this.assignTag = null;
    }

    createStandard() {
        let tagIds = [this.tagId]
        this.tagService.createStandardFromUserTags(tagIds).subscribe(r => {
            this.refreshTag();
        });
    }

    shouldShowChangeLayout() {
        return !this.showChangeLayout && !this.tag.user_id;
    }

    shouldShowCreateStandard() {
        return this.tag.user_id;
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
        this.tagService.updateTagStatus(tagIds, TagOperationType.MarkAsReviewed).subscribe(r => {
            this.refreshTag();
        });
    }

    setToVerifiedNoFood() {
        let tagIds = [this.tagId];
        this.tagService.updateTagStatus(tagIds, TagOperationType.MarkAsReviewed).subscribe(r => {
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

    selectCategoryForAssign(tag: ILayoutCategory) {
        window.alert('Well, I\'ll be....');
        this.assignCategory = tag;
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
        return this.tag.conversion_id != null;
    }

    doFoodSearch(searchTerm: string) {
        let promise = this.tagService.getFoodSuggestionsForTag(this.tag, searchTerm);
        promise.then(data => {
            this.foodSuggestions = data;
        });
        console.log("ready to search " + searchTerm);
    }

    unSelectTag(tagid: any) {
        this.selectedTags = this.selectedTags.filter(t => t.tag_id != tagid);
    }


    selectFoodAssignment(food: IFood) {
        this.foodToAssign = food;
    }

    showFoodSearch() {
        return this.foodToAssign == null && (this.isEditFood || !this.hasAssignedFood());
    }

    showAssignedFood() {
        return !this.isEditFood && this.hasAssignedFood();
    }

    doAssignFoodToTag() {
        let promise = this.tagService.assignFoodToTag(this.foodToAssign, this.tagId);
        promise.then(data => {
            this.refreshTag();
            this.foodToAssign = null;
            this.isEditFood = false;
        });
    }

    clearFood() {
        this.foodToAssign = null;
        this.isEditFood = false;
        this.foodSuggestions = [];
    }

    editFood() {
        this.isEditFood = true;
    }
}

