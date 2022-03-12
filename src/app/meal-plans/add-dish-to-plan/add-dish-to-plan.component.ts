import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Meta, Title} from "@angular/platform-browser";
import {ActivatedRoute, Router} from "@angular/router";
import {LandingFixService} from "../../shared/services/landing-fix.service";
import {ListService} from "../../shared/services/list.service";
import {IShoppingList, ShoppingList} from "../../model/shoppinglist";
import {Subscription} from "rxjs";
import {LegendService} from "../../shared/services/legend.service";
import {LegendPoint} from "../../model/legend-point";
import {Category, ICategory} from "../../model/category";
import {IItem, Item} from "../../model/item";
import {ITag, Tag} from "../../model/tag";
import {NGXLogger} from "ngx-logger";
import {Dish, IDish} from "../../model/dish";
import {DishService} from "../../shared/services/dish.service";
import {MealPlanService} from "../../shared/services/meal-plan.service";
import {IMealPlan, MealPlan} from "../../model/mealplan";
import {SortKey} from "../../model/sort-key";
import {DishSort} from "../../model/dish-sort";
import {SortDirection} from "../../model/sort-direction";
import {GroupType} from "../../shared/services/tag-tree.object";
import {GenerateListComponent} from "../../shared/components/generate-list/generate-list.component";

@Component({
    selector: 'app-add-dish-to-plan',
    templateUrl: './add-dish-to-plan.component.html',
    styleUrls: ['./add-dish-to-plan.component.scss']
})
export class AddDishToPlanComponent implements OnInit, OnDestroy {

    unsubscribe: Subscription[] = [];
    searchValue: string;
    lastSearchLength: number = 0;

    filteredDishes: Dish[];
    allDishes: Dish[];

    filterTags: ITag[];

    showAddTag: boolean = false;
    showAddToList: boolean = false;
    showAddToMealplan: boolean = false;

    sortOptions: SortKey[] = DishSort.getKeys();
    sortKey: SortKey = SortKey.LastUsed;
    sortDirection: SortDirection = SortDirection.Up;

    hasSelected: boolean = false;
    selectedDishes: Dish[] = [];

    groupType: GroupType = GroupType.All;

    private errorMessage: string;
    isSingleClick: Boolean = true;
    showOrderBy: boolean = false;
    showAddToNewList: boolean;
    isLoading: boolean = true;

    displayId: string ;
    mealPlan: MealPlan;
    planDishes: Dish[];
    initialLoad: boolean = true;


    constructor(
        private fix: LandingFixService,
        private route: ActivatedRoute,
        private router: Router,
        private title: Title,
        private meta: Meta,
        private dishService: DishService,
        private mealPlanService: MealPlanService,
        private listService: ListService,
        private logger: NGXLogger
    ) {
    }

    ngOnInit() {
        this.title.setTitle(this.route.snapshot.data['title']);
        this.route.params.subscribe(params => {
            let id = params['id'];
            this.logger.debug('getting list with id: ', id);
            this.getMealPlan(id);
        });
        this.getAllDishes();
    }

    ngOnDestroy() {
        this.unsubscribe.forEach(s => s.unsubscribe());
    }

    getMealPlan(id: string) {
        let $sub = this.mealPlanService
            .getMealPlan(id)
            .subscribe(p => {
                this.mealPlan = p;
                this.planDishes = [];
                this.mealPlan.slots.forEach( s => this.planDishes.push(s.dish));
                this.hasSelected = this.planDishes.length > 0;

            });
        this.unsubscribe.push($sub);
    }

    addDishToMealPlan(dish: any) {
        this.initialLoad = false;
        let $sub = this.mealPlanService.addDishToMealPlan(dish.dish_id, this.mealPlan.meal_plan_id)
            .subscribe(() => {
                this.getMealPlan(this.mealPlan.meal_plan_id);
            });
        this.unsubscribe.push($sub);
    }

    removeFromMealPlan(dishId: string) {
        this.initialLoad = false;
        let $sub = this.mealPlanService.removeDishFromMealPlan(dishId, this.mealPlan.meal_plan_id)
            .subscribe(() => {
                this.getMealPlan(this.mealPlan.meal_plan_id);
            });
        this.unsubscribe.push($sub);

    }

