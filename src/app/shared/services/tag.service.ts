import {Injectable} from "@angular/core";
import {catchError, map} from "rxjs/operators";
import {NGXLogger} from "ngx-logger";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {environment} from "../../../environments/environment";
import {ITag} from "../../model/tag";
import MappingUtils from "../../model/mapping-utils";
import {ITagOperationPut} from "../../model/tag-operation-put";
import TagOperationType from "../../model/tag-operation-type";


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

    getTagsForTagTree(): Promise<ITag[]> {
        this.logger.debug("Retrieving all tags");
        var url = this.adminTagUrl + "/standard/grid";


        return this.httpClient
            .get(`${url}`)
            .pipe(map((response: HttpResponse<any>) => {
                    return TagService.mapTagsClient(response);
                }),
                catchError(TagService.handleError))
            .toPromise();

    }

    getTagList(userId: string, forReview: boolean): Promise<ITag[]> {
        this.logger.debug("Retrieving tags for reviewlist");
        var reviewClause = forReview ? "?filter=ToReview" : ""
        var url = this.adminTagUrl + "/standard/list" + reviewClause;
        if (userId) {
            var url = this.adminTagUrl + "/user/" + userId + "/list" + reviewClause;
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


    markTagsAsReviewed(tagIds: string[]) {
        var tagOperationPut: ITagOperationPut = <ITagOperationPut>({
            tag_ids: tagIds,
            tag_operation_type: TagOperationType.MarkAsReviewed
        });

        return this
            .httpClient
            .put(this.adminTagUrl,
                JSON.stringify(tagOperationPut), {observe: 'response'});
    }

    assignTagToUser(tagIds: string[], userId: string) {
        var tagOperationPut: ITagOperationPut = <ITagOperationPut>({
            tag_ids: tagIds,
            user_id: userId,
            tag_operation_type: TagOperationType.AssignToUser
        });
        return this
            .httpClient
            .put(this.adminTagUrl,
                JSON.stringify(tagOperationPut), {observe: 'response'});

    }

    createStandardFromUserTags(tagIds: string[]) {
        var tagOperationPut: ITagOperationPut = <ITagOperationPut>({
            tag_ids: tagIds,
            tag_operation_type: TagOperationType.CopyToStandard
        });
        return this
            .httpClient
            .put(this.adminTagUrl,
                JSON.stringify(tagOperationPut), {observe: 'response'});


    }
}


