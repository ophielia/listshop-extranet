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
        this.listUrl = environment.apiUrl + "v2/shoppinglist";
    }

    createList(listName: string): Observable<Object> {
        var properties = new ListGenerateProperties();
        properties.add_from_starter = false;
        properties.list_name = listName;

        return this.httpClient.post(this.listUrl, JSON.stringify(properties));
    }






}
