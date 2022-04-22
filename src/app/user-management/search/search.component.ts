import {Component, OnInit} from '@angular/core';
import {NGXLogger} from "ngx-logger";
import {UserService} from "../../shared/services/user.service";
import {Subscription} from "rxjs";
import {AdminUser} from "../../model/admin-user";
import {Router} from "@angular/router";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  unsubscribe: Subscription[] = [];

  listId: string;
  userId: string;
  email: string;
  searchResults: AdminUser[] = [];

  constructor(private logger: NGXLogger,
              private router: Router,
              private userService: UserService,) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.unsubscribe.forEach(s => s.unsubscribe());
  }

  doUserSearch() {
    this.logger.info("in do user search");
    this.searchResults = [];
    let $sub = this.userService.searchUsers(this.email, this.userId, this.listId)
        .subscribe(p => {
          if (p.length == 1) {
            let id = p[0].user_id;
            this.router.navigate(['/manage/users/edit', id]);
          }
          this.searchResults = p;

          this.email = "";
          this.userId = "";
          this.listId = "";
        });
    this.unsubscribe.push($sub);
  }
}
