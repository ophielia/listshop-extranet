import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import MappingUtils from "../../model/mapping-utils";
import {IShoppingList} from "../../model/shoppinglist";
import {NGXLogger} from "ngx-logger";
import {IItem, Item} from "../../model/item";
import {ItemOperationPut} from "../../model/item-operation-put";
import {ITag} from "../../model/tag";
import {IShoppingListPut, ShoppingListPut} from "../../model/shoppinglistput";
import {IListAddProperties} from "../../model/listaddproperties";
import {IListGenerateProperties, ListGenerateProperties} from "../../model/listgenerateproperties";

@Injectable()
export class ListService {
    private authUrl;
    private userUrl;
    private listUrl;

    public static DEFAULT_LIST_NAME: string = "Shopping List";

    constructor(
        private httpClient: HttpClient,
        private logger: NGXLogger
    ) {
        this.authUrl = environment.apiUrl + "auth";
        this.userUrl = environment.apiUrl + "user";
        this.listUrl = environment.apiUrl + "shoppinglist";
    }


    getAllLists(): Observable<IShoppingList[]> {
        this.logger.debug("Retrieving all shopping lists for user.");

        return this.httpClient.get(this.listUrl)
            .pipe(map((response: HttpResponse<any>) => {
                    // map and return
                    return this.mapShoppingLists(response);
                }),
                catchError(this.handleError));
    }

    getAllListsAsPromise(): Promise<IShoppingList[]> {
        this.logger.debug("Retrieving all shopping mealPlans for user.");

        return this.httpClient.get(this.listUrl)
            .pipe(map((response: HttpResponse<any>) => {
                    // map and return
                    return this.mapShoppingLists(response);
                }),
                catchError(this.handleError))
            .toPromise();
    }

    getById(shoppingListId: string): Observable<IShoppingList> {
        this.logger.debug("Retrieving shopping mealPlans for id:" + shoppingListId);
        var url = this.listUrl + "/" + shoppingListId;

        return this.httpClient.get(url)
            .pipe(map((response: HttpResponse<any>) => {
                    // map and return
                    return this.mapShoppingList(response);
                }),
                catchError(this.handleError));
    }

    deleteList(list_id: string) {
        var url = this.listUrl + "/" + list_id;
        return this.httpClient.delete(url);
    }

    createList(listName: string): Observable<Object> {
        var properties = new ListGenerateProperties();
        properties.add_from_starter = false;
        properties.list_name = listName;

        return this.httpClient.post(this.listUrl, JSON.stringify(properties));
    }

    createListFromMealPlan(mealPlanId: string, include_starter: boolean): Observable<HttpResponse<Object>> {
        var properties = new ListGenerateProperties();
        properties.add_from_starter = include_starter;
        properties.meal_plan_source = mealPlanId;

        return this.httpClient.post(this.listUrl,
            JSON.stringify(properties),
            {observe: 'response'}
        );
    }

    createListFromParameters(dishIds: string[], mealPlanId: string,
                             addBase: boolean,
                             generatePlan: boolean, listName: string = ""): Observable<HttpResponse<Object>> {

        if (listName = "") {
            listName = ListService.DEFAULT_LIST_NAME;
        }
        var properties: IListGenerateProperties = <IListGenerateProperties>({
            dish_sources: dishIds,
            meal_plan_source: mealPlanId,
            add_from_starter: addBase,
            generate_mealplan: generatePlan,
            list_name: listName

        });
        var url = this.listUrl;
        return this
            .httpClient
            .post(url,
                JSON.stringify(properties), {observe: 'response'});

    }

    removeItemFromShoppingList(shoppingList_id: string,
                               item_id: string,
                               tag_id: string): Observable<Object> {

        var tagIds: Array<string> = [tag_id];
        return this.performOperationOnListItems(shoppingList_id, tagIds, "Remove");
    }

    performOperationOnListItems(shoppingList_id: string,
                                tag_ids: string[],
                                operation: string): Observable<Object> {

        let itemOperation = <ItemOperationPut>({
                destination_list_id: '0',
                operation: operation,
                tag_ids: tag_ids
            }
        );
        var url: string = this.listUrl + "/" + shoppingList_id + "/item"
        var payload = JSON.stringify(itemOperation);

        return this.httpClient.put(url, payload);
    }

    setItemCrossedOff(shoppingList_id: string,
                      item_id: string,
                      crossedOff: boolean): Observable<Object> {

        var url: string = this.listUrl + "/" + shoppingList_id + "/item/shop/" + item_id + "?crossOff=" + crossedOff

        return this.httpClient.post(url, null);
    }

