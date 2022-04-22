import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import MappingUtils from "../../model/mapping-utils";
import {SearchUserPost} from "../../model/search-user-post";
import {IAdminUser} from "../../model/admin-user";


@Injectable()
export class UserService {
    private userUrl;

    constructor(
        private httpClient: HttpClient
    ) {
        this.userUrl = environment.apiUrl + "admin/user";
    }


    handleError(error: any) {
        // log error
        // could be something more sophisticated
        let errorMsg = error.message || `Yikes! There was a problem with our hyperdrive device and we couldn't retrieve your data!`
        console.error(errorMsg);

        // throw an application level error
        return throwError(error);
    }

    searchUsers(email: string, userId: string, listId: string) {
        var searchUserPost = new SearchUserPost();
        searchUserPost.email = email;
        searchUserPost.user_id = userId;
        searchUserPost.list_id = listId;

        return this.httpClient.post(this.userUrl, JSON.stringify(searchUserPost))
            .pipe(map((response: HttpResponse<any>) => {
                    return this.mapAdminUsers(response);
                }),
                catchError(this.handleError));
    }

    findUser(userId: string) {
        let url = this.userUrl + "/" + userId;
        return this.httpClient.get(url)
            .pipe(map((response: HttpResponse<any>) => {
                    return this.mapAdminUser(response);
                }),
                catchError(this.handleError));
    }

    mapAdminUsers(object: Object): IAdminUser[] {
        return object["users"].map(MappingUtils.toAdminUser);
    }

    mapAdminUser(object: Object): IAdminUser {
        return MappingUtils.toAdminUser(object);
    }


}
