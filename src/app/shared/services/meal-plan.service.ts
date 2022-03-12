import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {forkJoin, Observable, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import MappingUtils from "../../model/mapping-utils";
import {NGXLogger} from "ngx-logger";
import {IMealPlan, MealPlan} from "../../model/mealplan";
import MealPlanType from "../../model/meal-plan-type";


@Injectable()
export class MealPlanService {
    private authUrl;
    private userUrl;
    private readonly mealplanUrl;

    constructor(
        private httpClient: HttpClient,
        private logger: NGXLogger
    ) {
        this.authUrl = environment.apiUrl + "auth";
        this.userUrl = environment.apiUrl + "user";
        this.mealplanUrl = environment.apiUrl + "mealplan";
    }

    getAllMealplans(): Observable<IMealPlan[]> {
        this.logger.debug("Retrieving all mealplans for user.");

        return this.httpClient.get(this.mealplanUrl)
            .pipe(map((response: HttpResponse<any>) => {
                    // map and return
                    return MealPlanService.mapMealPlans(response);
                }),
                catchError(this.handleError));
    }

    getMealPlan(planId: String): Observable<IMealPlan> {
        this.logger.debug("Retrieving  mealplans  " +  planId + " for user.");

        return this.httpClient.get(this.mealplanUrl + "/" + planId)
            .pipe(map((response: HttpResponse<any>) => {
                    // map and return
                    return MealPlanService.mapMealPlan(response);
                }),
                catchError(this.handleError));
    }

    deleteMealPlan(mealPlanId: string) {
        var url: string = this.mealplanUrl + '/' + mealPlanId;

        return this
            .httpClient
            .delete(`${url}`);
    }

    addMealPlan(mealPlanName: string): Observable<HttpResponse<Object>> {
        const newMealPlan: MealPlan = <MealPlan>({
            name: mealPlanName,
            meal_plan_type: MealPlanType.Manual
        });

        const url: string = this.mealplanUrl;


        return this
            .httpClient
            .post(url,
                JSON.stringify(newMealPlan),
                {observe: 'response'});
    }

    addDishesToMealPlan(dish_ids: string[], meal_plan_id: string) {
        if (dish_ids.length == 1) {
            return this.addDishToMealPlan(dish_ids[0], meal_plan_id).toPromise();
        }

        const observablesForDishes = dish_ids.map(id => {
            return this.addDishToMealPlan(id, meal_plan_id)
        });

        return forkJoin(observablesForDishes).toPromise();

    }


    addDishToMealPlan(dish_id: string, meal_plan_id: string): Observable<any> {
        const url: string = this.mealplanUrl + '/' + meal_plan_id + "/dish/" + dish_id;

        return this
            .httpClient
            .post(url, null);
    }

    removeDishFromMealPlan(dish_id, meal_plan_id: string): Observable<any> {
        const url: string = this.mealplanUrl + '/' + meal_plan_id + "/dish/" + dish_id;

        return this
            .httpClient
            .delete(url);
    }

    private static mapMealPlans(object: Object): MealPlan[] {
        let embeddedObj = object["_embedded"];
        return embeddedObj["mealPlanResourceList"].map(MappingUtils.toMealPlan);
    }

    private static mapMealPlan(object: Object): MealPlan {
        return MappingUtils.toMealPlan(object);
    }

    handleError(error: any) {
        // log error
        // could be something more sophisticated
        let errorMsg = error.message || `Yikes! There was a problem with our hyperdrive device and we couldn't retrieve your data!`
        console.error(errorMsg);

        // throw an application level error
        return throwError(error);
    }

    copyMealPlan(meal_plan_id: string): Observable<HttpResponse<Object>> {
        const url: string = this.mealplanUrl + '/' + meal_plan_id;

        return this
            .httpClient
            .post(url, null,{observe: 'response'});
    }

    renameMealPlan(meal_plan_id: string, mealPlanName: string) {
        // just filling in here
        let url = this.mealplanUrl + "/" + meal_plan_id + "/name/" + encodeURIComponent(mealPlanName);


        let mealplan$ = this.httpClient
            .post(`${url}`,
                null);
        return mealplan$.toPromise();
    }
}


