import {Component, OnInit} from '@angular/core';
import {ITag} from "../../model/tag";
import {NGXLogger} from "ngx-logger";
import {ActivatedRoute} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {Subscription} from "rxjs";
import {TagService} from "../../shared/services/tag.service";

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.scss']
})
export class TagListComponent implements OnInit {
  unsubscribe: Subscription[] = [];

  tagList: ITag[] = []
  selectedTags: ITag[] = []
  public userId: string = null;
  public userIdForAssign: string = null;
  sortDirection: number = -1
  currentSortBy: string = "created";

  showAddToUser: boolean = false;


  constructor(private logger: NGXLogger,
              private route: ActivatedRoute,
              private title: Title,
              private tagService: TagService) {

  }

  ngOnDestroy() {
    this.unsubscribe.forEach(s => s.unsubscribe());
  }

  ngOnInit(): void {
    this.title.setTitle(this.route.snapshot.data['title']);

    this.getTags();
  }

  private sortTagList() {
    if (this.currentSortBy == 'created') {
      this.sortByCreated(this.tagList);
    } else if (this.currentSortBy == 'name') {
      this.sortByTagName(this.tagList);
    }

  }

  private sortByTagName(tagList: ITag[]) {
    tagList.sort((a, b) => {
      return a.name.localeCompare(b.name) * this.sortDirection;
    });
  }


  private sortByCreated(tagList: ITag[]) {
    tagList.sort((a, b) => {
      let aNum = parseInt(a.tag_id, 10);
      let bNum = parseInt(b.tag_id, 10);

      if (aNum < bNum) return -1 * this.sortDirection;
      else if (aNum > bNum) return 1 * this.sortDirection;
      else return 0;
    });
  }


  changeSorting(sortType: string) {
    let sortTypeChanged = sortType != this.currentSortBy;
    this.currentSortBy = sortType;
    if (!sortTypeChanged) {
      this.sortDirection = this.sortDirection * -1;
    }
    this.sortTagList();
  }

  selectTag(result: ITag) {
    this.selectedTags.push(result);
  }

  deSelectTag(result: ITag) {
    this.selectedTags = this.selectedTags.filter(t => t.tag_id != result.tag_id);
  }

  toggleShowAssign() {
    this.showAddToUser = !this.showAddToUser;
  }


  assignSelectedToUser(userId: string) {
    let tagIds = this.selectedTags.map(t => t.tag_id);
    this.tagService.assignTagToUser(tagIds, userId).subscribe(r => {
      this.getTags();
      this.selectedTags = [];
    });
  }


  private getTags() {
    const promise = this.tagService.getTagList(this.userId, false);
    console.log(promise);
    promise.then((data) => {
      this.logger.debug("tag data retrieved.");
      this.tagList = data;
      this.sortTagList();
    }).catch((error) => {
      console.log("Promise rejected with " + JSON.stringify(error));
    });
  }
}
