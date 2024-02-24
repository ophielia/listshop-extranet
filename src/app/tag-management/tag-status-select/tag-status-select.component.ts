import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import IncludeType from "../../model/include-type";

@Component({
  selector: 'app-tag-status-select',
  templateUrl: './tag-status-select.component.html',
  styleUrls: ['./tag-status-select.component.scss']
})
export class TagStatusSelectComponent implements OnInit {

  @Input() displayName: string = "";
  @Input() startState: IncludeType;
  @Output() selectedState: EventEmitter<IncludeType> = new EventEmitter<IncludeType>();

  private currentState: IncludeType;

  constructor() {
  }

  ngOnInit(): void {

    this.currentState = this.startState
  }

  includeIsActive(): boolean {
    return this.currentState == IncludeType.Include;
  }

  excludeIsActive(): boolean {
    return this.currentState == IncludeType.Exclude;
  }

  toggleInclude() {
    if (this.currentState == IncludeType.Ignore) {
      this.currentState = IncludeType.Include;
    } else if (this.currentState == IncludeType.Include) {
      this.currentState = IncludeType.Ignore;
    } else {
      this.currentState = IncludeType.Include;
    }
    console.log("emitting.... " + this.currentState);
    this.selectedState.emit(this.currentState);
  }

  toggleExclude() {
    if (this.currentState == IncludeType.Ignore) {
      this.currentState = IncludeType.Exclude;
    } else if (this.currentState == IncludeType.Exclude) {
      this.currentState = IncludeType.Ignore;
    } else {
      this.currentState = IncludeType.Exclude;
    }
    console.log("emitting.... " + this.currentState);
    this.selectedState.emit(this.currentState);
  }
}
