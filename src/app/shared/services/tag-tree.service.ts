import {Injectable, OnDestroy} from '@angular/core';
import TagType from "../../model/tag-type";
import {ITag} from "../../model/tag";
import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {filter, map} from "rxjs/operators";
import {ContentType, GroupType, TagTree, TagTreeStructure} from "./tag-tree.object";
import {TagService} from "./tag.service";
import {NGXLogger} from "ngx-logger";
import {TagSearchCriteria} from "../../model/tag-search-criteria";

@Injectable({providedIn: 'root'})
export class TagTreeService implements OnDestroy {
    static instance: TagTreeService;
    static refreshPeriod = 5 * 60 * 1000;

    isLoadingSubject: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(true);

    unsubscribe: Subscription[] = [];
    private _tagTree: TagTree;
    private _groupPaths: Map<string, TagTreeStructure> = new Map<string, TagTreeStructure>();
    private _lastLoaded: number;

    constructor(private tagService: TagService,
                private logger: NGXLogger) {
        // If the static reference doesn't exist
        // (i.e. the class has never been instantiated before)
        // set it to the newly instantiated object of this class
        if (!TagTreeService.instance) {
            this.createOrRefreshTagTree();
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

    private createOrRefreshTagTree() {
        this.isLoadingSubject.next(true);
        let criteria = new TagSearchCriteria();
        criteria.group_include = 'ONLY';
        criteria.tag_types = [TagType.Ingredient];
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

        let tagHash = new Map<string, ITag>();
        data.forEach(v => tagHash.set(v.tag_id, v));

        // for each tag

        // for (let entry of tagHash.entries()) {

        for (let entry of Array.from(tagHash.entries())) {
            let tag = entry[1];
            //console.log("tag name, id, parent: " + tag.tag_id + "," + tag.name + "," + tag.parent_id);
            if (this._groupPaths.has(tag.tag_id)) {
                continue;
            }
            //      make node
            let node = new TagTreeStructure(tag.tag_id, tag.name, tag.parent_id);
            //      fill in path to base
            let groupPath = this.determineGroupPath(node, tag.parent_id, tagHash);
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
    }

    private determineGroupPath(node: TagTreeStructure, parentId: string, allTags: Map<string, ITag>): string[] {
        // if 0 (base) return array with one value - 0
        if (!parentId || parentId == "0") {
            return ["0"];
        }

        if (this._groupPaths.has(parentId)) {
            let returnArray = [parentId];
            this._groupPaths.get(parentId).getGroupPath().forEach(id => returnArray.push(id));
            // path.unshift(parentId);
            return returnArray;
        }

        // otherwise
        // make node for parent
        // find parent tag in allTags to access parent id
        let parentTag = allTags.get(parentId);
        let parentNode = new TagTreeStructure(parentTag.tag_id, parentTag.name, parentTag.parent_id);
        // call determineGroupPath to get group paths

        let path = this.determineGroupPath(parentNode, parentTag.parent_id, allTags);
        // set group path in node, and save in master groupPaths
        parentNode.setGroupPath(path);
        console.log("setting2 in groupPaths: id, path" + parentTag.tag_id + ", " + parentNode.getGroupPath());
        this._groupPaths.set(parentId, parentNode);
        // add parentId at first position in group path, and return
        let returnArray = [parentId];
        path.forEach(id => returnArray.push(id));
        // path.unshift(parentId);
        return returnArray;
    }

    navigationList(tagId: string): Observable<ITag[]> {
        let observable = this.finishedLoadingObservable();

        return observable.pipe(map((response: boolean) => {
            this.logger.debug("tag tree loaded, now returning.");
            return this._tagTree.navigationList(tagId);
        }));


    }


    allContentList(userId: string, id: string, contentType: ContentType, isAbbreviated: boolean, groupType: GroupType,
                   tagTypes: TagType[]): Observable<ITag[]> {


        this.refreshTagTreeIfNeeded(userId);
        let observable = this.finishedLoadingObservable();

        return observable.pipe(map((response: boolean) => {
            //this.logger.debug("loaded, now returning.");

            return this._tagTree.contentList(id, contentType, isAbbreviated, groupType, tagTypes);
        }));


    }


    finishedLoadingObservable() {
        return this.isLoadingSubject.asObservable()
            .pipe(filter(value => value == false));
    }



    refreshTagTreeIfNeeded(userId: string) {
        var limit = this._lastLoaded + TagTreeService.refreshPeriod;
        if ((new Date().getTime()) > limit) {
            this.logger.debug("refreshing TagTree");
            // this.createOrRefreshTagTree(userId);
        }
        ;
    }

    refreshTagTree(userId: string) {
        // this.createOrRefreshTagTree(userId);
    }


    setTagExpansion(tag_id: string, expanded: boolean) {
        this._tagTree.setTagExpansion(tag_id, expanded);
    }

    setExpansionForAllNodes(expand: boolean) {
        this._tagTree.setTagExpansionForAll(expand);
    }

    findByFragment(searchFragment: string) {
        this._tagTree.filterForFragment(searchFragment);
    }

    filterByUserId(userId: string) {
        this._tagTree.filterForUserId(userId);
    }


}
