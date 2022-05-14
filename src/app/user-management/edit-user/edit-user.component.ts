import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {IAdminUser} from "../../model/admin-user";
import {NGXLogger} from "ngx-logger";
import {UserService} from "../../shared/services/user.service";
import {Subscription} from "rxjs";
import {ITag} from "../../model/tag";
import {TagService} from "../../shared/services/tag.service";
import {ContentType, GroupType, TagTree} from "../../shared/services/tag-tree.object";
import {TagTreeService} from "../../shared/services/tag-tree.service";
import TagType from "../../model/tag-type";

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  unsubscribe: Subscription[] = [];

  user: IAdminUser;
  userId: string;
  tagList: ITag[] = [];
  tagListForGrid: ITag[] = [];
  showUserTags: boolean = false;
  showUserTagGrid: boolean = false;
  tagTreeTagType: TagType = TagType.Ingredient;
  gridTypes: TagType[] = [TagType.TagType, TagType.Ingredient, TagType.NonEdible];

  ngOnDestroy() {
    this.unsubscribe.forEach(s => s.unsubscribe());
  }

  constructor(private logger: NGXLogger,
              private route: ActivatedRoute,
              private tagTreeService: TagTreeService,
              private title: Title,
              private router: Router,
              private userService: UserService,
              private tagService: TagService) {
  }


  ngOnInit(): void {
    this.title.setTitle(this.route.snapshot.data['title']);
    this.route.params.subscribe(params => {
      this.userId = params['id'];
      let $sub = this.userService.findUser(this.userId)
          .subscribe(p => {
            this.user = p;
          });
      this.unsubscribe.push($sub);
      this.tagTreeService.refreshTagTree(this.userId);

    });
  }

  toggleShowUserTags() {
    this.showUserTags = !this.showUserTags;
    this.showUserTagGrid = false;
    if (this.showUserTags) {
      this.refreshTags();
    }
  }

  toggleShowUserTagGrid() {
    this.showUserTagGrid = !this.showUserTagGrid;
    this.showUserTags = false;
    if (this.showUserTagGrid) {
      this.refreshTagsForGrid();
    }
  }

  goToEditGrid() {
    let userid = this.userId;

    var navigationExtras: NavigationExtras = {
      state: {
        userId: this.user.user_id,
        userName: this.user.email
      }
    };


    this.router.navigate(['manage/tags/grid'], navigationExtras);

  }

  private refreshTags() {
    const promise = this.tagService.getTagList(this.userId, false);
    console.log(promise);
    promise.then((data) => {
      this.logger.debug("tag data retrieved.");
      this.tagList = data;

    }).catch((error) => {
      console.log("Promise rejected with " + JSON.stringify(error));
    });
  }

  private refreshTagsForGrid() {
    this.tagTreeService.filterByUserId(this.userId);
    let $sub = this.tagTreeService.allContentList(this.userId, TagTree.BASE_GROUP,
        ContentType.Direct, false, GroupType.All, this.gridTypes)
        .subscribe(data => {
          this.logger.debug("in subscribe in tag-select. data: " + data.length)
          this.tagListForGrid = data;
        });
    this.unsubscribe.push($sub);
  }
}
