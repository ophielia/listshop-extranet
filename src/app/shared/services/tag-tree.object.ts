import TagType from "../../model/tag-type";
import {ITag, Tag} from "../../model/tag";
import {NGXLogger} from "ngx-logger";


export class TagTree {
    public static BASE_GROUP = "0";
    private _lookupDisplay = new Map<string, ITag>();
    private _lookupRelations = new Map<string, TagTreeNode>();
    private logger: NGXLogger;
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

        if (id == TagTree.BASE_GROUP && ContentType.All == contentType) {
            return this.contentListSkipRelations(groupType, tagTypes);
        } else if (id == TagTree.BASE_GROUP && ContentType.Direct == contentType) {
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
        var childrenIds = this._lookupRelations.get(tag_id).children;
        childrenIds.forEach(id => {
            var child = this._lookupDisplay.get(id);
            child.is_display = expanded;
            child.is_expanded = expanded;
        })
    }

    setTagExpansionForAll(expanded: boolean) {

        this.resetTagState();
        this._lookupDisplay.forEach(entry => {
            entry.is_expanded = expanded;
        });
    }

    resetTagState() {
        this._lookupDisplay.forEach(entry => {
            entry.is_expanded = true;
            entry.is_display = true;
        });
    }

    filterForFragment(searchFragment: string) {
        if (!searchFragment || searchFragment.trim().length == 0) {
            return;
        }
        let cleanedSearch = searchFragment.trim().toLocaleLowerCase();
        var foundIds: string[] = [];
        // search - and reset display at the same time
        this._lookupDisplay.forEach(entry => {
            var expandedAndDisplayed = false;
            if (entry.name.toLocaleLowerCase().trim().indexOf(cleanedSearch) >= 0) {
                foundIds.push(entry.parent_id);
                expandedAndDisplayed = true;
            }
            entry.is_expanded = expandedAndDisplayed;
            entry.is_display = expandedAndDisplayed;
        });
        // now expand all the way up
        var parentsToExpand = new Set<String>();
        for (let tagId of foundIds) {
            var startId = tagId;
            while (startId != TagTree.BASE_GROUP) {
                // add start id to parentsToExpand
                parentsToExpand.add(startId);
                // get tag for start id
                var parent = this._lookupDisplay.get(startId);
                parent.is_expanded = true;
                // get start id
                startId = parent.parent_id;
            }
        }

    }

    filterForUserId(userId: string) {
        this.resetTagState();
        if (!userId || userId.trim().length == 0) {
            return;
        }
        var foundIds: string[] = [];
        // search - and reset display at the same time
        this._lookupDisplay.forEach(entry => {
                console.log("Entry: tag_id: " + entry.tag_id + " user_id: " + entry.user_id)

        });
        this._lookupDisplay.forEach(entry => {
            var expandedAndDisplayed = false;
            if (entry.user_id && entry.user_id == userId) {
                foundIds.push(entry.parent_id);
                expandedAndDisplayed = true;
            }
            entry.is_expanded = expandedAndDisplayed;
            entry.is_display = expandedAndDisplayed;
        });
        // now expand all the way up
        var parentsToExpand = new Set<String>();
        for (let tagId of foundIds) {
            var startId = tagId;
            while (startId != TagTree.BASE_GROUP) {
                // add start id to parentsToExpand
                parentsToExpand.add(startId);
                // get tag for start id
                var parent = this._lookupDisplay.get(startId);
                parent.is_expanded = true;
                // get start id
                startId = parent.parent_id;
            }
        }
    }

    private contentListSkipRelations(groupType: GroupType, tagTypes: TagType[]) {
        let tagsToReturn: ITag[] = [];
        this._lookupDisplay.forEach(entry => {
            if (tagTypes.indexOf(entry.tag_type) >= 0) {
                var isgroup = entry.is_group;
                if (groupType == GroupType.All) {
                    tagsToReturn.push(entry);
                } else if (groupType == GroupType.GroupsOnly && isgroup) {
                    tagsToReturn.push(entry);
                } else if (groupType == GroupType.ExcludeGroups && isgroup) {
                    tagsToReturn.push(entry);
                }
            }
        })
        return tagsToReturn;
    }
}

export class TagTreeNode {
    tag_id: string;
    tag_type: TagType;
    is_group: boolean;
    children: string[] = [];
    private group_path: string[] = [];


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

    setGroupPath(groupPath: string[]) {
        this.group_path = groupPath;
    }

    getGroupPath(): string[] {
        return this.group_path;
    }
}

export class TagTreeStructure {
    tag_id: string;
    name: string;
    parent_id: string;
    private group_path: string[] = [];


    constructor(tag_id: string,
                name: string,
                parent_id: string) {
        this.tag_id = tag_id;
        this.name = name;
        this.parent_id = parent_id;
    }

    setGroupPath(groupPath: string[]) {
        this.group_path = groupPath;
    }

    getGroupPath(): string[] {
        return this.group_path;
    }
}
export enum ContentType {
    All,
    Direct
}

export enum GroupType {
    GroupsOnly = 1,
    ExcludeGroups = 2,
    All = 3
}
