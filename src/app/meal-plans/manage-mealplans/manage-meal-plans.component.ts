import {Component, OnDestroy, OnInit} from '@angular/core';
import {LandingFixService} from "../../shared/services/landing-fix.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Meta, Title} from "@angular/platform-browser";
import {ListService} from "../../shared/services/list.service";
import {Subscription} from "rxjs";
import {ShoppingList} from "../../model/shoppinglist";
import {MealPlan} from "../../model/mealplan";
import {MealPlanService} from "../../shared/services/meal-plan.service";

@Component({
    selector: 'app-manage-meal-plans',
    templateUrl: './manage-meal-plans.component.html',
    styleUrls: ['./manage-meal-plans.component.css']
})
export class ManageMealPlansComponent implements OnInit, OnDestroy {
    unsubscribe: Subscription[] = [];

    mealPlans: MealPlan[];

    constructor(
        private fix: LandingFixService,
        private route: ActivatedRoute,
        private router: Router,
        private title: Title,
        private meta: Meta,
        private mealPlanService: MealPlanService
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
                }
            });
        this.unsubscribe.push(sub$);
    }

    deleteMealPlan(mealPlanId: string) {
        let sub$ = this.mealPlanService
            .deleteMealPlan(mealPlanId)
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
