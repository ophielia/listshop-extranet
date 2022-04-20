import {Component, OnDestroy, OnInit} from '@angular/core';
import {Meta, Title} from "@angular/platform-browser";
import {ActivatedRoute} from "@angular/router";
import {LandingFixService} from "../../shared/services/landing-fix.service";
import {ListService} from "../../shared/services/list.service";
import {IShoppingList, ShoppingList} from "../../model/shoppinglist";
import {Subscription} from "rxjs";
import {LegendService} from "../../shared/services/legend.service";
import {LegendPoint} from "../../model/legend-point";
import {Category, ICategory} from "../../model/category";
import {IItem, Item} from "../../model/item";
import {Tag} from "../../model/tag";
import {NGXLogger} from "ngx-logger";
import {IDish} from "../../model/dish";
import {DishService} from "../../shared/services/dish.service";
import {OperationType} from "../../model/operation-type";

@Component({
    selector: 'app-edit-list',
    templateUrl: './edit-list.component.html',
    styleUrls: ['./edit-list.component.scss']
})
export class EditListComponent implements OnInit, OnDestroy {
    private unsubscribe: Subscription[] = [];

    crossedOffExist: boolean;
    private showMakeStarter: boolean;
    listLegendMap: Map<string, LegendPoint>;
    legendList: LegendPoint[] = [];
    showCrossedOff: boolean = true;
    showActions: boolean = true;
    showAddDish: boolean = false;
    showAddItem: boolean = false;
    showAddList: boolean = false;
    showFrequent: boolean = true;
    showChangeName: boolean = false;
    shoppingListIsStarter: boolean = false;
    private originalName: string = null;
    shoppingListName: string = "";
    frequentToggleAvailable: boolean = true;
    frequentItemsExist: boolean = false;
    allDishes: IDish[];
    errorMessage: any;
    private highlightSourceId: string;
    showItemLegends: boolean;

    shoppingList: ShoppingList;
    removedItems: IItem[] = [];
    selectedItems: string[] = [];


    constructor(
        private fix: LandingFixService,
        private route: ActivatedRoute,
        private title: Title,
        private meta: Meta,
        private listService: ListService,
        private dishService: DishService,
        public legendService: LegendService,
        private logger: NGXLogger,
    ) {
    }

    ngOnInit() {

        this.title.setTitle(this.route.snapshot.data['title']);
        this.route.params.subscribe(params => {
            let id = params['id'];
            this.logger.debug('getting list with id: ', id);
            this.getShoppingList(id);
        });
        this.getAllDishes();
        this.highlightSourceId = this.defaultEmptySourceId();
    }

    ngOnDestroy() {
        //this.fix.removeFixBlog();
        this.unsubscribe.forEach(s => s.unsubscribe())
    }

    toggleShowActions() {
        this.showActions = !this.showActions;
        if (this.showActions) {
            // start with all inputs hidden
            this.hideAllAddInputs();
        }
    }

    toggleAddList() {
        // hide other inputs
        if (!this.showAddList) {
            // start with all inputs hidden
            this.hideAllAddInputs();
        }
        this.showAddList = !this.showAddList;
    }

    toggleAddDish() {
        // hide other inputs
        if (!this.showAddDish) {
            // start with all inputs hidden
            this.hideAllAddInputs();
        }
        this.showAddDish = !this.showAddDish;
    }

    toggleAddItem() {
        // hide other inputs
        if (!this.showAddItem) {
            // start with all inputs hidden
            this.hideAllAddInputs();
        }
        this.showAddItem = !this.showAddItem;
    }

    toggleShowFrequent() {
        // this.showFrequent = !this.showFrequent;
        if (this.showFrequent) {
            this.highlightSource(LegendService.FREQUENT);
        } else {
            if (this.highlightSourceId == LegendService.FREQUENT) {
                this.highlightSourceId = null;
            }
            this.getShoppingList(this.shoppingList.list_id);
        }
    }

    toggleShowCrossedOff() {
        this.getShoppingList(this.shoppingList.list_id);
    }

