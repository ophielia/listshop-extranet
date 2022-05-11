import {Injectable, OnDestroy} from "@angular/core";
import {NGXLogger} from "ngx-logger";


@Injectable()
export class PlanContext implements OnDestroy {

    private mealPlanIds: string[];

    constructor(
        private logger: NGXLogger
    ) {

    }

    ngOnDestroy(): void {
        this.mealPlanIds = null;
    }

    public setMealPlanIds(planIds: string[]) {
        this.mealPlanIds = planIds;
    }

    public getNextMealPlanId(planId: string): string {
        let currentIndex = this.getIndex(planId);
        if (currentIndex == this.mealPlanIds.length - 1) {
            return null;
        }
        return this.mealPlanIds[currentIndex + 1];
    }

    public getPreviousMealPlanId(planId: string): string {
        let currentIndex = this.getIndex(planId);
        if (currentIndex == 0) {
            return null;
        }
        return this.mealPlanIds[currentIndex - 1];
    }

    private getIndex(planId: String) {
        var index = 0;
        for (let id of this.mealPlanIds) {
            if (id == planId) {
                return index;
            }
            index++;
        }
    }

}
