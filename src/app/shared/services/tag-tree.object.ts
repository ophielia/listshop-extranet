import TagType from "../../model/tag-type";
import {ITag, Tag} from "../../model/tag";


export class TagTree {
    public static BASE_GROUP = "0";
    private _lookupDisplay = new Map<string, ITag>();
    private _lookupRelations = new Map<string, TagTreeNode>();

    constructor(tags: ITag[]) {

        for (let i = 0; i < tags.length; i++) {
            let tag = tags[i];
            // put display in _lookupDisplay (just tag info)
            this._lookupDisplay.set(tag.tag_id, tag);
            // fill in relations (nodes) in _lookupRelations
            var existingRelation = this._lookupRelations.get(tag.tag_id);
            if (existingRelation) {
                existingRelation.tag_type = tag.tag_type;
                existingRelation.tag_id = tag.tag_id;
                existingRelation.is_group = tag.is_group;
            } else {
                var node = new TagTreeNode(tag.tag_id, tag.tag_type, tag.is_group);
                this._lookupRelations.set(tag.tag_id, node);
            }
            // add to parent
            this.addTagToParentNode(tag);
        }

        // fill in base tag display
        var baseDisplay = this._lookupDisplay.get(TagTree.BASE_GROUP);
        if (!baseDisplay) {
            baseDisplay = new Tag();
        }
        baseDisplay.name = "All";
    }

    private addTagToParentNode(tag: ITag) {
        let parentId = tag.parent_id ? tag.parent_id : TagTree.BASE_GROUP;
        // pull parent node
        var parent = this._lookupRelations.get(parentId);

        if (!parent) {
            // doesn't exist - make node with dummy values
            parent = new TagTreeNode("", "", false);
        }
        // add child tag
        parent.children.push(tag.tag_id);
        // set node in dictionary
        this._lookupRelations.set(parentId, parent);

    }


    navigationList(tagId: string): ITag[] {
        // navigation list
        var returnList: ITag[] = [];

        var navDisplay = this._lookupDisplay.get(tagId);
        if (!navDisplay) {
            return returnList;
        }

        if (tagId == TagTree.BASE_GROUP) {
            returnList.push(navDisplay);
            return returnList;
        }

        var parentId = navDisplay.tag_id ? navDisplay.parent_id : "0";
        var safety = 0;
        do {
            // get the node of parent id
            let parentDisplay = this._lookupDisplay.get(parentId);
            if (parentDisplay) {
                returnList.unshift(parentDisplay);// add the display at the beginning of the array

                // set the parent id
                parentId = parentDisplay.tag_id ? parentDisplay.parent_id : TagTree.BASE_GROUP;

            }
            safety++;

        }
        while (safety < 50 && parentId != "0");

        // add all display at the beginning
        var allDisplay = new Tag();
        allDisplay.tag_id = TagTree.BASE_GROUP;
        allDisplay.name = "All";
        returnList.unshift(allDisplay);

        returnList.push(navDisplay);
        return returnList;
    }


    contentList(id: string, contentType: ContentType, isAbbreviated: boolean, groupType: GroupType, tagTypes: TagType[]): ITag[] {
        let requestedNode = this._lookupRelations.get(id);
        if (!requestedNode) {
            return [];
        }

        if (id == TagTree.BASE_GROUP) {
            return this.baseContentList(isAbbreviated, contentType, groupType, tagTypes);
        }

        // gather all tags belonging to id
        var allChildrenTags;
        if (contentType == ContentType.All) {
            allChildrenTags = this.allTags(requestedNode, groupType);
        } else {
            allChildrenTags = this.directTags(requestedNode, groupType);
        }

        return this.nodesToDisplays(allChildrenTags, groupType);
    }