    toggleShowChangeName() {
        this.showChangeName = !this.showChangeName;
        if (this.showChangeName) {
            // save original value
            this.originalName = this.shoppingList.name;
            this.shoppingListName = this.shoppingList.name;
        } else if (this.originalName != null) {
            this.originalName = null;
        }
    }


    getShoppingList(id: string) {
        let $sub = this.listService
            .getById(id)
            .subscribe(p => {
                this.processRetrievedShoppingList(p);
            });
        this.unsubscribe.push($sub);
    }

    toggleItemSelected(item: Item, category: Category) {
        item.is_selected = !item.is_selected;
        var inList = this.selectedContains(item.tag.tag_id)
        if (item.is_selected && !inList) {
            this.selectedItems.push(item.tag.tag_id);
        } else if (!item.is_selected && inList) {
            this.selectedItems = this.selectedItems.filter(i => i == item.tag_id);
        }
        // check category for selected
        var oneSelected = category.items.filter(i => i.is_selected);
        category.has_selected = (oneSelected != null && oneSelected.length > 0);
    }

    private selectedContains(tag_id: String): boolean {
        var inListString = this.selectedItems.find(s => s == tag_id);
        return inListString != null;
    }

    showLegends(item: Item) {
        if (!this.showItemLegends) {
            return false;
        }
        return item.source_keys && item.source_keys.length > 0;
    }

    iconSourceForKey(key: string, withCircle: boolean): string {
        let circleOrColor = withCircle ? "circles" : "colors"
        // assets/images/legend/colors/blue/bowl.png
        let point = this.listLegendMap.get(key);
        if (!point) {
            return null;
        }
        return "assets/images/listshop/legend/" + circleOrColor + "/" + point.color + "/" + point.icon + ".png";
    }

    clearRemoved() {
        this.removedItems = []
    }

    highlightSource(source: string) {
        this.hideAllAddInputs();
        if (!source) {
            return;
        }
        var requiresFetchedList = this.highlightSourceId != null;
        if (source == this.highlightSourceId) {
            this.highlightSourceId = this.defaultEmptySourceId();
        } else {
            this.highlightSourceId = source;
        }

        if (requiresFetchedList) {
            this.getShoppingList(this.shoppingList.list_id);
        } else {
            this.shoppingList = this.filterForDisplay(this.shoppingList);
        }
    }

    addTagToList(tag: Tag) {
        // add tag to list as item in back end
        this.logger.debug("adding tag [" + tag.tag_id + "] to list");
        let promise = this.listService.addTagItemToShoppingList(this.shoppingList.list_id, tag);

        promise.then((data) => {
            this.getShoppingList(this.shoppingList.list_id);
        }).catch((error) => {
            console.log("Promise rejected with " + JSON.stringify(error));
        });
    }

    reAddItem(item: IItem) {
        this.removedItems = this.removedItems.filter(i => i.item_id != item.item_id);
        if (item.tag) {
            this.addTagToList(item.tag);
        }
    }

    getAllDishes() {
        this.dishService.getAllDishes()
            .subscribe(p => {
                    this.allDishes = p;
                },
                e => this.errorMessage = e);

    }

    addDishToList(dish: any) {
        this.listLegendMap = null;
        let $sub = this.listService.addDishToShoppingList(this.shoppingList.list_id, dish.dish_id)
            .subscribe(() => {
                this.highlightSourceId = "d" + dish.dish_id;
                this.getShoppingList(this.shoppingList.list_id);
                this.showAddDish = false;
            });
        this.unsubscribe.push($sub);
    }

    addListToList(fromList: IShoppingList) {
        this.listLegendMap = null;
        this.showAddList = false;
        let promise = this.listService.addListToShoppingList(this.shoppingList.list_id, fromList.list_id);
        promise.then(data => {
            this.highlightSourceId = "l" + fromList.list_id;
            this.getShoppingList(this.shoppingList.list_id);
            this.showAddList = false;
        })
    }

