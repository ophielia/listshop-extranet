import {Component, OnDestroy, OnInit} from '@angular/core';
import {LandingFixService} from "../../shared/services/landing-fix.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Meta, Title} from "@angular/platform-browser";
import {ListService} from "../../shared/services/list.service";
import {Subscription} from "rxjs";
import {ShoppingList} from "../../model/shoppinglist";
import {ConfirmDialogService} from "../../shared/services/confirm-dialog.service";

@Component({
    selector: 'app-manage-lists',
    templateUrl: './manage-lists.component.html',
    styleUrls: ['./manage-lists.component.css']
})
export class ManageListsComponent implements OnInit, OnDestroy {
    unsubscribe: Subscription[] = [];

    lists: ShoppingList[];

    constructor(
        private fix: LandingFixService,
        private route: ActivatedRoute,
        private router: Router,
        private title: Title,
        private meta: Meta,
        private listService: ListService,
        private confirmDialogService: ConfirmDialogService
    ) {
    }

    ngOnInit() {
        // this.fix.addFixBlogDetails();
        this.title.setTitle(this.route.snapshot.data['title']);
        this.getShoppingLists()
    }

    ngOnDestroy() {
        this.unsubscribe.forEach(s => s.unsubscribe());
    }


    getShoppingLists() {

        let sub$ = this.listService
            .getAllLists()
            .subscribe(p => {
                if (p) {
                    this.lists = p
                }
            });
        this.unsubscribe.push(sub$);
    }

    deleteShoppingList(listId: string) {
        this.confirmDialogService.confirmThis("Are you sure you'd like to delete this list?",
            () => {console.log("dummy"); this.doDeleteShoppingList(listId);},
            function () { })
    }

    doDeleteShoppingList(listId: string) {
        let sub$ = this.listService
            .deleteList(listId)
            .subscribe(l => this.getShoppingLists());
        this.unsubscribe.push(sub$);
    }

    editShoppingList(listId: String) {
       // console.log("planId + " + planId)
        var url = "lists/edit/" +  listId;
        this.router.navigateByUrl(url);

    }

    createShoppingList() {
        let sub$ = this.listService
            .createList(ListService.DEFAULT_LIST_NAME)
            .subscribe(l => this.getShoppingLists());
        this.unsubscribe.push(sub$);
    }

}
