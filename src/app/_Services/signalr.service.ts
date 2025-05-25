import { Injectable, NgZone } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { Message } from '../_models/messages';
import { AccountService } from './account.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection!: signalR.HubConnection;

  private _receivedMessage = new BehaviorSubject<Message | null>(null);
  public receivedMessage$: Observable<Message | null> = this._receivedMessage.asObservable();

  constructor(private ngZone: NgZone, private AccService: AccountService,
    private toastr: ToastrService) {
    this.startConnection(this.AccService.getUserById() ?? 0);
    this.registerReceiveMessageHandler();

  }

  startConnection(userId: number): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:44347/chatHub?userId=" + userId, {
        withCredentials: true
      })
      .build();
    this.hubConnection.start()
      .then(() => console.log('SignalR Connected'))
      .catch(err => console.error('SignalR Connection Error:', err));
  }

  sendMessage(senderId: number, receiverId: number, message: string): void {
    this.hubConnection.invoke('SendMessage', senderId, receiverId, message);
  }

  private registerReceiveMessageHandler(): void {
    this.hubConnection.on('ReceiveMessage', (senderId: number, message: string, messageId: number) => {
      this.ngZone.run(() => {
        const newMessage: Message = {
          Id: messageId,
          SenderId: senderId,
          ReceiverId: this.AccService.getUserById() ?? 0,
          Content: message,
          Timestamp: new Date(),
          IsRead: false
        };
        this._receivedMessage.next(newMessage);
        this.markAsRead(messageId); 
        this.toastr.success('New message received from '+senderId, "New Message");

      });
    });
  }
  markAsRead(messageId: number): void {
    if (this.hubConnection) {
      this.hubConnection.invoke('MarkAsRead', messageId)
        .catch(err => console.error('MarkAsRead error:', err));
    }
  }

}
