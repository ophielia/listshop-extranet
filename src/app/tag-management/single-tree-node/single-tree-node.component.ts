import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subscription} from "rxjs";
import {NGXLogger} from "ngx-logger";
import {TagTreeService} from "../../shared/services/tag-tree.service";
import {TagTreeTag} from "../../model/tag-tree-tag";

@Component({
  selector: 'app-single-tree-node',
  templateUrl: './single-tree-node.component.html',
  styleUrls: ['./single-tree-node.component.scss']
})
export class SingleTreeNodeComponent implements OnInit {
  unsubscribe: Subscription[] = [];
  @Input() tag: TagTreeTag;
  @Input() userId: string;
  @Output() select: EventEmitter<TagTreeTag> = new EventEmitter<TagTreeTag>();
  @Output() expand: EventEmitter<TagTreeTag> = new EventEmitter<TagTreeTag>();

  constructor(private logger: NGXLogger,
              private tagTreeService: TagTreeService) {
  }

  ngOnInit(): void {
    this.refreshGrid();
  }

  ngOnDestroy() {
    this.unsubscribe.forEach(s => s.unsubscribe());

  }

  toggleExpanded(tag: TagTreeTag) {
    this.expand.emit(tag);
  }

  private refreshGrid() {

  }

  selectTag(tag: TagTreeTag) {
    this.select.emit(tag);
  }
}
