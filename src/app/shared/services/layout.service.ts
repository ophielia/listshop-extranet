import {Injectable} from '@angular/core';
import {catchError, map} from 'rxjs/operators';
import {NGXLogger} from 'ngx-logger';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {ILayoutCategory} from '../../model/layout-category';
import MappingUtils from '../../model/mapping-utils';
import {throwError} from 'rxjs';
import {environment} from '../../../environments/environment';


@Injectable()
export class LayoutService {

    private adminTagUrl;

    constructor(
        private httpClient: HttpClient,
        private logger: NGXLogger
    ) {
        this.adminTagUrl = environment.apiUrl + 'admin/tag';
    }

    getDefaultCategories(): Promise<ILayoutCategory[]> {
        const url = this.adminTagUrl + '/layout/category';
        return this.httpClient
            .get(url)
            .pipe(map((response: HttpResponse<any>) => {
                    return LayoutService.mapLayoutCategoryClient(response);
                }),
                catchError(this.handleError))
            .toPromise();
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


