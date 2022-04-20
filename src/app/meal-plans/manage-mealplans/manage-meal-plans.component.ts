import {Component, OnDestroy, OnInit} from '@angular/core';
import {LandingFixService} from "../../shared/services/landing-fix.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Meta, Title} from "@angular/platform-browser";
import {ListService} from "../../shared/services/list.service";
import {Subscription} from "rxjs";
import {ShoppingList} from "../../model/shoppinglist";
import {MealPlan} from "../../model/mealplan";
import {MealPlanService} from "../../shared/services/meal-plan.service";
import {PlanContext} from "../plan-context/plan-context";
import {ConfirmDialogService} from "../../shared/services/confirm-dialog.service";

@Component({
    selector: 'app-manage-meal-plans',
    templateUrl: './manage-meal-plans.component.html',
    styleUrls: ['./manage-meal-plans.component.scss']
})
export class ManageMealPlansComponent implements OnInit, OnDestroy {
    unsubscribe: Subscription[] = [];

    isLoading: boolean = true;
    mealPlans: MealPlan[];
    private mealPlanIdToDelete: string;

    constructor(
        private fix: LandingFixService,
        private route: ActivatedRoute,
        private router: Router,
        private title: Title,
        private meta: Meta,
        private mealPlanService: MealPlanService,
        private mealPlanContext: PlanContext,
        private confirmDialogService: ConfirmDialogService
    ) {
    }

    ngOnInit() {
        // this.fix.addFixBlogDetails();
        this.title.setTitle(this.route.snapshot.data['title']);
        this.getMealPlans()
    }

    ngOnDestroy() {
        this.unsubscribe.forEach(s => s.unsubscribe());
    }


    getMealPlans() {

        let sub$ = this.mealPlanService
            .getAllMealplans()
            .subscribe(p => {
                if (p) {
                    this.mealPlans = p
                    let ids = p.map(mp => mp.meal_plan_id);
                    this.mealPlanContext.setMealPlanIds(ids);
                    this.mealPlanIdToDelete = null;
                    this.isLoading = false;
                }
            });
        this.unsubscribe.push(sub$);
    }

    deleteMealPlan(mealPlanId: string) {
        this.mealPlanIdToDelete = mealPlanId;
        this.confirmDialogService.confirmThis("Are you sure you'd like to delete this meal plan?",
            () => {console.log("dummy"); this.doDeleteMealPlan();},
            function () { })

    }

    public doDeleteMealPlan() {
        if (!this.mealPlanIdToDelete) {
            return;
        }
        let sub$ = this.mealPlanService
            .deleteMealPlan(this.mealPlanIdToDelete)
            .subscribe(l => this.getMealPlans());
        this.unsubscribe.push(sub$);
    }

    editMealPlan(listId: String) {
       // console.log("planId + " + planId)
        var url = "mealplans/edit/" +  listId;
        console.log("to this url" +this.router.navigateByUrl(url));

    }

    createMealPlan() {
        let sub$ = this.mealPlanService
            .addMealPlan("")
            .subscribe(l => this.getMealPlans());
        this.unsubscribe.push(sub$);
    }

}