    filterByDishname() {
        this.initialLoad = false;
        console.log("filter by dishname" + this.searchValue);

        if (this.searchValue.length == 0) {
            this.filteredDishes = this.allDishes;
        } else if (this.filteredDishes && this.lastSearchLength < this.searchValue.length) {
            let filterBy = this.searchValue.toLocaleLowerCase();
            this.filteredDishes = this.filteredDishes.filter((dish: Dish) =>
                dish.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
        } else {
            let filterBy = this.searchValue.toLocaleLowerCase();
            this.filteredDishes = this.allDishes.filter((dish: Dish) =>
                dish.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
        }
        this.lastSearchLength = this.searchValue.length;
    }

    clearSearchValue() {
        this.searchValue = "";
        this.resetFilter();
    }

    resetFilter() {
        this.filteredDishes = this.allDishes;
    }

    getAllDishes() {
        if (!this.filterTags || this.filterTags.length == 0) {
            this.dishService
                .getAllDishes()
                .subscribe(p => {
                        this.sortDishes(p);
                        this.allDishes = p;
                        this.isLoading = false;
                        this.resetFilter();
                    },
                    e => this.errorMessage = e);
        } else {
            var includeTagList = this.filterTags.filter(t => t.is_inverted == false).map(t => t.tag_id);
            var excludeTagList = this.filterTags.filter(t => t.is_inverted == true).map(t => t.tag_id);
            let $sub = this.dishService
                .findByTags(includeTagList, excludeTagList)
                .subscribe(p => {
                        this.sortDishes(p);
                        this.allDishes = p;
                        this.isLoading = false;
                        this.filteredDishes = p;
                    },
                    e => this.errorMessage = e);
            this.unsubscribe.push($sub);
        }
    }

    sortDishes(dishList: Dish[]) {
        if (this.sortKey == SortKey.Name) {
            this.sortByDishName(dishList);
        } else if (this.sortKey == SortKey.LastUsed) {
            this.sortByLastUsed(dishList)
        } else if (this.sortKey == SortKey.CreatedOn) {
            this.sortByCreated(dishList);
        }

    }

    private sortByDishName(dishList: Dish[]) {
        dishList.sort((a, b) => {
            return a.name.localeCompare(b.name) * this.sortDirection;
        });
    }

    private sortByCreated(dishList: Dish[]) {
        dishList.sort((a, b) => {
            let aNum = parseInt(a.dish_id, 10);
            let bNum = parseInt(b.dish_id, 10);

            if (aNum < bNum) return -1 * this.sortDirection;
            else if (aNum > bNum) return 1 * this.sortDirection;
            else return 0;
        });
    }

    private sortByLastUsed(dishList: Dish[]) {
        dishList.sort((a, b) => {
            let aDate = !a.last_added ? new Date('1970-10-01') : new Date(a.last_added);
            let bDate = !b.last_added ? new Date('1970-10-01') : new Date(b.last_added);
            if (aDate < bDate) return -1 * this.sortDirection;
            else if (aDate > bDate) return 1 * this.sortDirection;
            else return 0;
        });
    }

    addTagToFilter(tag: ITag) {
        this.initialLoad = false;
        tag.is_inverted = false;
        if (!this.filterTags) {
            this.filterTags = [];
        }

        this.filterTags.push(tag);

        this.getAllDishes();
    }

    removeTagFromFilter(tag: ITag) {
        this.initialLoad = false;
        this.isSingleClick = false;
        this.filterTags = this.filterTags.filter(t => t.tag_id != tag.tag_id);
        this.getAllDishes();
    }

    toggleInvert(tag: ITag) {

        this.isSingleClick = true;
        setTimeout(() => {
            if (this.isSingleClick) {
                for (var i: number = 0; i < this.filterTags.length; i++) {
                    if (this.filterTags[i].tag_id == tag.tag_id) {
                        this.filterTags[i].is_inverted = !this.filterTags[i].is_inverted;
                    }
                }
                this.getAllDishes();
            }
        }, 250)
    }

    toggleShowOrderBy() {
        this.showOrderBy = !this.showOrderBy;
    }

    changeSortDirection() {
        if (this.sortDirection == SortDirection.Up) {
            this.sortDirection = SortDirection.Down;
        } else {
            this.sortDirection = SortDirection.Up;
        }
        this.changeSort();
    }

    changeSort() {
        this.sortDishes(this.allDishes);
        if (this.filteredDishes.length == this.allDishes.length) {
            this.filteredDishes = this.allDishes
        } else {
            this.sortDishes(this.filteredDishes);
        }
    }

    isSortUp() {
        return this.sortDirection == SortDirection.Up;
    }



    toggleAddTag() {
        this.showAddTag = !this.showAddTag;

        this.showAddToNewList = false;
        this.showAddToList = false;
        this.showAddToMealplan = false;

    }

    backToMealPlanEdit() {
        var url = "mealplans/edit/" +  this.mealPlan.meal_plan_id;
        this.router.navigateByUrl(url);
    }
}
