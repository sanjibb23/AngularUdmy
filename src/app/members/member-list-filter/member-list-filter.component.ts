import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-member-list-filter',
  templateUrl: './member-list-filter.component.html',
  styleUrls: ['./member-list-filter.component.css']
})
export class MemberListFilterComponent implements OnInit {

  filterUserName: string = '';
  filterGender: string = '';
  filterCity: string = '';
  constructor() { }

  ngOnInit(): void {
  }

  @Output() filtersChanged = new EventEmitter<{
    userName: string;
    gender: string;
    city: string;
  }>();
  onFilterChange() {
    this.filtersChanged.emit({
      userName: this.filterUserName,
      gender: this.filterGender,
      city: this.filterCity
    });
  }
}
