import {Injectable, OnDestroy} from '@angular/core';
import {ITag} from "../../model/tag";
import {BehaviorSubject, Subscription} from "rxjs";
import {TagTree, TagTreeStructure} from "./tag-tree.object";
import {TagService} from "./tag.service";
import {NGXLogger} from "ngx-logger";
import {TagSearchCriteria} from "../../model/tag-search-criteria";
import {DynamicTagTree} from "./dynamic-tag-tree.object";

@Injectable({providedIn: 'root'})
export class TagTreeService implements OnDestroy {
    static instance: TagTreeService;

    isLoadingSubject: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(true);

    unsubscribe: Subscription[] = [];
    private _tagTree: TagTree;
    private _groupPaths: Map<string, TagTreeStructure> = new Map<string, TagTreeStructure>();
    private _lastLoaded: number;
    private _allTagHash: Map<string, ITag>;

    constructor(private tagService: TagService,
                private logger: NGXLogger) {
        // If the static reference doesn't exist
        // (i.e. the class has never been instantiated before)
        // set it to the newly instantiated object of this class
        if (!TagTreeService.instance) {
            this.createOrRefreshTagRelations();
            TagTreeService.instance = this;
        }

        // Return the static instance of the class
        // Which will only ever be the first instance
        // Due to the if statement above
        return TagTreeService.instance;
    }


    ngOnDestroy() {
        this.unsubscribe.forEach(s => s.unsubscribe());
    }

    private createOrRefreshTagRelations() {
        this.isLoadingSubject.next(true);
        let criteria = new TagSearchCriteria();
        criteria.group_include = 'ONLY';
        const promise = this.tagService.getTagListForCriteria(criteria);
        console.log(promise);

        promise.then((data) => {
            this.logger.debug("tag group data retrieved, building structure");
            this.createGroupPaths(data);
            this._lastLoaded = new Date().getTime();
            this.isLoadingSubject.next(false);

        }).catch((error) => {
            console.log("Promise rejected with " + JSON.stringify(error));
        });
    }

    private createGroupPaths(data: ITag[]) {
        this._allTagHash = new Map<string, ITag>();
        data.forEach(v => this._allTagHash.set(v.tag_id, v));

    }


    createTagTree(tagList: ITag[]) {

        // target - constructor(displays: ITag[], relations: Map<string, TagTreeNode>) {
        // target - constructor(displays: ITag[], groupPaths: Map<string, TagTreeStructure>) {
        // for each tag, find immediate parent, and insert as child
        // filter to tag 88 (has multi heirarchy
        if (!tagList) {
            tagList = [];
        }
        // let shorterTagList = tagList.filter(t => t.tag_id == "31");

        return new DynamicTagTree(tagList, this._allTagHash);
    }

    setTagExpansion(tag_id: string, expanded: boolean) {
        this._tagTree.setTagExpansion(tag_id, expanded);
    }

    refreshGroups() {
        this.createOrRefreshTagRelations();
    }
}
