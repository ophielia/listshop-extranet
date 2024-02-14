import {Injectable, OnDestroy} from '@angular/core';
import {ITag} from "../../model/tag";
import {BehaviorSubject, Subscription} from "rxjs";
import {TagTree, TagTreeNode, TagTreeStructure} from "./tag-tree.object";
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
        // put into hash table - id to tag
        //   let filtered = ["373","371","88","9"];
        //  let  newdata = data.filter(t=> filtered.includes(t.tag_id))

        this._allTagHash = new Map<string, ITag>();
        data.forEach(v => this._allTagHash.set(v.tag_id, v));

        // for each tag

        // for (let entry of tagHash.entries()) {
        /*
                for (let entry of Array.from(this._allTagHash.entries())) {
                    let tag = entry[1];
                    //console.log("tag name, id, parent: " + tag.tag_id + "," + tag.name + "," + tag.parent_id);
                    if (this._groupPaths.has(tag.tag_id)) {
                        continue;
                    }
                    //      make node
                    let node = new TagTreeStructure(tag.tag_id, tag.name, tag.parent_id);
                    //      fill in path to base
                    let groupPath = this.determineGroupPath(node, tag.parent_id, this._allTagHash);
                    node.setGroupPath(groupPath);
                    //      insert into group paths
                    console.log("setting1 in groupPaths: id, path" + tag.tag_id + ", " + node.getGroupPath());
                    this._groupPaths.set(tag.tag_id, node);
                }
                ;
                console.log("done");

                for (let entry of Array.from(this._groupPaths.entries())) {
                    let tag = entry[1];
                    console.log("RESULT: tag name, id, parent, path: " + tag.tag_id + "," + tag.name + "," + tag.parent_id + " - " + tag.getGroupPath());
                }
                console.log("done");

         */
    }


    createTagTree(tagList: ITag[]) {
        let relations = new Map<string, TagTreeNode>();
        // target - constructor(displays: ITag[], relations: Map<string, TagTreeNode>) {
        // target - constructor(displays: ITag[], groupPaths: Map<string, TagTreeStructure>) {
        // for each tag, find immediate parent, and insert as child
        // filter to tag 88 (has multi heirarchy
        if (!tagList) {
            tagList = [];
        }
        //let shorterTagList = tagList.filter(t => t.tag_id == "31");

        return new DynamicTagTree(tagList, this._allTagHash);
    }

    setTagExpansion(tag_id: string, expanded: boolean) {
        this._tagTree.setTagExpansion(tag_id, expanded);
    }

    refreshGroups() {
        this.createOrRefreshTagRelations();
    }
}
