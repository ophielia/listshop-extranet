import {Injectable} from '@angular/core';
import {catchError, map} from 'rxjs/operators';
import {NGXLogger} from 'ngx-logger';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {ILayoutCategory} from '../../model/layout-category';
import MappingUtils from '../../model/mapping-utils';
import {Observable, throwError} from 'rxjs';
import {environment} from '../../../environments/environment';
import 'rxjs-compat/add/operator/concat';


@Injectable()
export class LayoutService {

    private layoutAdminUrl;

    constructor(
        private httpClient: HttpClient,
        private logger: NGXLogger
    ) {
        this.layoutAdminUrl = environment.apiUrl + 'admin/layout';
    }

    getDefaultCategories(): Promise<ILayoutCategory[]> {
        const url = this.layoutAdminUrl + '/category';
        return this.httpClient
            .get(url)
            .pipe(map((response: HttpResponse<any>) => {
                    return LayoutService.mapLayoutCategoryClient(response);
                }),
                catchError(this.handleError))
            .toPromise();
    }

    moveTagsToCategory(categoryId: string, tagIds: string[]): Promise<void> {
        if (tagIds.length == 1) {
            return this.moveToCategory(categoryId, tagIds[0]).toPromise();
        }
        var firstCall = this.moveToCategory(categoryId, tagIds.pop());
        tagIds.forEach(t => firstCall.concat(this.moveToCategory(categoryId, t)));
        return firstCall.toPromise();
    }

    moveToCategory(categoryId: string, tagId: string): Observable<void> {
        const url = this.layoutAdminUrl + '/category/' + categoryId + '/tag/' + tagId;
        return this.httpClient
            .put(url, null)
            .pipe(map((response: HttpResponse<any>) => {
                    return;
                }),
                catchError(this.handleError));
    }
    static mapLayoutCategoryClient(object: Object): ILayoutCategory[] {
        let embeddedObj = object['_embedded'];
        return embeddedObj['layout_category_resource_list'].map(MappingUtils.toLayoutCategoryMapping);
    }

    private handleError(error: any) {
        // log error
        // could be something more sophisticated
        const errorMsg = error.message || `Yikes! There was a problem with our hyperdrive device and we couldn't retrieve your data!`;
        console.error(errorMsg);

        // throw an application level error
        return throwError(error);
    }
}


