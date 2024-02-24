import {Injectable} from "@angular/core";
import {catchError, map} from "rxjs/operators";
import {NGXLogger} from "ngx-logger";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {environment} from "../../../environments/environment";
import {ITag, Tag} from "../../model/tag";
import MappingUtils from "../../model/mapping-utils";
import {ITagOperationPut} from "../../model/tag-operation-put";
import TagOperationType from "../../model/tag-operation-type";
import TagType from "../../model/tag-type";
import {TagSearchCriteria} from "../../model/tag-search-criteria";
import {TagTreeTag} from "../../model/tag-tree-tag";


@Injectable()
export class TagService {

    private adminTagUrl;
    private standardTagUrl;

    constructor(
        private httpClient: HttpClient,
        private logger: NGXLogger
    ) {
        this.adminTagUrl = environment.apiUrl + "admin/tag";
        this.standardTagUrl = environment.apiUrl + "tag";
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

    getTagListForCriteria(searchCriteria: TagSearchCriteria): Promise<ITag[]> {
        this.logger.debug("Retrieving tags for tag tool");
        // replace "all" user criteria with null
        if (searchCriteria.user_id == "-1") {
            searchCriteria.user_id = null;
        }
        var url = `${this.adminTagUrl}/search`;

        return this.httpClient
            .post(`${url}`, JSON.stringify(searchCriteria))
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

    assignTagsToParent(tagIds: string[], parentId: string) {
        let tagIdString = tagIds.join(",");
        let url = `${this.adminTagUrl}/${parentId}/children?tagIds=${tagIdString}`
        return this
            .httpClient
            .post(url, {observe: 'response'});

    }

    createTag(name: string, parentId: string, tagType: TagType, addAsGroup: boolean, forUser: boolean) {
        var newTag: ITag = <ITag>({
            name: name,
            tag_type: tagType,
            is_group: addAsGroup
        });
        let forUserFilter = forUser ? "" : "?asStandard=true";
        let url = `${this.standardTagUrl}/${parentId}/child${forUserFilter}`;
        return this
            .httpClient
            .post(url,
                JSON.stringify(newTag), {observe: 'response'});
    }

    changeTagName(newName: string, tag: TagTreeTag) {
        var newTag: Tag = <Tag>({
            name: newName,
            is_group: tag.is_group,
            tag_type: tag.tag_type
        });
        let url = `${this.adminTagUrl}/${tag.tag_id}`;
        return this
            .httpClient
            .put(url,
                JSON.stringify(newTag), {observe: 'response'});
    }

    moveGroupToBase(tag_id: string) {
        let url = `${this.adminTagUrl}/base/${tag_id}`;
        return this
            .httpClient
            .put(url, {observe: 'response'});
    }
}


