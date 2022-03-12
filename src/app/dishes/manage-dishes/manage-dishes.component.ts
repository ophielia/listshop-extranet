import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {LandingFixService} from "../../shared/services/landing-fix.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Meta, Title} from "@angular/platform-browser";
import {Subscription} from "rxjs";
import {IShoppingList} from "../../model/shoppinglist";
import {Dish} from "../../model/dish";
import {DishService} from "../../shared/services/dish.service";
import {ITag} from "../../model/tag";
import {DishSort} from "../../model/dish-sort";
import {SortDirection} from "../../model/sort-direction";
import {SortKey} from "../../model/sort-key";
import {NGXLogger} from "ngx-logger";
import {GroupType} from "../../shared/services/tag-tree.object";
import {GenerateListComponent} from "../../shared/components/generate-list/generate-list.component";
import {ListService} from "../../shared/services/list.service";
import {MealPlanService} from "../../shared/services/meal-plan.service";


@Component({
    selector: 'app-manage-dishes',
    templateUrl: './manage-dishes.component.html',
    styleUrls: ['./manage-dishes.component.scss']
})
export class ManageDishesComponent implements OnInit, OnDestroy {
    @ViewChild('dishesaddedtolist') addToListModal;
    @ViewChild('dishesaddedtomealplan') addToMealPlanModal;
    @ViewChild('addtagstodishesmodal') addTagsToDishesModal;

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
        // this.fix.addFixBlogDetails();
        this.title.setTitle(this.route.snapshot.data['title']);
        this.getAllDishes();
    }

    ngOnDestroy() {
        this.unsubscribe.forEach(s => s.unsubscribe());
    }


    filterByDishname() {
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
        tag.is_inverted = false;
        if (!this.filterTags) {
            this.filterTags = [];
        }

        this.filterTags.push(tag);

        this.getAllDishes();
    }

    removeTagFromFilter(tag: ITag) {
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

    editDish(dishId: String) {
        var url = "dishes/edit/" +  dishId;
        this.router.navigateByUrl(url);
    }

    selectDish(dish: Dish) {
        var alreadySelected = this.selectedDishes.filter(t => dish.dish_id == t.dish_id);
        if (alreadySelected.length > 0) {
            return;
        }
        this.selectedDishes.push(dish);
        this.hasSelected = this.selectedDishes.length > 0;
    }

    unSelectDish(dishId: string) {
        this.selectedDishes = this.selectedDishes.filter(t => dishId != t.dish_id);
        this.hasSelected = this.selectedDishes.length > 0;
    }

    toggleAddTag() {
        this.showAddTag = !this.showAddTag;

        this.showAddToNewList = false;
        this.showAddToList = false;
        this.showAddToMealplan = false;

    }

    toggleAddToList() {
        this.showAddToList = !this.showAddToList;

        this.showAddTag = false;
        this.showAddToNewList = false;
        this.showAddToMealplan = false;

    }


    toggleAddToMealplan() {
        this.showAddToMealplan = !this.showAddToMealplan;

        this.showAddTag = false;
        this.showAddToList = false;
        this.showAddToNewList = false;

    }


    toggleAddToNewList() {
        this.showAddToNewList = !this.showAddToNewList;

        this.showAddTag = false;
        this.showAddToList = false;
        this.showAddToMealplan = false;
    }

    addTagToDishes(tag: ITag) {
        this.logger.debug("add tag to dishes");
        this.showAddTag = false;
        this.displayId = null;

        let dishIds = this.selectedDishIds();
        let promise = this.dishService.addTagToDishes(dishIds, tag.tag_id);

        promise.then(s => {
                this.logger.debug("made it here");
                this.displayId = tag.name;
                this.addTagsToDishesModal.show();
            }
        )
            .catch((error) => {
                console.log("Promise rejected with " + JSON.stringify(error));
            });

    }

    addDishesToList(list: IShoppingList) {
        this.logger.debug("add dishes to list");
        this.displayId = null;
        var listId = list.list_id;
        var dishIds = this.selectedDishIds();

        if (dishIds.length == 0) {
            return;
        }

        // add tag to list as item in back end
        this.logger.debug("adding dishes [" + dishIds + "] to list [" + listId + "]");
        let promise = this.listService.addDishesToList(listId, dishIds);

        promise.then( s => {
                this.logger.debug("made it here");
                this.displayId = listId;
                this.addToListModal.show();
            }
        )
            .catch((error) => {
                console.log("Promise rejected with " + JSON.stringify(error));
            });

        this.showAddToList = false;
    }

    addDishesToMealplan(mealplanId: string) {
        this.logger.debug("add dishes to mealplan [" + mealplanId + "]");
        var dishIds = this.selectedDishIds();
        this.showAddToMealplan = false;

        if (dishIds.length == 0) {
            return;
        }

        let promise = this.mealPlanService.addDishesToMealPlan(dishIds, mealplanId);

        promise.then(s => {
                this.displayId = mealplanId;
                this.addToMealPlanModal.show();
            }
        )
            .catch((error) => {
                console.log("Promise rejected with " + JSON.stringify(error));
            });

    }

    addDishesToNewMealplan() {
        this.logger.debug("add dishes to new mealplan");
        this.showAddToMealplan = false;

        var dishIds = this.selectedDishIds();
        if (dishIds.length == 0) {
            return;
        }



        var newMealPlan: any = this.mealPlanService.addMealPlan('');
        let $sub = newMealPlan.subscribe(
            (r) => {
                var headers = r.headers;
                var location = headers.get("Location");
                var splitlocation = location.split("/");
                var id = splitlocation[splitlocation.length - 1];
                var promise = this.mealPlanService.addDishesToMealPlan(dishIds, id);

                promise.then(s => {
                        this.displayId = id;
                        this.addToMealPlanModal.show();
                    }
                )
                    .catch((error) => {
                        console.log("Promise rejected with " + JSON.stringify(error));
                    });

            }
        );
        this.unsubscribe.push($sub);
    }

    generateListFromOptions(options: Map<string, boolean>) {
        var includeStarter = options.get(GenerateListComponent.includeStarter);
        var createMealplan = options.get(GenerateListComponent.createMealPlan);
        this.logger.debug("create new list with options: includeStarter=" + includeStarter + ", createMealPlan=" + createMealplan + ".");

        var dishIds = this.selectedDishIds();

        this.listService.createListFromParameters(dishIds,
            null,
            includeStarter,
            createMealplan)
            .subscribe(r => {
                var headers = r.headers;
                var location = headers.get("Location");
                var splitlocation = location.split("/");
                var id = splitlocation[splitlocation.length - 1];
                this.displayId = id;
                this.addToListModal.show();
            });

        this.showAddToNewList = false;

    }

    private selectedDishIds(): string[] {
        if (!this.selectedDishes || this.selectedDishes.length == 0) {
            return [];
        }
        return this.selectedDishes.map(d => d.dish_id);
    }
}
