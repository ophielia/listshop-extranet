import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-search-term-select',
  templateUrl: './search-term-select.component.html',
  styleUrls: ['./search-term-select.component.scss']
})
export class SearchTermSelectComponent implements OnInit {
  @Input() set startTag(value: string) {
    this._startTag = value;
    this.fillSuggestionsFromStartTag(value);
    this.foodNameEntry = this._startTag;
  };

  @Output() searchTermSelected: EventEmitter<string> = new EventEmitter<string>();

  _startTag: string;
  foodNameEntry: string = "";
  suggestions: string[];

  constructor() {

  }

  ngOnInit(): void {
  }

  fillSuggestionsFromStartTag(text: string) {
    if (text.indexOf(" ") >= 0) {
      this.suggestions = [].concat([text], text.split(" "));
    }
  }

  addOrRemoveFromTerm(text: string) {
    if (this.foodNameEntry && this.foodNameEntry.indexOf(text) >= 0) {
      // remove from the search term
      let string = this.foodNameEntry.replace(text, "");
      this.foodNameEntry = string.trim();
    } else {
      this.foodNameEntry = this.foodNameEntry + " " + text.trim();
    }
  }

  replaceTerm(text: string) {
    this.foodNameEntry = text;
  }

  readyToSearch() {
    this.searchTermSelected.emit(this.foodNameEntry);
  }
}
