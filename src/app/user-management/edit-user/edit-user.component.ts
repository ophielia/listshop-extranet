import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {IAdminUser} from "../../model/admin-user";
import {NGXLogger} from "ngx-logger";
import {UserService} from "../../shared/services/user.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  unsubscribe: Subscription[] = [];

  user: IAdminUser;
  userId: string;

  constructor(private logger: NGXLogger,
              private route: ActivatedRoute,
              private title: Title,
              private userService: UserService) {
  }

  ngOnDestroy() {
    this.unsubscribe.forEach(s => s.unsubscribe());
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

    });
  }

}