    removeDishOrList(sourcekey: string) {
        this.hideAllAddInputs();
        let promise = this.listService.removeItemsByDishOrList(this.shoppingList.list_id, sourcekey)
        promise.then(data => {
            this.getShoppingList(this.shoppingList.list_id);
        });

        if (this.highlightSourceId == sourcekey) {
            this.highlightSourceId = this.defaultEmptySourceId();
        }
    }

    makeStarterList() {
        this.hideAllAddInputs()
        let promise = this.listService.updateShoppingListStarterStatus(this.shoppingList);
        promise.then(data => {
            this.getShoppingList(this.shoppingList.list_id);
        });

    }

    saveListName() {
        this.showChangeName = false;
        this.originalName = null;
        this.shoppingList.name = this.shoppingListName;
        let promise = this.listService.updateShoppingListName(this.shoppingList)
        promise.then(data => {
            this.getShoppingList(this.shoppingList.list_id);
        });

    }

    clearList() {
        this.highlightSourceId = null;
        this.showFrequent = false;
        let promise = this.listService.removeAllItemsFromList(this.shoppingList.list_id);
        promise.then(data => {
            this.getShoppingList(this.shoppingList.list_id)
        });
    }

    private processRetrievedShoppingList(p: IShoppingList) {
        this.handleCrossedOffAndSelected(p);
        this.prepareLegend(p);
        this.frequentItemsExist = this.frequentItemsPresent(p);
        this.adjustForStarter(p);
        this.shoppingList = this.filterForDisplay(p);
        this.showItemLegends = this.newEvaluateShowLegend();

    }

    private prepareLegend(list: IShoppingList) {

        let legendMap = this.legendService.processLegend(list.legend);
        var collectedValue: LegendPoint[] = [];
        this.listLegendMap = new Map();
        legendMap.forEach((value: LegendPoint, key: string) => {
            collectedValue.push(value);
            this.listLegendMap.set(key, value);
        });
        collectedValue.sort((a, b) => {
            return a.display.toLowerCase().localeCompare(b.display.toLowerCase());
        });
        this.legendList = collectedValue;

    }

    private filterForDisplay(shoppingList: IShoppingList): IShoppingList {
        if (shoppingList.categories.length == 0) {
            this.showFrequent = false;
            return shoppingList;
        }

        if (!this.showCrossedOff) {
            for (let category of shoppingList.categories) {
                this.hideCrossedOff(category);
            }
        }
        if (this.highlightSourceId) {
            shoppingList.categories = this.pullCategoryByTag(this.highlightSourceId, shoppingList);
        }
        return shoppingList;
    }

    private hideCrossedOff(category: ICategory) {
        // process subcategories
        for (let subcategory of category.subcategories) {
            this.hideCrossedOff(subcategory);
        }
        // process direct items
        category.items = category.items.filter(i => !i.crossed_off);
    }

    private pullCategoryByTag(sourceId: string, shoppingList: IShoppingList) {
        if (!sourceId) {
            return;
        }
        var highlightId = sourceId ? sourceId : LegendService.FREQUENT;

        var newCategories = [];
        var pulledItems = [];
        var pulledHasSelected = false;
        for (let category of shoppingList.categories) {
            var categoryItems = [];
            var hasSelected = false;
            for (let item of category.items) {
                if (item.source_keys.includes(highlightId)) {
                    pulledItems.push(item);
                    if (item.is_selected) {
                        pulledHasSelected = true;
                    }
                } else {
                    hasSelected = hasSelected || (!hasSelected && item.is_selected);
                    categoryItems.push(item);
                }
            }
            if (categoryItems.length > 0) {
                category.items = categoryItems;
                category.has_selected = hasSelected;
                newCategories.push(category);
            }
        }

        if (pulledItems.length == 0) {
            // nothing to pull out
            // if pull is frequent, "unset" and return
            if (highlightId == LegendService.FREQUENT) {
                this.showFrequent = false;
            }
            return newCategories;
        }
        // now, make new category
        var name;
        var is_frequent = false;
        if (highlightId == LegendService.FREQUENT) {
            name = "Frequent";
            is_frequent = true;
        } else {
            var legendPoint = this.listLegendMap.get(this.highlightSourceId);
            name = legendPoint.display;

        }
        // to fill in name, items, is_frequent
        var pulledCategory = new Category(
            name,
            pulledItems,
            null,
            pulledHasSelected,
            "yes",
            is_frequent,
            true
        )

        // put pulledItems at the front of the list
        newCategories.unshift(pulledCategory);
        return newCategories;
    }