    addTagItemToShoppingList(shoppingList_id: string, tag: ITag): Promise<Object> {
        let item: Item = <Item>{tag_id: tag.tag_id};
        let url = this.listUrl + "/" + shoppingList_id + "/tag/" + tag.tag_id

        return this.httpClient.post(url, item).toPromise();
    }

    addDishToShoppingList(shoppingList_id: string, dish_id: string): Observable<Object> {
        let url = this.listUrl + "/" + shoppingList_id + "/dish/" + dish_id;
        return this
            .httpClient
            .post(url, null);
    }

    addDishesToList(listId: string, dishIds: string[]): Promise<Object> {
        let url = this.listUrl + "/" + listId + "/dish"

        if (dishIds.length > 0) {

            var properties: IListAddProperties = <IListAddProperties>({
                dish_sources: dishIds,
            });
            return this
                .httpClient
                .post(url,
                    JSON.stringify(properties)).toPromise();
        }

    }

    addListToShoppingList(shoppingList_id: string, list_id: string): Promise<Object> {
        let url = this.listUrl + "/" + shoppingList_id + "/list/" + list_id;
        return this
            .httpClient
            .post(url,
                null)
            .toPromise();
    }

    addMealPlanToShoppingList(mealplan_id: string, list_id: string): Promise<Object> {
        let url = this.listUrl + "/" + list_id + "/mealplan/" + mealplan_id;
        return this
            .httpClient
            .put(url,
                null)
            .toPromise();
    }

    removeItemsByDishOrList(list_or_dish_id: string, sourceTag: string) {
        var type = sourceTag.substr(0, 1);
        var id = sourceTag.slice(1);

        this.logger.debug("type:" + type);
        this.logger.debug("id:" + id);
        if (type == 'd') {
            return this.removeDishItems(list_or_dish_id, id);
        } else if (type == 'l') {
            return this.removeListItems(list_or_dish_id, id);
        }
    }

    removeDishItems(list_id: string, id: string) {
        let url = this.listUrl + "/" + list_id + "/dish/" + id;
        return this
            .httpClient
            .delete(url)
            .toPromise();
    }

    removeListItems(list_id: string, fromListId: string) {
        let url = this.listUrl + "/" + list_id + "/list/" + fromListId;
        return this
            .httpClient
            .delete(url)
            .toPromise();
    }

    removeAllItemsFromList(shoppinglist_id: string) {
        let url = this.listUrl + "/" + shoppinglist_id + "/item";
        return this
            .httpClient
            .delete(url)
            .toPromise();
    }

    updateShoppingListStarterStatus(shoppingList: IShoppingList) {
        // create put object for call
        let shoppingListPut = new ShoppingListPut();
        shoppingListPut.name = shoppingList.name;
        shoppingListPut.is_starter_list = true;
        return this.updateShoppingList(shoppingList.list_id, shoppingListPut);
    }

    updateShoppingListName(shoppingList: IShoppingList) {
        // create put object for call
        let shoppingListPut = new ShoppingListPut();
        shoppingListPut.name = shoppingList.name;
        shoppingListPut.is_starter_list = shoppingList.is_starter;
        return this.updateShoppingList(shoppingList.list_id, shoppingListPut);
    }

    private updateShoppingList(listId: string, shoppingList: IShoppingListPut) {
        let url = this.listUrl + "/" + listId;
        return this
            .httpClient
            .put(url,
                JSON.stringify(shoppingList), {observe: 'response'})
            .toPromise();
    }

    static getCrossedOff(shoppingList: IShoppingList): IItem[] {
        if (!shoppingList.categories || shoppingList.categories.length == 0) {
            return [];
        }

        let allofthem = shoppingList.categories
            .map(c => c.items.filter(i => i.crossed_off));


        return allofthem
            .reduce(function (a, b) {
                return a.concat(b)
            }, []);
    }

    handleError(error: any) {
        // log error
        // could be something more sophisticated
        let errorMsg = error.message || `Yikes! There was a problem with our hyperdrive device and we couldn't retrieve your data!`
        console.error(errorMsg);

        // throw an application level error
        return throwError(error);
    }


    mapShoppingLists(object: Object): IShoppingList[] {
        let embeddedObj = object["_embedded"];
        if (embeddedObj) {
            return embeddedObj["shoppingListResourceList"].map(MappingUtils.toShoppingList);
        }
        return null;
    }

    mapShoppingList(object: Object): IShoppingList {
        if (object) {
            return MappingUtils.toShoppingList(object);
        }
        return null;
    }


}
