import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subscription} from 'rxjs';
import {ILayoutCategory} from '../../../model/layout-category';
import {NGXLogger} from 'ngx-logger';
import {LayoutService} from '../../services/layout.service';

@Component({
    selector: 'app-layout-category-select',
    templateUrl: './category-layout-select.component.html',
    styleUrls: ['./category-layout-select.component.css']
})
export class CategoryLayoutSelectComponent implements OnInit {
    unsubscribe: Subscription[] = [];
    @Output() categorySelected: EventEmitter<ILayoutCategory> = new EventEmitter<ILayoutCategory>();
    @Output() cancel: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Input() placeholderText: string = "enter stuff here";

    categoryList: ILayoutCategory[];
    filteredCategories: ILayoutCategory[];
    loaded: boolean = false;

    showCancelButton = true;
    autoSelectedCategory: any;

    constructor(private logger: NGXLogger,
                private layoutService: LayoutService) {

    }


    ngOnInit(): void {
        const promise = this.layoutService.getDefaultCategories();
        promise.then((data) => {
            this.logger.debug('layout category data retrieved');
            this.categoryList = data;
            this.loaded = true;
        }).catch((error) => {
            console.log('Promise rejected with ' + JSON.stringify(error));
        });
    }

    filterCategories(event) {
        this.logger.debug('query:' + event.query);
        if (event.query && this.loaded) {
            if (this.categoryList) {
                let filterBy = event.query.toLocaleLowerCase();
                this.filteredCategories = this.categoryList.filter((tag: ILayoutCategory) =>
                    tag.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
            }
        } else {
            this.filteredCategories = null;
        }
    }

    bingo(event) {
        this.categorySelected.emit(event);
        this.autoSelectedCategory = null;
        this.filteredCategories = null;
        if (event) {
            event.panelVisible = false;
        }
    }

    checkSearchEnter(el) {
        // when the user clicks on return from the search box
        // if only one tag is in the list, select this tag
        if (this.filteredCategories && this.filteredCategories.length == 1) {
            this.bingo(this.filteredCategories[0]);
            if (el) {
                el.panelVisible = false;
            }
        }
    }

    cancelSelectCategory() {
        this.cancel.emit(true);
    }

}
