import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ITag} from "../../../model/tag";
import {TagTreeTag} from "../../../model/tag-tree-tag";

@Component({
  selector: 'app-tags-as-list-component',
  templateUrl: './tags-as-list-component.component.html',
  styleUrls: ['./tags-as-list-component.component.scss']
})
export class TagsAsListComponentComponent implements OnInit {
    @Input() set tagList(value: ITag[]) {
        this._tagList = value;
        this.sortTagList();
    }

    get tagList(): ITag[] {
        return this._tagList;
    }

  @Input() userId: string;
  @Output() select: EventEmitter<TagTreeTag> = new EventEmitter<TagTreeTag>();

    private _tagList: ITag[];

  constructor() {
  }

  ngOnInit(): void {
  }

  selectTag(tag: ITag) {
    this.select.emit(this.quickTagTree(tag));
  }

  quickTagTree(tag: ITag) {
    let tTree = new TagTreeTag();
    tTree.tag_id = tag.tag_id;
    tTree.name = tag.name;
    return tTree;
  }

    private sortTagList() {
        this._tagList = this._tagList.sort((a, b) => {
            return a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase());
        });
    }
}
