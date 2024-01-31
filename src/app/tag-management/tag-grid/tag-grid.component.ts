import {Component, OnDestroy, OnInit} from '@angular/core';
import {ContentType, GroupType, TagTree} from "../../shared/services/tag-tree.object";
import TagType from "../../model/tag-type";
import {TagTreeService} from "../../shared/services/tag-tree.service";
import {NGXLogger} from "ngx-logger";
import {ITag} from "../../model/tag";
import {Subscription} from "rxjs";
import {TagService} from "../../shared/services/tag.service";
import {Router} from "@angular/router";
import {UserService} from "../../shared/services/user.service";
import {IAdminUser} from "../../model/admin-user";

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
  usersWithTags: IAdminUser[] = [];
  selectedTags: ITag[] = [];
  searchFragment: string;
  tagUserIdFilter: string;
  userIdForAssign: string;
  ingredient = TagType.Ingredient;
  tagtype = TagType.TagType;
  nonEdible = TagType.NonEdible;
  rating = TagType.Rating
  tagNameEntry: string;
  addAsGroup: boolean;
  userId: string = null;
  userName: string = null;

  showAddToUser = false;
  loaded: boolean = false;
  assignTag: ITag;
  showChangeParent: boolean = false;
  showCreateTag: boolean;
  showChangeTagName: boolean;
  showUserFilter: boolean;

  constructor(private logger: NGXLogger,
              private tagService: TagService,
              private router: Router,
              private tagTreeService: TagTreeService,
              private userService: UserService
  ) {
    this.allTagTypes = TagType.listAll();
    var extraNavigation = this.router.getCurrentNavigation().extras;
    if (extraNavigation.state && extraNavigation.state.userId && extraNavigation.state.userName) {
      this.userId = extraNavigation.state.userId;
      this.userName = extraNavigation.state.userName;
      this.showUserFilter = true;
    }
  }

  ngOnInit(): void {
    this.tagTreeService.refreshTagTree(this.userId);
    this.retrieveListForGrid();
    this.retrieveUserList();
  }

  ngOnDestroy() {
    this.unsubscribe.forEach(s => s.unsubscribe());
  }

  retrieveListForGrid() {
    this.groupType = GroupType.All;

    let $sub = this.tagTreeService.allContentList(this.userId, TagTree.BASE_GROUP,
        ContentType.Direct, false, this.groupType, this.tagTypes)
        .subscribe(data => {
          this.logger.debug("in subscribe in tag-select. data: " + data.length)
          this.tagList = data;
          this.loaded = true;
        });
    this.unsubscribe.push($sub);
  }

  retrieveUserList() {
    this.groupType = GroupType.All;

    let $sub = this.userService.getAllUsersWithTags()
        .subscribe(data => {
          this.logger.debug("in subscribe in tag-select. data: " + data.length)
          this.usersWithTags = data;
        });
    this.unsubscribe.push($sub);
  }

  refreshGrid() {
    this.tagTreeService.refreshTagTree(this.userId);
  }

  expandOrCollapseGrid(expand: boolean) {
    this.searchFragment = "";
    this.tagTreeService.setExpansionForAllNodes(expand);
  }

  searchTags() {
    this.tagTreeService.findByFragment(this.searchFragment);
  }

  filterTagsForUser() {
    this.userId = this.tagUserIdFilter;
    this.tagTreeService.filterByUserId(this.userId);
  }

  applyUserFilter(apply: boolean) {
    var filter = apply ? this.userId : null;
    this.tagTreeService.filterByUserId(filter);
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

  changeTagType(type: TagType) {
    this.tagTypes = [type];
    this.searchFragment = null;

    this.retrieveListForGrid();
  }

  createTag() {
    if (!this.tagNameEntry || this.tagNameEntry.trim().length == 0) {
      return;
    }
    let $sub = this.tagService.createTag(this.tagNameEntry, this.assignTag.tag_id,
        this.tagTypes[0], this.addAsGroup, false)
        .subscribe(data => {
          this.refreshGrid();
          this.retrieveListForGrid();
          this.assignTag = null;
          this.tagNameEntry = "";
          this.showCreateTag = false;
        });
    this.unsubscribe.push($sub);
  }

  moveToBaseGroup() {
    if (this.selectedTags.length == 1) {
      let updatedTag = this.selectedTags[0];
      if (!updatedTag.is_group) {
        return;
      }
      let $sub = this.tagService.moveGroupToBase(updatedTag.tag_id)
          .subscribe(data => {
            this.refreshGrid();
            this.retrieveListForGrid();
            this.selectedTags = [];
          });
      this.unsubscribe.push($sub);
    }
  }

  changeTagName() {
    if (!this.tagNameEntry ||
        this.tagNameEntry.trim().length == 0 ||
        this.selectedTags.length != 1) {
      return;
    }
    let updatedTag = this.selectedTags[0];
    let $sub = this.tagService.changeTagName(this.tagNameEntry, updatedTag)
        .subscribe(data => {
          this.refreshGrid();
          this.retrieveListForGrid();
          this.assignTag = null;
          this.tagNameEntry = "";
          this.showChangeTagName = false;
        });
    this.unsubscribe.push($sub);
  }

  createStandard() {
    let tagIds = this.selectedTags.map(t => t.tag_id);
    this.tagService.createStandardFromUserTags(tagIds).subscribe(r => {
      this.selectedTags = [];
      this.retrieveListForGrid();
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

  toggleShowChangeName() {
    this.showChangeTagName = !this.showChangeTagName;
    this.assignTag = null;
  }

  selectTagForAssign(tag: ITag) {
    this.assignTag = tag;
  }


  toggleShowCreateTag() {
    this.showCreateTag = !this.showCreateTag;
  }


}
