import { Component, OnInit } from '@angular/core';
import { LikesService } from '../_Services/likes.service';
import { member } from '../_models/member';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {

  constructor(private likeService: LikesService) { }

  members: member[] = [];
  activeTab = '';
  ngOnInit(): void {
    this.loadLikes('me');
  }

  loadLikes(type: 'me' | 'others' | 'mutual') {
    this.likeService.loadLikes(type).subscribe({
      next: (response) => {
        this.members = response;
        this.activeTab = type;
      },
      error: (error) => {
        console.log(error);
      }
    }); 
  }

}
