import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { member } from '../../_models/member';
import { MembersService } from '../../_Services/members.service';
import { AccountService } from '../../_Services/account.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }
   member!: member;
  constructor(private memberService: MembersService,
    private accountService: AccountService,
  private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadmember();
  }

  loadmember() {
    const user = this.accountService.getCurrentUser();
    if (!user) return;
    this.memberService.getMember(user.UserName).subscribe({
      next: (response) => {
        this.member = response;
      }
    });
  }

  updateMember() {
    const Updatemember: member = {
      Id: this.member.Id,
      UserName: this.member.UserName,
      DateOfBirth: this.member.DateOfBirth,
      City: this.editForm?.value.City,
      Country: this.editForm?.value.Country,
      Age: this.member.Age,
      KnownAs: this.member.KnownAs,
      LastActive: this.member.LastActive,
      Introduction: this.editForm?.value.Introduction,
      Interest: this.editForm?.value.Interest,
      Gender: this.member.Gender,
      LookingFor: this.editForm?.value.LookingFor, 
      FirstName: this.member.FirstName,
      LastName: this.member.LastName,
      Email: this.member.Email,
      UserPhotos: this.member.UserPhotos,
      MainPhotoUrl: this.member.MainPhotoUrl,
      LikebyCurrentUser: this.member.LikebyCurrentUser
  }
  this.memberService.updateMember(Updatemember).subscribe({
      next: (response) => {

        console.log(response);
        this.toastr.success('Profile updated successfully');
        this.editForm?.reset(response);
      },
      error: (error) => {
      }
    });
  }

}
