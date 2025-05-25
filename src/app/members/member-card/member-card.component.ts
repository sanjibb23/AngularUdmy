import { Component, Input, OnInit } from '@angular/core';
import { member } from './../../_models/member';
import { LikesService } from '../../_Services/likes.service';
import { PresenceService } from '../../_Services/presence.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  @Input() usermember: member;
  constructor(private likeService: LikesService, private PresenceService: PresenceService) { }


 isOnline$: Observable<boolean>;

  ngOnInit(): void {
    this.isOnline$ = this.PresenceService.onlineUsers$.pipe(
    map(users => users.includes(this.usermember.UserName

      
    ))
  );
  }

  heartcolor: string = 'red';

 
   toggleLike(itemId: number) {
      this.likeService.toggleLike(itemId, 1).subscribe({
        next: (response) => {
          this.usermember.LikebyCurrentUser = response as boolean;
          
        },
        error: (error) => {
          console.log(error);
        }
      });
    }

}
