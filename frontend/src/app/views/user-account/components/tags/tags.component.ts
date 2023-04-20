import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable, startWith, map } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { TransactionType } from '@common/graphql';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
})
export class TagsComponent {
  @Input() type: TransactionType;
  @Output() setAllTags = new EventEmitter<string[]>();

  transactionType = TransactionType;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl('');
  filteredTags$ = this.tagCtrl.valueChanges.pipe(
    startWith(null),
    map((tag: string | null) =>
      tag ? this._filter(tag) : this.allTags.slice()
    )
  );
  _allTags: string[] = [];

  set allTags(allTags: string[]) {
    this._allTags = [...new Set(allTags.reverse())].reverse();

    this.setAllTags.emit(this._allTags)
  }
  get allTags() {
    return this._allTags;
  }

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;

  constructor() {}

  getLabel(transactionType: TransactionType): string{
    if (transactionType === TransactionType.RECEIVE){
      return 'Receive tags'
    } else if (transactionType === TransactionType.SEND){
      return 'Send tags' 
    } else {
      return 'Transfer tags'
    }
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.allTags = [...this.allTags, value];
    }

    // Clear the input value
    event.chipInput!.clear();

    this.tagCtrl.setValue(null);
  }

  remove(tag: string): void {
    const index = this.allTags.indexOf(tag);

    if (index >= 0) {
      this.allTags.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.allTags = [...this.allTags, event.option.viewValue];
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTags.filter((fruit) =>
      fruit.toLowerCase().includes(filterValue)
    );
  }
}
