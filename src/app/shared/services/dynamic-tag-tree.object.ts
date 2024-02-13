import {ITag} from "../../model/tag";
import {NGXLogger} from "ngx-logger";
import {TagTreeTag} from "../../model/tag-tree-tag";


export class DynamicTagTree {
    public static BASE_GROUP = "0";
    private _lookupDisplay = new Map<string, TagTreeTag>();
    private _lookupRelations = new Map<string, TagTreeTag>();
    private _baseStructure = new Map<string, TagTreeTag>();
    private _structuredTags: TagTreeTag[] = [];
    private logger: NGXLogger;

    constructor(displays: ITag[], relations: Map<string, ITag>) {
        for (let tag of displays) {
            // insert into lookup display
            let tagAsTreeTag = this.tagAsTreeTag(tag);
            this._lookupDisplay.set(tag.tag_id, tagAsTreeTag);
            // navigate to parent
            let parentNode = this.navigateToParent(tag.parent_id, relations);
            // add tag as child of parent
            this.addChildToParent(parentNode, tagAsTreeTag);
        }

        //MM will add sorting of tree here.
    }


    navigateToParent(parent_id: string, relations: Map<string, ITag>): TagTreeTag {
        // get parent
        let parentTag = this.getOrCreateTagForId(parent_id, relations);
        if (!parentTag.parent_id || parentTag.parent_id == "0") {
            this._baseStructure.set(parent_id, parentTag);
            this._lookupDisplay.set(parent_id, parentTag);
            return parentTag;
        }
        let grandparent = this.navigateToParent(parentTag.tag_id, relations);
        let exists = grandparent.tagGroups
            .filter(t => t.tag_id = parent_id);
        if (!exists) {
            grandparent.tagGroups.push(parentTag);
        }

        return parentTag;

    }

    content(): TagTreeTag[] {
        let tagTreeArray = [];
        this._baseStructure.forEach((v, k) => tagTreeArray.push(v));
        return tagTreeArray;
    }

    private tagAsTreeTag(tag: ITag): TagTreeTag {
        let tagTreeTag = new TagTreeTag();
        tagTreeTag.tag_id = tag.tag_id;
        tagTreeTag.name = tag.name;
        tagTreeTag.description = tag.description;
        tagTreeTag.tag_type = tag.tag_type;
        tagTreeTag.power = tag.power;
        tagTreeTag.parent_id = tag.parent_id;
        tagTreeTag.is_group = tag.is_group;
        tagTreeTag.user_id = tag.user_id;
        tagTreeTag.is_expanded = tag.is_expanded;
        tagTreeTag.is_display = tag.is_display;
        tagTreeTag.tagGroups = [];
        tagTreeTag.tagChildren = [];
        return tagTreeTag;
    }


    private addChildToParent(parent: TagTreeTag, child: TagTreeTag) {
        /* parent.tagChildren.sort((a, b) => {
             return a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase());
         } ); */
        parent.tagChildren.push(child);
    }

    private getOrCreateTagForId(parent_id: string, relations: Map<string, ITag>): TagTreeTag {
        // check in lookup display
        if (this._lookupDisplay.has(parent_id)) {
            return this._lookupDisplay.get(parent_id);
        }
        let tagAsTreeTag = this.tagAsTreeTag(relations.get(parent_id));
        this._lookupDisplay.set(parent_id, tagAsTreeTag);
        return null;
    }
}


