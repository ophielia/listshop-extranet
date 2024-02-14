import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {IAdminUser} from "../../model/admin-user";
import {NGXLogger} from "ngx-logger";
import {UserService} from "../../shared/services/user.service";
import {Subscription} from "rxjs";
import {ITag} from "../../model/tag";
import {TagService} from "../../shared/services/tag.service";
import {TagTreeService} from "../../shared/services/tag-tree.service";
import TagType from "../../model/tag-type";
import {TagSearchCriteria} from "../../model/tag-search-criteria";

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
      this.findTags(this.userId);

    });
  }


  findTags(userId: string) {
    let tagSearchCriteria = new TagSearchCriteria();
    tagSearchCriteria.user_id = userId;
    const promise = this.tagService.getTagListForCriteria(tagSearchCriteria);
    promise.then((data) => {
      this.logger.debug("tag data retrieved making list");
      this.tagList = data;
    }).catch((error) => {
      console.log("Promise rejected with " + JSON.stringify(error));
    });
  }

  toggleShowUserTags() {
    this.showUserTags = !this.showUserTags;
    this.showUserTagGrid = !this.showUserTags;
  }

  toggleShowUserTagGrid() {
    this.showUserTagGrid = !this.showUserTagGrid;
    this.showUserTags = !this.showUserTagGrid;
  }

  goToEditGrid() {
    let userid = this.userId;

    var navigationExtras: NavigationExtras = {
      state: {
        userId: this.user.user_id,
        userName: this.user.email
      }
    };


    this.router.navigate(['manage/tags/tool'], navigationExtras);

  }

}
