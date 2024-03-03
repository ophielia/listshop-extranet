import {Injectable, OnDestroy} from "@angular/core";
import {NGXLogger} from "ngx-logger";
import {TagSearchCriteria} from "../../model/tag-search-criteria";
import DisplayType from "../../model/display-type";


@Injectable()
export class TagSearchContext implements OnDestroy {
// search fragment is in tagCriteria and should set searchFragment
    // user is in tagCriteria and should set tagUserIdFilter
    // tagtype just in tagCriteria
    // group include set in tagCriteria, and should set this.includeGroups ( this.tagSearchCriteria.group_include = this.includeGroups ? 'IGNORE' : 'EXCLUDE';)
    //  internal status only in tagCriteria
    private _tagSearchCriteria: TagSearchCriteria;
    private _displayType: DisplayType = DisplayType.List;


    constructor(
        private logger: NGXLogger
    ) {
        this._tagSearchCriteria = new TagSearchCriteria();

    }

    ngOnDestroy(): void {
        this._tagSearchCriteria = null;
        this._displayType = null;
    }


    get tagSearchCriteria(): TagSearchCriteria {
        return this._tagSearchCriteria;
    }

    set tagSearchCriteria(value: TagSearchCriteria) {
        this._tagSearchCriteria = value;
    }

    get displayType(): DisplayType {
        return this._displayType;
    }

    set displayType(value: DisplayType) {
        this._displayType = value;
    }
}
