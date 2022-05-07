import {Injectable} from "@angular/core";
import {catchError, map} from "rxjs/operators";
import {NGXLogger} from "ngx-logger";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {environment} from "../../../environments/environment";
import {ITag} from "../../model/tag";
import MappingUtils from "../../model/mapping-utils";


@Injectable()
export class TagService {

    private adminTagUrl;

    constructor(
        private httpClient: HttpClient,
        private logger: NGXLogger
    ) {
        this.adminTagUrl = environment.apiUrl + "admin/tag";
    }

    getById(tag_id: string): Promise<ITag> {
        let url = this.adminTagUrl + "/" + tag_id;
        return this.httpClient
            .get(url)
            .pipe(map((response: HttpResponse<any>) => {
                return TagService.mapTagClient(response);
            }),
                catchError(TagService.handleError))
            .toPromise();
    }

    getAllExtendedTags(): Promise<ITag[]> {
        this.logger.debug("Retrieving all tags");
        var url = this.adminTagUrl + "?extended=true";


        return this.httpClient
            .get(`${url}`)
            .pipe(map((response: HttpResponse<any>) => {
                    return TagService.mapTagsClient(response);
                }),
                catchError(TagService.handleError))
            .toPromise();

    }

    getTagList(userId: string, forReview: boolean): Promise<ITag[]> {
        this.logger.debug("Retrieving tags for list");
        var url = this.adminTagUrl + "/standard/list";
        if (userId) {
            var url = this.adminTagUrl + "/user/" + userId + "/list";
        }

        return this.httpClient
            .get(`${url}`)
            .pipe(map((response: HttpResponse<any>) => {
                    return TagService.mapTagsClient(response);
                }),
                catchError(TagService.handleError))
            .toPromise();
    }

    addTag(newTagName: string, tagType: string): Observable<HttpResponse<Object>> {
        var newTag: ITag = <ITag>({
            name: newTagName,
            tag_type: tagType
        });

        return this
            .httpClient
            .post(this.adminTagUrl,
                JSON.stringify(newTag), {observe: 'response'});

    }

    static mapTagsClient(object: Object): ITag[] {
        let embeddedObj = object["_embedded"];
        return embeddedObj["tagResourceList"].map(MappingUtils.toTag);
    }

    static mapTagClient(object: Object): ITag {
        return MappingUtils.toTag(object);
    }

    static handleError(error: any) {
        // log error
        // could be something more sophisticated
        let errorMsg = error.message || `Yikes! There was a problem with our hyperdrive device and we couldn't retrieve your data!`
        console.error(errorMsg);

        // throw an application level error
        return throwError(error);
    }


}


