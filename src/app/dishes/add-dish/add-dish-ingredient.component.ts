import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {LandingFixService} from "../../shared/services/landing-fix.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Meta, Title} from "@angular/platform-browser";
import {Subscription} from "rxjs";
import {Dish} from "../../model/dish";
import {DishService} from "../../shared/services/dish.service";
import {Tag} from "../../model/tag";
import {NGXLogger} from "ngx-logger";
import {ListService} from "../../shared/services/list.service";
import {MealPlanService} from "../../shared/services/meal-plan.service";
import TagType from "../../model/tag-type";
import {IRatingInfo, RatingInfo} from "../../model/rating-info";
import {DishRatingInfo} from "../../model/dish-rating-info";


@Component({
    selector: 'app-add-dish-ingredient',
    templateUrl: './add-dish-ingredient.component.html',
    styleUrls: ['./add-dish-ingredient.component.scss']
})
export class AddDishIngredientComponent implements OnInit, OnDestroy {
    @ViewChild('dishesaddedtolist') addToListModal;
    @ViewChild('dishesaddedtomealplan') addToMealPlanModal;
    @ViewChild('addtagstodishesmodal') addTagsToDishesModal;

    unsubscribe: Subscription[] = [];
    isLoading: boolean = true;

    dish: Dish;
    dishTypeTags: Tag[] = [];
    ingredientTags: Tag[] = [];
    ratingTags: Tag[] = [];
    plainOldTags: Tag[] = [];

    showAddIngredient: boolean = false;
    showPlainTag: boolean = false;
    showAddDishType: boolean = false;
    showEditMainInfo: boolean = false;

    dishName: string ;
    dishDescription : string;
    dishReference : string;

    private dishReferenceError: string;
    private dishNameError: string;
    private dishDescriptionError: string;

    thisRating = 2;

    private dishRatingInfo: DishRatingInfo;
    private ratingHeaders: IRatingInfo[];
    private ratingsMap = new Map<number, RatingInfo>();

    private errorMessage: string;

