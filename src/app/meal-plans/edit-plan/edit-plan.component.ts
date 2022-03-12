import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Meta, Title} from "@angular/platform-browser";
import {ActivatedRoute, Router} from "@angular/router";
import {LandingFixService} from "../../shared/services/landing-fix.service";
import {ListService} from "../../shared/services/list.service";
import {IShoppingList} from "../../model/shoppinglist";
import {Subscription} from "rxjs";
import {LegendService} from "../../shared/services/legend.service";
import {NGXLogger} from "ngx-logger";
import {Dish, IDish} from "../../model/dish";
import {DishService} from "../../shared/services/dish.service";
import {MealPlanService} from "../../shared/services/meal-plan.service";
import {MealPlan} from "../../model/mealplan";

@Component({
    selector: 'app-edit-plan',
    templateUrl: './edit-plan.component.html',
    styleUrls: ['./edit-plan.component.scss']
})
export class EditPlanComponent implements OnInit, OnDestroy {
    @ViewChild('mealplancopied') copiedMealPlanModal;

    private unsubscribe: Subscription[] = [];

    showActions: boolean = true;
    showGenerate: boolean = false;
    showAddDish: boolean = false;
    showAddToList: boolean = false;
    showChangeName: boolean = false;
    includeStarter: boolean = true;
    private originalName: string = null;
    mealPlanName: string = "";
    allDishes: IDish[];
    errorMessage: any;

    mealPlan: MealPlan;
    planDishes: Dish[];

    copiedId: string;
    removedDishes: Dish[] = [];


    constructor(
        private fix: LandingFixService,
        private route: ActivatedRoute,
        private title: Title,
        private meta: Meta,
        private router: Router,
        private listService: ListService,
        private dishService: DishService,
        private mealPlanService: MealPlanService,
        public legendService: LegendService,
        private logger: NGXLogger,
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
        this.unsubscribe.forEach(s => s.unsubscribe())
    }

    getMealPlan(id: string) {
        let $sub = this.mealPlanService
            .getMealPlan(id)
            .subscribe(p => {
                this.mealPlan = p;
                this.planDishes = [];
                this.mealPlan.slots.forEach(s => this.planDishes.push(s.dish));

            });
        this.unsubscribe.push($sub);
    }

    getAllDishes() {
        this.dishService.getAllDishes()
            .subscribe(p => {
                    this.allDishes = p;
                },
                e => this.errorMessage = e);

    }

    saveMealPlanName() {
        this.showChangeName = false;
        this.originalName = null;
        this.mealPlan.name = this.mealPlanName;
        let promise = this.mealPlanService.renameMealPlan(this.mealPlan.meal_plan_id, this.mealPlan.name);
        promise.then(data => {
            this.getMealPlan(this.mealPlan.meal_plan_id);
        });

    }

    toggleShowActions() {
        this.showActions = !this.showActions;
    }

    toggleShowChangeName() {
        this.showChangeName = !this.showChangeName;
        if (this.showChangeName) {
            // save original value
            this.originalName = this.mealPlan.name;
            this.mealPlanName = this.mealPlan.name;
        } else if (this.originalName != null) {
            this.originalName = null;
        }
    }

    addDishToPlan(dish: any) {
        let $sub = this.mealPlanService.addDishToMealPlan(dish.dish_id, this.mealPlan.meal_plan_id)
            .subscribe(() => {
                this.getMealPlan(this.mealPlan.meal_plan_id);
                this.showAddDish = false;
            });
        this.unsubscribe.push($sub);
    }

    goToDishSelect() {
        var url = "mealplans/edit/" + this.mealPlan.meal_plan_id + "/dish";
        this.router.navigateByUrl(url);
    }

    private hideAllAddInputs() {
        this.showAddDish = false;
        this.showGenerate = false;
        this.showAddToList = false;
        this.showChangeName = false;
    }

    copyMealPlan() {
        let $sub = this.mealPlanService.copyMealPlan(this.mealPlan.meal_plan_id)
            .subscribe(r => {
                var headers = r.headers;
                var location = headers.get("Location");
                var splitlocation = location.split("/");
                var id = splitlocation[splitlocation.length - 1];
                this.copiedId = id;
                this.copiedMealPlanModal.show();
            });
        this.unsubscribe.push($sub);

    }

    showCopiedMealPlan() {
        var url = "mealplans/edit/" + this.copiedId;
        this.router.navigateByUrl(url);
    }

    toggleAddToList() {
        // hide other inputs
        if (!this.showAddToList) {
            // start with all inputs hidden
            this.hideAllAddInputs();
        }
        this.showAddToList = !this.showAddToList;
    }

    toggleShowGenerate() {
        // hide other inputs
        if (!this.showGenerate) {
            // start with all inputs hidden
            this.hideAllAddInputs();
        }
        this.showGenerate = !this.showGenerate;
    }

    toggleAddDish() {
        // hide other inputs
        if (!this.showAddDish) {
            // start with all inputs hidden
            this.hideAllAddInputs();
        }
        this.showAddDish = !this.showAddDish;
    }

    addMealPlanToList(list: IShoppingList) {
        let promise = this.listService.addMealPlanToShoppingList(this.mealPlan.meal_plan_id, list.list_id);
        promise.then(data => {
            this.getMealPlan(this.mealPlan.meal_plan_id);
            this.showAddToList = false;
        })
    }

    generateList() {
        let $sub = this.listService.createListFromMealPlan(this.mealPlan.meal_plan_id, this.includeStarter)
            .subscribe(r => {
                var headers = r.headers;
                var location = headers.get("Location");
                var splitlocation = location.split("/");
                var id = splitlocation[splitlocation.length - 1];
                var url = "lists/edit/" + id;
                this.router.navigateByUrl(url);
            });
        this.unsubscribe.push($sub);
    }

    clearRemovedDishes() {
        this.removedDishes = [];
    }

    reAddDish(dish: Dish) {
        this.removedDishes = this.removedDishes.filter(d => d.dish_id != dish.dish_id);
        let $sub = this.mealPlanService.addDishToMealPlan(dish.dish_id, this.mealPlan.meal_plan_id)
            .subscribe(() => {
                this.getMealPlan(this.mealPlan.meal_plan_id);
            });
        this.unsubscribe.push($sub);

    }

    removeDish(dishId: string) {
        var dishes = this.planDishes.filter(d => d.dish_id == dishId);
        if (dishes.length > 0) {
            this.removedDishes.push(dishes[0]);
        }
        let $sub = this.mealPlanService.removeDishFromMealPlan(dishId, this.mealPlan.meal_plan_id)
            .subscribe(() => {
                this.getMealPlan(this.mealPlan.meal_plan_id);
            });
        this.unsubscribe.push($sub);

    }
}
