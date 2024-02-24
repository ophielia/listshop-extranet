import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {GroupType} from "../../shared/services/tag-tree.object";
import TagType from "../../model/tag-type";
import {ITag} from "../../model/tag";
import {IAdminUser} from "../../model/admin-user";
import {NGXLogger} from "ngx-logger";
import {TagService} from "../../shared/services/tag.service";
import {Router} from "@angular/router";
import {TagTreeService} from "../../shared/services/tag-tree.service";
import {UserService} from "../../shared/services/user.service";
import DisplayType from "../../model/display-type";
import {TagSearchCriteria} from "../../model/tag-search-criteria";
import {TagTreeTag} from "../../model/tag-tree-tag";
import IncludeType from "../../model/include-type";
import TagStatusType from "../../model/tag-status-type";

@Component({
  selector: 'app-tag-tool',
  templateUrl: './tag-tool.component.html',
  styleUrls: ['./tag-tool.component.scss']
})
export class TagToolComponent implements OnInit, OnDestroy {
  unsubscribe: Subscription[] = [];
  public displayType: DisplayType = DisplayType.List;
  tagSearchCriteria: TagSearchCriteria;
  tagList: ITag[] = [];
  selectGroupType: GroupType = GroupType.GroupsOnly;

    groupType: GroupType = GroupType.All;
  tagTypes: TagType[] = [TagType.Ingredient]
  allTagTypes: TagType[];
  searchFragment: string;
  includeGroups: boolean = false;
  includeConstant: IncludeType = IncludeType.Include;
  ignoreConstant: IncludeType = IncludeType.Ignore;

  verifyConstant: string = TagStatusType.Checked;
  foodConstant: string = TagStatusType.Food;
  liquidConstant: string = TagStatusType.Liquid;
  categoryConstant: string = TagStatusType.Category;
  foodVerifiedConstant: string = TagStatusType.FoodVerified;

