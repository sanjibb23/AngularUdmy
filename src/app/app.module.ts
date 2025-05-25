import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'; // This is the missing one
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ReactiveFormsModule } from '@angular/forms';
import {FormsModule} from '@angular/forms'
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { AccountService } from './_Services/account.service';
import { HomeComponent } from './Home/Home.component';
import { RegisterComponent } from './register/register.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MemberDetailsComponent } from './members/member-details/member-details.component';
import { MessageComponent } from './message/message.component';
import { ListsComponent } from './lists/lists.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorInterceptor } from './_interceptors/error.interceptor';
import { MembersService } from './_Services/members.service';
import { MemberCardComponent } from './members/member-card/member-card.component';
import { JwtInterceptor } from './_interceptors/jwt.interceptor';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
//import { ErrorHandel } from './_interceptors/ErrorHandel';
import { NgxSpinnerModule } from "ngx-spinner";
import { BusyService } from './_Services/busy.service';
import { LoadingInterceptor } from './_interceptors/loading.interceptor';
import { PhotoEditorComponent } from './members/photo-editor/photo-editor.component';
import { RegisterNewComponent } from './register-new/register-new.component';
import { MemberListFilterComponent } from './members/member-list-filter/member-list-filter.component';
import { LikesService } from './_Services/likes.service';
import { SignalRService } from './_Services/signalr.service';
import { PresenceService } from './_Services/presence.service';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HomeComponent,
    RegisterComponent,
    MemberListComponent,
    MemberDetailsComponent,
    MessageComponent,
    ListsComponent,
    MemberCardComponent,
    MemberEditComponent,
    PhotoEditorComponent,
    RegisterNewComponent,
    MemberListFilterComponent
    
  ],
  imports: [
    
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      timeOut: 3000,
      closeButton: true
    }),
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule

  ],
  providers: [  AccountService,
                MembersService,
                BusyService,
                LikesService,
                SignalRService,
                PresenceService,
                {
                  provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi:true
                },
                {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi:true},
                {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi:true},

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
