import {Component, OnInit} from '@angular/core';
import {NGXLogger} from "ngx-logger";
import {ActivatedRoute} from "@angular/router";
import {TagService} from "../../shared/services/tag.service";
import {ICategoryMapping} from "../../model/category-mapping";
import IncludeType from "../../model/include-type";

@Component({
    selector: 'app-category-review',
    templateUrl: './category-review.component.html',
    styleUrls: ['./category-review.component.scss']
})
export class CategoryReviewComponent implements OnInit {
    currentMappingList: ICategoryMapping[];
    allMappingList: ICategoryMapping[];
    private includeAssigned: IncludeType = IncludeType.Ignore
    private sortBy;
    private sortByListshop = "LS";
    private sortByFood = "FOOD";
    private selectedMappings: ICategoryMapping[] = [];

    constructor(private logger: NGXLogger,
                private route: ActivatedRoute,
                private tagService: TagService) {
    }

    ngOnInit(): void {
        this.refreshMappings()
        this.sortBy = this.sortByListshop;
    }

    private refreshMappings() {
        const promise = this.tagService.getFoodCategoryMappings();
        promise.then((data) => {
            this.logger.debug("tag data retrieved making list");
            this.allMappingList = data;
            this.filterList();
            this.sortMappingList();
        }).catch((error) => {
            console.log("Promise rejected with " + JSON.stringify(error));
        });
    }

    nameOrDashes(name: string) {
        return name;
    }

    isSortByListshop() {
        return this.sortBy == this.sortByListshop;
    }

    toggleSortBy() {
        if (this.isSortByListshop()) {
            this.sortBy = this.sortByFood;
        } else {
            this.sortBy = this.sortByListshop;
        }
        this.sortMappingList()
    }

    doIncludeAssigned() {
        return this.includeAssigned == IncludeType.Include;
    }

    doUnassignedOnly() {
        return this.includeAssigned == IncludeType.Exclude
    }

    toggleAssigned() {
        if (this.doIncludeAssigned()) {
            this.includeAssigned = IncludeType.Ignore
        } else {
            this.includeAssigned = IncludeType.Include;
        }
        this.filterList()
    }

    toggleUnassigned() {
        if (this.doUnassignedOnly()) {
            this.includeAssigned = IncludeType.Ignore
        } else {
            this.includeAssigned = IncludeType.Exclude;
        }

        this.filterList();
    }

    private sortMappingList() {
        if (this.isSortByListshop()) {
            this.currentMappingList.sort((a, b) => {
                return a.tag_name.localeCompare(b.tag_name);
            });
        } else {
            this.currentMappingList.sort((a, b) => {
                return a.food_category_name.localeCompare(b.food_category_name);
            });
        }

    }

    private filterList() {
        if (this.includeAssigned == IncludeType.Include) {
            // filter - only assigned
            this.currentMappingList = this.allMappingList.filter(m => m.food_category_id != "0");
        } else if (this.includeAssigned == IncludeType.Exclude) {
            // filter - only unassigned
            this.currentMappingList = this.allMappingList.filter(m => m.food_category_id == "0");
        } else {
            // no filter
            this.currentMappingList = this.allMappingList;
        }
    }

    unselectMapping(tagid: string) {
        this.selectedMappings = this.selectedMappings.filter(t => t.tag_id != tagid);
    }

    selectMapping(mapping: ICategoryMapping) {
        if (this.selectedMappings.filter(m => m.tag_id == mapping.tag_id).length == 0) {
            this.selectedMappings.push(mapping);
        }
    }

}