    private allTags(node: TagTreeNode, groupType: GroupType): TagTreeNode[] {
        var allOfThem: TagTreeNode[] = [];
        for (var i = 0; i < node.children.length; i++) {
            var childNodeId = node.children[i];
            var childNode = this._lookupRelations.get(childNodeId);

            if (childNode.isGroup()) {
                allOfThem = allOfThem.concat(this.allTags(childNode, groupType));
                if (groupType != GroupType.ExcludeGroups) {
                    allOfThem.push(childNode);
                }
            } else if (groupType != GroupType.GroupsOnly) {
                allOfThem.push(childNode);
            }

        }
        return allOfThem;
    }

    private directTags(node: TagTreeNode, groupType: GroupType): TagTreeNode[] {
        var allOfThem: TagTreeNode[] = [];
        for (var i = 0; i < node.children.length; i++) {
            var childNodeId = node.children[i];
            var childNode = this._lookupRelations.get(childNodeId);

            if (childNode.isGroup() && groupType != GroupType.ExcludeGroups) {
                allOfThem.push(childNode);
            } else if (groupType != GroupType.GroupsOnly) {
                allOfThem.push(childNode);
            }

        }
        return allOfThem;
    }

    private baseContentList(isAbbreviated: boolean, contentType: ContentType, groupType: GroupType, tagTypes: TagType[]): ITag[] {
        var baseNode = this._lookupRelations.get(TagTree.BASE_GROUP);
        if (!baseNode) {
            return [];
        }


        var filteredChildren: TagTreeNode[] = [];
        for (var i = 0; i < baseNode.children.length; i++) {
            var childId = baseNode.children[i];
            var childNode = this._lookupRelations.get(childId);
            if (!childNode) {
                continue;
            }
            var childNodeMatch = tagTypes.indexOf(childNode.tag_type) >= 0;

            if (!childNodeMatch) {
                continue;
            }

            if (childNode.isGroup() && contentType == ContentType.All) {
                filteredChildren = filteredChildren.concat(this.allTags(childNode, groupType));
            } else if (childNode.isGroup() && contentType == ContentType.All) {
                filteredChildren = filteredChildren.concat(this.directTags(childNode, groupType));
            } else {
                filteredChildren.push(childNode);
            }


        }

        return this.nodesToDisplays(filteredChildren, groupType);
    }


    private nodesToDisplays(nodes: TagTreeNode[], groupType: GroupType) {
        // put into set
        var allTagSet = new Set<TagTreeNode>();
        nodes.forEach(tagNode => {
            allTagSet.add(tagNode);
        });

        // separate into childTags and childGroups (displays)
        var childTags: ITag[] = [];
        var childGroups: ITag[] = [];
        allTagSet.forEach((node: TagTreeNode) => {
            var nodeId = node.tag_id;
            var display = this._lookupDisplay.get(nodeId);
            if (display) {

                if (node.isGroup() && groupType != GroupType.ExcludeGroups) {
                    display.is_group = true;
                    childGroups.push(display);
                } else if (!node.isGroup() && groupType != GroupType.GroupsOnly) {
                    childTags.push(display);
                }
            }
        });

        // append both arrays together
        childTags.sort((a, b) => {
            return a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase());
        });
        childGroups.sort((a, b) => {
            return a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase());
        });

        return childGroups.concat(childTags);

    }

    setTagExpansion(tag_id: string, expanded: boolean) {
        var display = this._lookupDisplay.get(tag_id);
        display.is_expanded = expanded;
        this._lookupDisplay.set(tag_id, display);
    }
}

export class TagTreeNode {
    tag_id: string;
    tag_type: TagType;
    is_group: boolean;
    children: string[] = [];


    constructor(tag_id: string,
                tag_type: string,
                is_group: boolean) {
        this.tag_id = tag_id;
        this.tag_type = tag_type;
        this.is_group = is_group;
    }


    isGroup(): boolean {
        return this.is_group;
    }
}

export enum ContentType {
    All,
    Direct
}

export enum GroupType {
    GroupsOnly,
    ExcludeGroups = 1,
    All = 2
}