    private defaultEmptySourceId() {
        // will be either null or frequent, depending upon frequent availabilty
        // and current frequent toggle state
        if (this.frequentToggleAvailable && this.showFrequent) {
            return LegendService.FREQUENT;
        }
        return null;

    }

    private newEvaluateShowLegend() {
        let thisListIsTheStarter = this.shoppingList.is_starter;
        if (thisListIsTheStarter) {
            return false;
        }
        return this.shoppingList.legend.length > 0;
    }


    private hideAllAddInputs() {
        this.showAddItem = false;
        this.showAddDish = false;
        this.showAddList = false;
        this.showChangeName = false;
    }


    private adjustForStarter(list: IShoppingList) {
        this.shoppingListIsStarter = list.is_starter;
        if (this.shoppingListIsStarter) {
            this.showMakeStarter = false;
            this.frequentToggleAvailable = !this.shoppingListIsStarter;
            // check if currently sorted on frequent - if so, reset to null
            if (this.highlightSourceId == LegendService.FREQUENT) {
                this.highlightSourceId = null;
            }
        } else {
            this.showMakeStarter = true;
            this.frequentToggleAvailable = this.frequentItemsExist;

            // check showFrequent toggle, and set source id if on.
            if (this.showFrequent && this.highlightSourceId == null) {
                this.highlightSourceId = LegendService.FREQUENT;
            }

        }

    }

    private handleCrossedOffAndSelected(shoppingList: IShoppingList) {

        if (!shoppingList.categories || shoppingList.categories.length == 0) {
            return [];
        }

        this.crossedOffExist = false;
        for (let category of shoppingList.categories) {
            var hasSelected = false;
            for (let item of category.items) {
                if (!this.crossedOffExist && item.crossed_off) {
                    this.crossedOffExist = true;
                }
                if (this.selectedContains(item.tag.tag_id)) {
                    item.is_selected = true;
                }
                hasSelected = hasSelected || (!hasSelected && item.is_selected);
            }
            category.has_selected = hasSelected;
        }
    }

    removeSelectedInCategory(category: Category) {
        var tagIdsToRemove = category.items.filter(i => i.is_selected).map(i => i.tag.tag_id);
        let $sub = this.listService.performOperationOnListItems(this.shoppingList.list_id,
            tagIdsToRemove, "Remove")
            .subscribe(() => {
                this.getShoppingList(this.shoppingList.list_id);
            });
        this.unsubscribe.push($sub);

    }

    toggleCrossedOffInCategory(category: Category) {
        var itemsToCrossOff = category.items.filter(i => i.is_selected);
        var itemTagIds = itemsToCrossOff.map(i => i.tag.tag_id);
        var allCrossedOff = (itemsToCrossOff.filter(itco => !itco.crossed_off)).length == 0
        var operation = allCrossedOff ? OperationType.UnCrossOff : OperationType.CrossOff
        // remove from selected
        this.selectedItems = this.selectedItems.filter(tid => itemTagIds.indexOf(tid) == 0);
        let $sub = this.listService.performOperationOnListItems(this.shoppingList.list_id,
            itemsToCrossOff.map(i => i.tag.tag_id), operation)
            .subscribe(() => {
                this.getShoppingList(this.shoppingList.list_id);
            });
        this.unsubscribe.push($sub);

    }

    private frequentItemsPresent(list: IShoppingList): boolean {

        for (let category of list.categories) {
            for (let item of category.items) {
                for (let sourceKey of item.source_keys) {
                    if (sourceKey == LegendService.FREQUENT) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}