  usersWithTags: IAdminUser[] = [];
  selectedTags: TagTreeTag[] = [];
  selectTagCriteria: TagSearchCriteria;

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
  expandAll: boolean = false;

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
      //this.tagTreeService.refreshTagTree(this.userId);
    this.tagSearchCriteria = new TagSearchCriteria();
    this.selectTagCriteria = new TagSearchCriteria();
    this.selectTagCriteria.group_include = 'ONLY';
    this.selectTagCriteria.tag_types = TagType.listAll();
    this.retrieveTagList();
    this.retrieveUserList();
  }

  ngOnDestroy() {
    this.unsubscribe.forEach(s => s.unsubscribe());
  }

  retrieveTagList() {
      console.log("tag search criteria - " + this.tagSearchCriteria);
    const promise = this.tagService.getTagListForCriteria(this.tagSearchCriteria);
    promise.then((data) => {
      this.logger.debug("tag data retrieved making list");
      this.tagList = data;
    }).catch((error) => {
      console.log("Promise rejected with " + JSON.stringify(error));
    });
  }

  selectTag(tagTreeTag: TagTreeTag) {
    this.selectedTags.push(tagTreeTag);
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

  expandOrCollapseGrid(expand: boolean) {
    this.searchFragment = "";
    this.expandAll = expand;
  }

  searchTags() {
    this.tagSearchCriteria.text_fragment = this.searchFragment;
    this.retrieveTagList();
  }

  filterTagsForUser() {
    if (this.tagUserIdFilter == '-1') {
      this.tagSearchCriteria.user_id = null;
    }
    this.tagSearchCriteria.user_id = this.tagUserIdFilter;
    this.retrieveTagList();
  }

  assignSelectedToUser(userId: string) {
    if (this.selectedTags.length == 0) {
      this.showAddToUser = false;
      return;
    }
    let tagIds = this.selectedTags.map(t => t.tag_id);
    this.tagService.assignTagToUser(tagIds, userId).subscribe(r => {
      this.retrieveTagList();
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
      this.tagTreeService.refreshGroups();
      this.retrieveTagList();
      this.selectedTags = [];
      this.showChangeParent = false;
      this.assignTag = null;
    });
  }

    markSelectedAsReviewed() {
        let tagIds = this.selectedTags.map(t => t.tag_id);
        this.tagService.markTagsAsReviewed(tagIds).subscribe(r => {
          this.retrieveTagList();
            this.selectedTags = [];
        });
    }

  changeTagType(type: TagType) {
    this.tagSearchCriteria.tag_types = [type];
    this.tagSearchCriteria.text_fragment = null;
    this.searchFragment = null;

    this.retrieveTagList();
  }

  createTag() {
    if (!this.tagNameEntry || this.tagNameEntry.trim().length == 0) {
      return;
    }
    let $sub = this.tagService.createTag(this.tagNameEntry, this.assignTag.tag_id,
        this.tagTypes[0], this.addAsGroup, false)
        .subscribe(data => {
          this.retrieveTagList();
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
            this.retrieveTagList();
            this.tagTreeService.refreshGroups();
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
          this.retrieveTagList();
          this.assignTag = null;
          this.selectedTags = [];
          this.tagNameEntry = "";
          this.showChangeTagName = false;
        });
    this.unsubscribe.push($sub);
  }

  createStandard() {
    let tagIds = this.selectedTags.map(t => t.tag_id);
    this.tagService.createStandardFromUserTags(tagIds).subscribe(r => {
      this.selectedTags = [];
      this.retrieveTagList();
    });
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


  isListDisplay() {
    return this.displayType == DisplayType.List;
  }

  isGridDisplay() {
    return this.displayType == DisplayType.Grid;
  }

  setListDisplayStyle() {
    this.displayType = DisplayType.List;
    this.tagSearchCriteria.group_include = this.includeGroups ? 'IGNORE' : 'EXCLUDE';
    this.retrieveTagList();
  }

  setGridDisplayStyle() {
    this.displayType = DisplayType.Grid;
    this.tagSearchCriteria.group_include = 'EXCLUDE';
    this.retrieveTagList();
  }

  toggleGroups() {
    this.includeGroups = !this.includeGroups;
    this.tagSearchCriteria.group_include = this.includeGroups ? 'IGNORE' : 'EXCLUDE';
    this.retrieveTagList();
  }

    isExcludeGroups() {
        return !this.includeGroups;
    }

  stateChange(statusType: string, includeType: IncludeType) {


    if (includeType == IncludeType.Ignore) {
      this.removeStatusFromInclude(statusType);
      this.removeStatusFromExclude(statusType);
    } else if (includeType == IncludeType.Exclude) {
      this.removeStatusFromInclude(statusType);
      this.addStatusToExclude(statusType);
    } else if (includeType == IncludeType.Include) {
      this.removeStatusFromExclude(statusType);
      this.addStatusToInclude(statusType);
    }
    console.log("status type: " + statusType + ", include: " + includeType);
    this.retrieveTagList();

  }

  private addStatusToInclude(status: string) {
    let list = this.tagSearchCriteria.included_statuses;
    let resultList = this.addStatusToList(status, list);
    this.tagSearchCriteria.included_statuses = resultList;
  }

  private removeStatusFromExclude(status: string) {
    let list = this.tagSearchCriteria.excluded_statuses;
    let resultList = this.removeStatusFromList(status, list);
    this.tagSearchCriteria.excluded_statuses = resultList;
  }

  private addStatusToExclude(status: string) {
    let list = this.tagSearchCriteria.excluded_statuses;
    let resultList = this.addStatusToList(status, list);
    this.tagSearchCriteria.excluded_statuses = resultList;
  }

  private removeStatusFromInclude(status: string) {
    let list = this.tagSearchCriteria.included_statuses;
    let resultList = this.removeStatusFromList(status, list);
    this.tagSearchCriteria.included_statuses = resultList;
  }

  private addStatusToList(status: string, list: string[]) {
    if (!list) {
      return [status];
    }
    if (list.indexOf(status) < 0) {
      list.push(status);
    }

    return list;
  }

  private removeStatusFromList(status: string, list: string[]) {
    if (!list) {
      return [];
    }
    if (list.indexOf(status) >= 0) {
      list = list.filter((st) => st != status);
    }

    return list;
  }
}
