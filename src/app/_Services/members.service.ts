import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { member } from '../_models/member';
import { AccountService } from './account.service';
import { map, tap } from 'rxjs/operators';
import { UserPhoto } from '../_models/UserPhoto';
import { Observable, of } from 'rxjs';
import { PaginatedResult } from '../_models/PaginatedResult';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  baseUrl = 'https://az400api-djabcqhjckd2bvba.northeurope-01.azurewebsites.net/api/';
  members: member[] = [];
  private usersCache: member[] | null = null;
  constructor(private http: HttpClient, private accountService : AccountService) { 
  }

getMembers(): Observable<member[]> {

  if (this.usersCache) {
    console.log('Returning cached data');
    return of(this.usersCache);
  }else{
    return this.http.get<member[]>(this.baseUrl + 'AppUser/AllUsers').pipe(
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
            MainPhotoUrl: this.GetMainPhotoUrl(user.UserPhotos), // Assuming you want the first photo URL
            LikebyCurrentUser: user.LikebyCurrentUser,
            IsOnline: user.IsOnline,
            Messages: user.Messages
          };
          return member;
        });
        return members;
      }),
      tap(members => {
        console.log('Transformed members:', members);
        this.usersCache = members; // Cache the transformed data
      })
      
    );
  }


  
}

GetMainPhotoUrl(Photos : UserPhoto[]) : string {
 for (let i = 0; i < Photos.length; i++) {
    const photo = Photos[i];
    if (photo.IsMain == "Y") {
      return photo.FilePath; // Return the URL of the main photo
    }
  }
  return ""; // Return an empty string if no main photo is found
}



getMember(username: string):Observable<member> {
  // Check if the member is already cached
  if (this.usersCache) {
    const member = this.usersCache.find(m => m.UserName === username);
    return of(member!); // Return the cached member
  }else{
    return this.http.get<member>(this.baseUrl + 'AppUser/member/' + username , this.gethttpOptions()).pipe(
      map((response: member) => {
        const member: member = {
            Id: response.Id,
            UserName: response.UserName,
            DateOfBirth: response.DateOfBirth,
            City: response.City,
            Country: response.Country,
            Age: response.Age,
            KnownAs: response.KnownAs,
            LastActive: response.LastActive,
            Introduction: response.Introduction,
            Interest: response.Interest,
            Gender: response.Gender,
            LookingFor: response.LookingFor, 
            FirstName: response.FirstName,
            LastName: response.LastName,
            Email: response.Email,
            UserPhotos: response.UserPhotos,
            MainPhotoUrl: this.GetMainPhotoUrl(response.UserPhotos),
            LikebyCurrentUser: response.LikebyCurrentUser,
            IsOnline: response.IsOnline,
            Messages: response.Messages
        }
        return member;
      })
    );
  }

  
  
}

gethttpOptions() {
  const user = this.accountService.getCurrentUser();
  return {
    headers: {
      Authorization: `Bearer ${user?.Token}`
    }
  };
  
}
getToken(): string {
  // Replace with actual logic to retrieve the token
  return localStorage.getItem('Token') || '';
}
updateMember(member: member) {
  return this.http.put(this.baseUrl + 'AppUser', member).pipe(
    map(() =>{
      // Update the cached member
      if (this.usersCache) {
        const index = this.usersCache!.findIndex(m => m.Id === member.Id);
        if (index !== -1) {
          this.usersCache![index] = member; // Update the cached member
        }
      }
      const index = this.members.indexOf(member);
      if (index == -1) {
        this.members[index] = member; // Update the member in the array
        return member; // Return the updated member
      }
    })
  );
}

FileUpload(formData : FormData) {
 return this.http.post(this.baseUrl+'AppUser/upload-multiple', formData);
}

setMainPhoto(photo: UserPhoto) {
  return this.http.put(this.baseUrl + 'AppUser/set-main-photo', photo);
  
}
deletePhoto(photo: UserPhoto) {
  return this.http.delete(this.baseUrl + 'AppUser/delete-photo/' + photo.PhotoId);
}


getMembersAll(
  pageNumber: number,
   pageSize: number,
   userName: string,
  gender: string,
  city: string
  ): Observable<PaginatedResult<member>> {

    let params = new HttpParams()
    .set('pageNumber', pageNumber.toString())
    .set('pageSize', pageSize.toString());

  if (userName) params = params.set('userName', userName.toString());
  if (gender) params = params.set('gender', gender.toString());
  if (city) params = params.set('city', city.toString());


  return this.http.get<PaginatedResult<member>>(
    this.baseUrl + 'AppUser',
    { params }
  ).pipe(
    map((response: PaginatedResult<member>) => {
      const transformedMembers: member[] = response.Data.map((user: member) => ({
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
        MainPhotoUrl: this.GetMainPhotoUrl(user.UserPhotos),
        LikebyCurrentUser: user.LikebyCurrentUser,
        IsOnline: user.IsOnline,
        Messages: user.Messages
      }));

      return {
        Data: transformedMembers,
        TotalRecords: response.TotalRecords
      };
    })
  );
}

getMessageHistory(user1Id: number, user2Id: number) {
  return this.http.get<any[]>(`https://localhost:44347/api/message/history/${user1Id}/${user2Id}`);
}



}
