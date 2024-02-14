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
            if (tag.is_group == true) {
                console.log("skipping group");
                continue;
            }
            if (!tag.tag_id) {
                console.log("skipping undefined tag id");
                continue;
            }
            // insert into lookup display
            let tagAsTreeTag = this.tagAsTreeTag(tag);
            this._lookupDisplay.set(tag.tag_id, tagAsTreeTag);
            if (!tag.parent_id || !relations.has(tag.parent_id)) {
                continue;
            }
            // navigate to parent
            let parentNode = this.navigateToParent(tag.parent_id, relations);
            // add tag as child of parent
            this.addChildToParent(parentNode, tagAsTreeTag);
        }

        this._baseStructure.forEach((v, k) => this.sortTag(v));

    }


    navigateToParent(parent_id: string, relations: Map<string, ITag>): TagTreeTag {
        // get parent
        let parentTag = this.getOrCreateTagForId(parent_id, relations);
        if (!parentTag.parent_id || parentTag.parent_id == "0") {
            this._baseStructure.set(parent_id, parentTag);
            this._lookupDisplay.set(parent_id, parentTag);
            return parentTag;
        }
        let grandparent = this.navigateToParent(parentTag.parent_id, relations);
        let exists = grandparent.tagGroups
            .filter(t => t.tag_id == parent_id);
        if (exists.length == 0) {
            grandparent.tagGroups.push(parentTag);
        }

        return parentTag;

    }

    content(): TagTreeTag[] {
        let tagTreeArray = [];
        this._baseStructure.forEach((v, k) => tagTreeArray.push(v));
        return tagTreeArray.sort((a, b) => {
            return a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase());
        });
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
        tagTreeTag.is_display = true;
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
        return tagAsTreeTag;
    }

    toggleExpand(tag: TagTreeTag) {
        if (!this._lookupDisplay.has(tag.tag_id)) {
            return;
        }
        let toExpand = this._lookupDisplay.get(tag.tag_id);
        toExpand.is_expanded = !toExpand.is_expanded;
    }

    private sortTag(tag: TagTreeTag) {
        // sort group list
        if (tag.tagGroups.length > 0) {
            tag.tagGroups = tag.tagGroups.sort((a, b) => {
                return a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase());
            });
            tag.tagGroups.forEach(g => this.sortTag(g));
        }
        // sort children
        if (tag.tagChildren.length > 0) {
            tag.tagChildren = tag.tagChildren.sort((a, b) => {
                return a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase());
            });
        }


    }

    expandOrCollapseAll(expandAll: boolean) {
        this._baseStructure.forEach((v, k) => v.is_expanded = expandAll);

    }
}


