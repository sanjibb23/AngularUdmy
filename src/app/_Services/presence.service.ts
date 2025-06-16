import { Injectable, NgZone } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {

  private hubConnection!: signalR.HubConnection;

  private onlineUsersSubject = new BehaviorSubject<string[]>([]);
  onlineUsers$ = this.onlineUsersSubject.asObservable();

  constructor(private zone: NgZone) {}

  public startConnection(username: string) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://az400api-djabcqhjckd2bvba.northeurope-01.azurewebsites.net/presence?username=' + username)
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .catch(err => console.log('Error connecting SignalR: ', err));

      this.GetonlineUsers((onlineUsers: string[]) => {
        console.log('Online users:', onlineUsers);
      }
      );
      
  }

  GetonlineUsers(callback: (OnlineUsers: string[]) => void): void {
    this.hubConnection?.on('GetOnlineUsers', (usernames: string[]) => {
      this.zone.run(() => {
        this.onlineUsersSubject.next(usernames);
      });
    });

    this.hubConnection?.on('UserIsOnline', (username: string) => {
      this.zone.run(() => {
        const users = this.onlineUsersSubject.value;
        if (!users.includes(username)) {
          this.onlineUsersSubject.next([...users, username]);
        }
      });
    });

    this.hubConnection?.on('UserIsOffline', (username: string) => {
      this.zone.run(() => {
        const updated = this.onlineUsersSubject.value.filter(u => u !== username);
        this.onlineUsersSubject.next(updated);
      });
    });

  }

  stopConnection(): void {
    if (this.hubConnection?.state == signalR.HubConnectionState.Connected) {
      this.hubConnection.stop()
        .then(() => console.log('SignalR connection stopped.'))
        .catch(err => console.error('Error stopping SignalR connection:', err));
    }
  }
  


}
