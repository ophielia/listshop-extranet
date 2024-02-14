import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ITag} from "../../../model/tag";
import {Dish} from "../../../model/dish";
import TagType from "../../../model/tag-type";
import {Subscription} from "rxjs";
import {TagService} from "../../services/tag.service";
import {TagTreeService} from "../../services/tag-tree.service";
import {NGXLogger} from "ngx-logger";
import {TagSearchCriteria} from "../../../model/tag-search-criteria";


@Component({
    selector: 'app-tag-select',
    templateUrl: './tag-select.component.html',
    styleUrls: ['./tag-select.component.scss']
})
export class TagSelectComponent implements OnInit, OnDestroy {
    unsubscribe: Subscription[] = [];
    @Output() tagSelected: EventEmitter<ITag> = new EventEmitter<ITag>();
    @Output() cancelAddTag: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() tagCriteria: TagSearchCriteria;

    @Input() showCancelButton: boolean = false;
    @Input() allowAdd: boolean = false;
    @Input() placeholderText: string;

    tagList: ITag[];

    autoSelectedTag: any;
    filteredTags: ITag[];

    name: string;
    loaded: boolean = false;

    dish: Dish = <Dish>{dish_id: "", name: "", description: ""};
    currentSelect: string;
    showAddTags: boolean;

    allTagTypes: string[];


    constructor(private logger: NGXLogger,
                private tagService: TagService,
                private tagTreeService: TagTreeService) {
        this.allTagTypes = TagType.listAll();
    }

    ngOnInit() {
        this.autoSelectedTag = null;
        this.showAddTags = false;

        const promise = this.tagService.getTagListForCriteria(this.tagCriteria);
        promise.then((data) => {
            this.logger.debug("tag group data retrieved");
            this.tagList = data;
            this.loaded = true;
        }).catch((error) => {
            console.log("Promise rejected with " + JSON.stringify(error));
        });
    }

    filterTags(event) {
        this.logger.debug('query:' + event.query);
        if (event.query && this.loaded) {
            if (this.tagList) {
                let filterBy = event.query.toLocaleLowerCase();
                this.filteredTags = this.tagList.filter((tag: ITag) =>
                    tag.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
                this.showAddTags = this.filteredTags.length == 0 && this.allowAdd;
            }
        } else {
            this.filteredTags = null;
            this.showAddTags = false;
        }
    }

    bingo(event) {
        this.tagSelected.emit(event);
        this.autoSelectedTag = null;
        this.filteredTags = null;
        if (event) {
            event.panelVisible = false;
        }
    }

    cancelAdd() {
        this.showAddTags = false;
        this.autoSelectedTag = null;
        this.filteredTags = null;
    }

    checkSearchEnter(el) {
        // when the user clicks on return from the search box
        // if only one tag is in the list, select this tag
        if (this.filteredTags && this.filteredTags.length == 1) {
            this.bingo(this.filteredTags[0]);
            if (el) {
                el.panelVisible = false;
            }
        }
    }

    isIncluded(tagtype: string) {
        if (!this.allowAdd) {
            return false;
        }
        return this.tagCriteria.tag_types.indexOf(tagtype) >= 0;

    }

    cancelSelectTag() {
        this.cancelAddTag.emit(true);
    }


    add(tagtype: string) {
        var $sub = this.tagService.addTag(this.autoSelectedTag, tagtype)
            .subscribe(r => {
                this.autoSelectedTag = null;
                var headers = r.headers;
                var location = headers.get("Location");
                var splitlocation = location.split("/");
                var id = splitlocation[splitlocation.length - 1];
                let promise = this.tagService.getById(id);
                promise.then(data => {
                    this.showAddTags = false;
                    this.autoSelectedTag = null;
                    this.tagSelected.emit(data);
                })
            });
        this.unsubscribe.push($sub);
    }

    ngOnDestroy() {
        this.unsubscribe.forEach(s => s.unsubscribe());

    }

}


