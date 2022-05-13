import {Component, OnDestroy, OnInit} from '@angular/core';
import {ContentType, GroupType, TagTree} from "../../shared/services/tag-tree.object";
import TagType from "../../model/tag-type";
import {TagTreeService} from "../../shared/services/tag-tree.service";
import {NGXLogger} from "ngx-logger";
import {ITag} from "../../model/tag";
import {Subscription} from "rxjs";
import {TagService} from "../../shared/services/tag.service";

@Component({
  selector: 'app-tag-grid',
  templateUrl: './tag-grid.component.html',
  styleUrls: ['./tag-grid.component.scss']
})
export class TagGridComponent implements OnInit, OnDestroy {
  unsubscribe: Subscription[] = [];
  groupType: GroupType = GroupType.All;
  selectGroupType: GroupType = GroupType.GroupsOnly;
  tagTypes: TagType[] = [TagType.Ingredient]
  allTagTypes: TagType[];
  tagList: ITag[] = [];
  selectedTags: ITag[] = [];
  searchFragment: string;
  userIdForAssign: string;

  showAddToUser = false;
  loaded: boolean = false;
  private assignTddagId: string;
  private assignTag: ITag;
  showChangeParent: boolean = false;

  constructor(private logger: NGXLogger,
              private tagService: TagService,
              private tagTreeService: TagTreeService) {
    this.allTagTypes = TagType.listAll();
  }

  ngOnInit(): void {
    this.retrieveListForGrid();
  }

  ngOnDestroy() {
    this.unsubscribe.forEach(s => s.unsubscribe());
  }

  retrieveListForGrid() {
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

  refreshGrid() {
    this.tagTreeService.refreshTagTree();
  }

  expandOrCollapseGrid(expand: boolean) {
    this.searchFragment = "";
    this.tagTreeService.setExpansionForAllNodes(expand);
  }

  searchTags() {
    this.tagTreeService.findByFragment(this.searchFragment);
  }

  assignSelectedToUser(userId: string) {
    if (this.selectedTags.length == 0) {
      this.showAddToUser = false;
      return;
    }
    let tagIds = this.selectedTags.map(t => t.tag_id);
    this.tagService.assignTagToUser(tagIds, userId).subscribe(r => {
      this.refreshGrid();
      this.selectedTags = [];
      this.showAddToUser = false;
    });
  }

  assignSelectedToParent() {
    if (this.selectedTags.length == 0 ||
        !this.assignTag) {
      this.showChangeParent = false;
      return;
    }
    let tagIds = this.selectedTags.map(t => t.tag_id);
    this.tagService.assignTagsToParent(tagIds, this.assignTag.tag_id).subscribe(r => {
      this.refreshGrid();
      this.selectedTags = [];
      this.showChangeParent = false;
      this.assignTag = null;
    });
  }

  selectTag(tag: ITag) {
    console.log("tag selected in grid:" + tag.tag_id);
    this.selectedTags.push(tag);
  }

  unSelectTag(tagid: string) {
    this.selectedTags = this.selectedTags.filter(t => t.tag_id != tagid);
  }

  toggleShowAssign() {
    this.showAddToUser = !this.showAddToUser;
  }

  toggleShowChangeParent() {
    this.showChangeParent = !this.showChangeParent;
    this.assignTag = null;
  }

  selectTagForAssign(tag: ITag) {
    this.assignTag = tag;
  }


}
