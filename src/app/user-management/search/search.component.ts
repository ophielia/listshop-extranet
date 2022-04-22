import {Component, OnInit} from '@angular/core';
import {NGXLogger} from "ngx-logger";
import {UserService} from "../../shared/services/user.service";
import {Subscription} from "rxjs";
import {AdminUser} from "../../model/admin-user";

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
          this.searchResults = p;
          this.email = "";
          this.userId = "";
          this.listId = "";
        });
    this.unsubscribe.push($sub);
  }
}
