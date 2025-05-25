import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MembersService } from '../../_Services/members.service';
import { member } from '../../_models/member';
import { UserPhoto } from '../../_models/UserPhoto';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent implements OnInit {

  member!: member;
  constructor(private route: ActivatedRoute,private memberService: MembersService) { }

  activeTab: string = 'about';

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember() {
    let memberId = this.route.snapshot.paramMap.get('username');
    var ismeg = memberId?.includes('#message');
    if (ismeg) {
      memberId = memberId ? memberId.replace('#message', '') : null;
      this.activeTab = 'message';
    }else {
      this.activeTab = 'about';
    }
   // alert(this.activeTab);
    if (!memberId) return;
    if (memberId) {
      this.memberService.getMember(memberId).subscribe({
        next: (response) => {
          this.member = response;
          console.log(this.member);
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
  }

  onMessageTabClick() {
  this.activeTab = 'message';

  // update markas read status

}


}
