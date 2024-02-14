import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ITag} from "../../model/tag";
import {TagTreeService} from "../../shared/services/tag-tree.service";
import {DynamicTagTree} from "../../shared/services/dynamic-tag-tree.object";
import {TagTreeTag} from "../../model/tag-tree-tag";

@Component({
    selector: 'app-tags-as-grid-component',
    templateUrl: './tags-as-grid-component.component.html',
    styleUrls: ['./tags-as-grid-component.component.scss']
})
export class TagsAsGridComponentComponent implements OnInit {
    @Input() tagList: ITag[];
    @Input() userId: string;
    @Output() select: EventEmitter<TagTreeTag> = new EventEmitter<TagTreeTag>();

    treeList: TagTreeTag[];
    tagTree: DynamicTagTree;

    constructor(private tagTreeService: TagTreeService,) {
    }

    ngOnInit(): void {
        this.createTagTree();
    }

    createTagTree() {
        this.tagTree = this.tagTreeService.createTagTree(this.tagList);
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
}
