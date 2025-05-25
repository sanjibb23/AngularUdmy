import { AfterViewChecked, Component, ElementRef, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { SignalRService } from '../_Services/signalr.service';
import { member } from '../_models/member';
import { MembersService } from '../_Services/members.service';
import { AccountService } from '../_Services/account.service';
import { Message } from '../_models/messages';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit,AfterViewChecked {

  @Input() userMessages: Message[] = [];
  @Input() SelectedUserId: number = 0;
  @ViewChild('chatBox') chatBox: ElementRef;
  //currentUser = { id: 1, username: 'sanjib' };
  //selectedUser: any;
  
receivedMessage: Message | null = null;

LogInUserId: number = 0;

  //messages: any[] = [];
  newMessage: string = '';
  constructor(public signalR: SignalRService,private memberService: MembersService,
      private accountService: AccountService,private ngZone: NgZone) { }
   ngOnInit(): void {
  //  alert(this.accountService.getUserById());
    const userId = this.accountService.getUserById();
    if (userId !== null) {
      this.LogInUserId = userId;
    } else {
      alert('Unable to initialize messaging. Reason: User not logged in.');
      return;
    }
    this.signalR.receivedMessage$.subscribe((message: Message | null) => {
      if (message) {
          this.userMessages.push(message);
          this.scrollToBottom();
      }
    });

   
}

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  selectUser(user: any): void {
    // Load message history from API if implemented
    const userId = this.accountService.getUserById();
    if (userId !== null) {
      this.memberService.getMessageHistory(userId, this.SelectedUserId).subscribe({
        next: (response) => {
          this.userMessages = response.map((message: any) => ({
            Id: message.id,
            SenderId: message.senderId,
            ReceiverId: message.receiverId,
            Content: message.content,
            Timestamp: message.timestamp ? new Date(message.timestamp) : new Date(),
            IsRead: message.isRead
          }));
        }
      });
    } else {
      alert('Unable to load message history. Reason: User not logged in.');
    }
  }

  send(): void {
    if (this.SelectedUserId != 0 && this.newMessage.trim()) {
      const senderId = this.accountService.getUserById();
      if (senderId !== null) {
        this.signalR.sendMessage(senderId, this.SelectedUserId, this.newMessage);
        const senderIdNum = this.accountService.getUserById();
        if (senderIdNum !== null) {
          this.userMessages.push({ 
            SenderId: senderIdNum,
            ReceiverId: this.SelectedUserId,
            Content: this.newMessage,
            Id: 0, 
            Timestamp: new Date(), 
            IsRead: false 
          });
        }
        this.newMessage = '';
      } else {
        alert('Unable to send message. Reason: User not logged in.');
      }
    }
  }

  
scrollToBottom(): void {
    try {
      this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
    } catch (err) {
      // safely ignore errors if element not ready
    }
  }
  
}
