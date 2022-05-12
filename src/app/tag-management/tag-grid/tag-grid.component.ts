import {Component, OnDestroy, OnInit} from '@angular/core';
import {ContentType, GroupType, TagTree} from "../../shared/services/tag-tree.object";
import TagType from "../../model/tag-type";
import {TagTreeService} from "../../shared/services/tag-tree.service";
import {NGXLogger} from "ngx-logger";
import {ITag} from "../../model/tag";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-tag-grid',
  templateUrl: './tag-grid.component.html',
  styleUrls: ['./tag-grid.component.scss']
})
export class TagGridComponent implements OnInit, OnDestroy {
  unsubscribe: Subscription[] = [];
  groupType: GroupType = GroupType.All;
  tagTypes: TagType[] = [TagType.Ingredient]
  allTagTypes: TagType[];
  tagList: ITag[] = [];
  selectedTags: ITag[] = [];
  searchFragment: string;
  loaded: boolean = false;

  constructor(private logger: NGXLogger,
              private tagTreeService: TagTreeService) {
    this.allTagTypes = TagType.listAll();
  }

  ngOnInit(): void {
    this.groupType = GroupType.All;

    let $sub = this.tagTreeService.allContentList(TagTree.BASE_GROUP,
        ContentType.Direct, false, this.groupType, this.tagTypes)
        .subscribe(data => {
          this.logger.debug("in subscribe in tag-select. data: " + data.length)
          this.tagList = data;
          this.loaded = true;
        });
    this.unsubscribe.push($sub);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach(s => s.unsubscribe());

  }

  expandOrCollapseGrid(expand: boolean) {
    this.tagTreeService.setExpansionForAllNodes(expand);
  }

  searchTags() {
    this.tagTreeService.findByFragment(this.searchFragment);
  }

  selectTag(tag: ITag) {
    console.log("tag selected in grid:" + tag.tag_id);
    this.selectedTags.push(tag);
  }

  unSelectTag(tagid: string) {
    this.selectedTags = this.selectedTags.filter(t => t.tag_id != tagid);
  }
}
