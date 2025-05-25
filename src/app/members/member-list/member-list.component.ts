import { Component, OnInit } from '@angular/core';
import { MembersService } from '../../_Services/members.service';
import { member } from '../../_models/member';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  members: member[] = [];
  totalRecords: number = 0;
  currentPage: number = 1;
  pageSize: number = 8;
  totalPages: number = 0;
  constructor(private memberService : MembersService) { }

  ngOnInit(): void {
    //this.loadMembers();
    this.loadMembersAll();
  }
  loadMembers() {
    this.memberService.getMembers().subscribe({
      next: (response) => {
        this.members = response;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  loadMembersAll() {
    this.memberService.getMembersAll(
      this.currentPage,
       this.pageSize,
      this.filters.userName,
      this.filters.gender,
      this.filters.city
      ).subscribe(res => {
      this.members = res.Data;
      this.totalRecords = res.TotalRecords;
      this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    });
  }
  onPageChange(page: number) {
    this.currentPage = page;
    this.loadMembersAll();
  }

  filters = {
    userName: '',
    gender: '',
    city: ''
  };
  handleFilters(data: { userName: string; gender: string; city: string }) {
    this.filters = data;
    this.currentPage = 1;
    this.loadMembersAll();
    console.log(this.filters);
  }

}
