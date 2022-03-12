import {Injectable, OnDestroy} from '@angular/core';
import TagType from "../../model/tag-type";
import {ITag} from "../../model/tag";
import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {filter, map} from "rxjs/operators";
import {ContentType, GroupType, TagTree} from "./tag-tree.object";
import {TagService} from "./tag.service";
import {NGXLogger} from "ngx-logger";
import TagSelectType from "../../model/tag-select-type";

@Injectable({providedIn: 'root'})
export class TagTreeService implements OnDestroy {
    static instance: TagTreeService;
    static refreshPeriod = 5 * 60 * 1000;

    isLoadingSubject: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(true);

    unsubscribe: Subscription[] = [];
    private _tagTree: TagTree;
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

    navigationList(tagId: string): Observable<ITag[]> {
        let observable = this.finishedLoadingObservable();

        return observable.pipe(map((response: boolean) => {
            this.logger.debug("tag tree loaded, now returning.");
            return this._tagTree.navigationList(tagId);
        }));


    }


    allContentList(id: string, contentType: ContentType, isAbbreviated: boolean, groupType: GroupType,
                   tagTypes: TagType[], tagSelectType: TagSelectType): Observable<ITag[]> {


        this.refreshTagTreeIfNeeded();
        let observable = this.finishedLoadingObservable();

        return observable.pipe(map((response: boolean) => {
            this.logger.debug("loaded, now returning.");
            return this._tagTree.contentList(id, contentType, isAbbreviated, groupType, tagTypes, tagSelectType);
        }));


    }


    finishedLoadingObservable() {
        return this.isLoadingSubject.asObservable()
            .pipe(filter(value => value == false));
    }

    private createOrRefreshTagTree() {
        this.isLoadingSubject.next(true);


        const promise = this.tagService.getAllExtendedTags();
        console.log(promise);
        promise.then((data) => {
            this.logger.debug("tag data retrieved, building TagTree");
            this._tagTree = new TagTree(data);
            this._lastLoaded = new Date().getTime();
            this.isLoadingSubject.next(false);

        }).catch((error) => {
            console.log("Promise rejected with " + JSON.stringify(error));
        });


    }

    refreshTagTreeIfNeeded() {
        var limit = this._lastLoaded + TagTreeService.refreshPeriod;
        if ((new Date().getTime()) > limit) {
            this.logger.debug("refreshing TagTree");
            this.createOrRefreshTagTree();
        }
        ;
    }


}
