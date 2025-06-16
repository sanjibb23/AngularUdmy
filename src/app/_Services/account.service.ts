import { Injectable,inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { User } from '../_models/User';
import { map} from 'rxjs/operators'
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private curUser: User | null = null;

  constructor(private http: HttpClient,private PresenceService: PresenceService) {
    this.currentUser.subscribe(user => {
      this.curUser = user;
    });
  }
  baseUrl = 'https://az400api-djabcqhjckd2bvba.northeurope-01.azurewebsites.net/api/';

  currentUser = new ReplaySubject<User | null>(1);
  currentUser$ = this.currentUser.asObservable();


  login(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map(user => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUser.next(user);
          this.PresenceService.startConnection(user.UserName);
        }
      }
      )
    );
  }

  register(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/register', model);
  }


  logout() {
    localStorage.removeItem('user');
    this.currentUser.next(null);
    this.PresenceService.stopConnection();
  }

  setCurrentUser(user: User | null) {
    this.currentUser.next(user);
  }
  loadCurrentUser() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user: User = JSON.parse(userJson);
      this.setCurrentUser(user);
    }
  }

  getCurrentUser(): User | null {
    return this.curUser;
  }

  getUserById(): number | null {
    const user = this.getCurrentUser();
    return user && user.Id !== undefined ? user.Id : null; // Return the user ID or null if not logged in
  }


}
