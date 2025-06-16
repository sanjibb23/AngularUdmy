import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { member } from '../_models/member';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MembersService } from './members.service';

@Injectable({
  providedIn: 'root'
})
export class LikesService {
baseUrl = 'https://az400api-djabcqhjckd2bvba.northeurope-01.azurewebsites.net/api/';
  constructor(private http: HttpClient,private memberService: MembersService) { }


  toggleLike(itemId: number, userId: number) {
    return this.http.post(this.baseUrl+'Likes/toggle', { itemId, userId });
  }


  loadLikes(params: string): Observable<member[]> {
      return this.http.get<member[]>(this.baseUrl + 'Likes/GetUsers/'+params,).pipe(
        map((response: member[]) => {
          const members: member[] = response.map((user: member) => {
            const member: member = {
              Id: user.Id,
              UserName: user.UserName,
              DateOfBirth: user.DateOfBirth,
              City: user.City,
              Country: user.Country,
              Age: user.Age,
              KnownAs: user.KnownAs,
              LastActive: user.LastActive,
              Introduction: user.Introduction,
              Interest: user.Interest,
              Gender: user.Gender,
              LookingFor: user.LookingFor, 
              FirstName: user.FirstName,
              LastName: user.LastName,
              Email: user.Email,
              UserPhotos: user.UserPhotos,
              MainPhotoUrl: this.memberService.GetMainPhotoUrl(user.UserPhotos), // Assuming you want the first photo URL
              LikebyCurrentUser: user.LikebyCurrentUser
            };
            return member;
          });
          return members;
        })        
      );
  } 

}