    displayId: string;

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
        this.route.params.subscribe(params => {
            let id = params['id'];
            this.logger.debug('getting list with id: ', id);
            this.getDish(id);
            this.getDishRatings(id);
        });
    }

    ngOnDestroy() {
        this.unsubscribe.forEach(s => s.unsubscribe());
    }

    getDish(dishId: string) {
        this.dishService
            .getDish(dishId)
            .subscribe(p => {
                    this.dish = p;
                    this.isLoading = false;
                    this.harvestTagTypesForDish();
                    this.dishName = this.dish.name;
                    this.dishReference = this.dish.reference;
                    this.dishDescription = this.dish.description;
                },
                e => this.errorMessage = e);
    }

    getDishRatings(dishId: string) {
        this.dishService
            .getDishRatings(dishId)
            .subscribe(p => {
                    if (p.headers != null) {
                        this.ratingHeaders = p.headers;
                    }
                    if (p.dish_ratings != null) {
                        this.dishRatingInfo = p.dish_ratings[0];
                        this.dishRatingInfo.ratings.forEach(r => {
                            r.orig_power = r.power;
                            this.ratingsMap.set(r.rating_tag_id, r);
                        });
                    }
                },
                e => this.errorMessage = e);
    }


    harvestTagTypesForDish() {
        this.ingredientTags = [];
        this.dishTypeTags = [];
        this.ratingTags = [];
        this.plainOldTags = [];

        for (let tag of this.dish.tags) {
            var tagType = tag.tag_type;
            switch (tagType) {
                case TagType.Ingredient:
                    this.ingredientTags.push(tag);
                    break;
                case TagType.DishType:
                    this.dishTypeTags.push(tag);
                    break;
                case TagType.Rating:
                    break;
                case TagType.TagType:
                    this.plainOldTags.push(tag);
                    break;
            }
        }
    }

    stringFieldEmpty(testField) {
        if (testField == null) {
            return true
        }
        return testField.trim().length == 0;
    }

    toggleAddIngredient() {
        this.showAddIngredient = !this.showAddIngredient;
        if (this.showAddIngredient) {
            this.showPlainTag = false;
            this.showAddDishType = false;
        }
    }

    toggleEditMainInfo() {
        this.showEditMainInfo = !this.showEditMainInfo;
        if (this.showEditMainInfo) {
            this.showAddIngredient = false;
            this.showPlainTag = false;
            this.showAddDishType = false;
        }
    }

    toggleShowAddDishTypeTag() {
        this.showAddDishType = !this.showAddDishType;
        if (this.showAddDishType) {
            this.showEditMainInfo = false;
            this.showPlainTag = false;
            this.showAddIngredient = false;
        }
    }

    toggleShowPlainTag() {
        this.showPlainTag = !this.showPlainTag;
        if (this.showPlainTag) {
            this.showEditMainInfo = false;
            this.showAddIngredient = false;
            this.showAddDishType = false;
        }
    }

    addTagToDish(tag: Tag) {
        // add tag to list as item in back end
        this.logger.debug("adding tag [" + tag.tag_id + "] to dish");

        let $sub = this.dishService
            .addTagToDish(this.dish.dish_id, tag.tag_id)
            .subscribe(p => {
                this.getDish(this.dish.dish_id);
            });
        this.unsubscribe.push($sub);

        this.showAddIngredient = false;
        this.showPlainTag = false
        this.showAddDishType = false
    }

    removeTagFromDish(tag: Tag) {
        // add tag to list as item in back end
        this.logger.debug("removing tag [" + tag.tag_id + "] to dish");

        let $sub = this.dishService
            .removeTagFromDish(this.dish.dish_id, tag.tag_id)
            .subscribe(p => {
                this.getDish(this.dish.dish_id);
            });
        this.unsubscribe.push($sub);


    }

    displayTheRating() {
        console.log("the rating is raging: " + this.thisRating);
    }

    changeTheRating(ratingInfo: RatingInfo) {
        if (ratingInfo) {
            console.log("the rating is still raging: " + ratingInfo.power);
            console.log("but this time with a tag" + ratingInfo.rating_tag_id);

            if (ratingInfo.orig_power < ratingInfo.power) {
                console.log("going up");
            } else if (ratingInfo.orig_power > ratingInfo.power) {
                console.log("going down");

            } else {
                console.log("no change.");

            }

            this.dishService.setDishRating(this.dish.dish_id, ratingInfo.rating_tag_id, ratingInfo.power).subscribe();
            ratingInfo.orig_power = ratingInfo.power;
        }

    }

    saveAllEdits() {
        this.validateEntry();
        if (this.hasErrors()) {
            return;
        }
        this.showEditMainInfo = false;
        this.dishService.saveDishChanges(this.dish, this.dishDescription, this.dishReference, this.dishName)
            .subscribe( x => {
                    this.getDish(this.dish.dish_id);
                }

            )
    }

    validateEntry() {
        this.dishReferenceError = null;
        this.dishDescriptionError = null;
        this.dishNameError = null;

        if (this.dishName == null || (this.dishName.trim())=="") {
            this.logger.debug("Invalid - no name for the dish");
            this.dishNameError = "Disn name is required.";
        } else if (this.dishName != null && this.dishName.length > 255)  {
            this.logger.debug("Invalid - dish name too long");
            this.dishNameError = "This dish name is too long";
        }
        if (this.dishDescription != null && this.dishDescription.length > 255)  {
            this.logger.debug("Invalid - dish description is too long");
            this.dishDescriptionError = "This dish description is too long";
        }
        if (this.dishReference != null && this.dishReference.length > 255)  {
            this.logger.debug("Invalid - dish reference is too long");
            this.dishReferenceError = "The dish reference is too long";
        }

    }


    private hasErrors() {
        return this.dishNameError != null ||
            this.dishDescriptionError != null ||
            this.dishReferenceError != null;
    }


}
