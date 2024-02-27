import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subscription} from "rxjs";
import {TagSearchCriteria} from "../../model/tag-search-criteria";
import {Dish} from "../../model/dish";
import {NGXLogger} from "ngx-logger";
import {TagService} from "../../shared/services/tag.service";
import TagType from "../../model/tag-type";
import {IFoodCategory} from "../../model/food-category";

@Component({
  selector: 'app-category-select',
  templateUrl: './category-select.component.html',
  styleUrls: ['./category-select.component.scss']
})
export class CategorySelectComponent implements OnInit {
  unsubscribe: Subscription[] = [];
  @Output() categorySelected: EventEmitter<IFoodCategory> = new EventEmitter<IFoodCategory>();
  @Output() cancelAddTag: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() tagCriteria: TagSearchCriteria;

  @Input() showCancelButton: boolean = false;
  @Input() allowAdd: boolean = false;
  @Input() placeholderText: string;

  tagList: IFoodCategory[];

  autoSelectedTag: any;
  filteredTags: IFoodCategory[];

  name: string;
  loaded: boolean = false;

  dish: Dish = <Dish>{dish_id: "", name: "", description: ""};
  currentSelect: string;
  showAddTags: boolean;

  allTagTypes: string[];


  constructor(private logger: NGXLogger,
              private tagService: TagService) {
    this.allTagTypes = TagType.listAll();
  }

  ngOnInit() {
    this.autoSelectedTag = null;
    this.showAddTags = false;

    const promise = this.tagService.getFoodCategories();
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
        this.filteredTags = this.tagList.filter((foodCategory: IFoodCategory) =>
            foodCategory.food_category_name.toLocaleLowerCase().indexOf(filterBy) !== -1);
      }
    } else {
      this.filteredTags = null;
    }
  }

  bingo(event) {
    this.categorySelected.emit(event);
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


  ngOnDestroy() {
    this.unsubscribe.forEach(s => s.unsubscribe());

  }


}
