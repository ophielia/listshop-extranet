import {Component, Input, OnInit} from '@angular/core';
import {ITag} from "../../model/tag";

@Component({
  selector: 'app-tags-as-list-component',
  templateUrl: './tags-as-list-component.component.html',
  styleUrls: ['./tags-as-list-component.component.scss']
})
export class TagsAsListComponentComponent implements OnInit {
  @Input() tagList: ITag[];
  @Input() userId: string;

  constructor() {
  }

  ngOnInit(): void {
  }


  selectTag(tag: ITag) {
    window.alert("tag is " + tag.name);
  }
}
