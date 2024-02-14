import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ITag} from "../../../model/tag";
import {TagTreeTag} from "../../../model/tag-tree-tag";
import {DynamicTagTree} from "../../services/dynamic-tag-tree.object";
import {TagTreeService} from "../../services/tag-tree.service";

@Component({
    selector: 'app-tags-as-grid-component',
    templateUrl: './tags-as-grid-component.component.html',
    styleUrls: ['./tags-as-grid-component.component.scss']
})
export class TagsAsGridComponentComponent implements OnInit {

    @Input() set tagList(value: ITag[]) {
        this._tagList = value;
        this.createTagTree();
    };

    @Input() set expandAll(value: boolean) {
        this._expandAll = value;
        this.expandOrCollapseGroups();
    };
    @Input() userId: string;
    @Output() select: EventEmitter<TagTreeTag> = new EventEmitter<TagTreeTag>();

    treeList: TagTreeTag[];
    tagTree: DynamicTagTree;

    private _tagList;
    private _expandAll = false;
    constructor(private tagTreeService: TagTreeService,) {
    }

    ngOnInit(): void {
        this.createTagTree();
    }

    createTagTree() {
        this.tagTree = this.tagTreeService.createTagTree(this._tagList);
        console.log("tag tree created");
        this.treeList = this.tagTree.content();
        console.log("tree list content call done");
    }

    selectTag(tag: TagTreeTag) {
        this.select.emit(tag);
    }

    expandTag(tag: TagTreeTag) {
        console.log("found expand");
        this.tagTree.toggleExpand(tag);
    }

    private expandOrCollapseGroups() {
        this.tagTree.expandOrCollapseAll(this._expandAll);
    }
}
