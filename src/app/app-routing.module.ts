import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './Home/Home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MemberDetailsComponent } from './members/member-details/member-details.component';
import { MessageComponent } from './message/message.component';
import { ListsComponent } from './lists/lists.component';
import { AuthGuard } from './_routeGuards/auth.guard';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { PreventUnsavedChangesGuard } from './_routeGuards/prevent-unsaved-changes.guard';
import { RegisterNewComponent } from './register-new/register-new.component';

const routes: Routes = [

  {path: '', component:HomeComponent},
  {path: 'home', component: HomeComponent},
  {path:'register',component: RegisterNewComponent},
  {
    path:'',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
              {path:'members',component: MemberListComponent},
              {path: 'members/:username', component: MemberDetailsComponent},
              {path: 'messages', component: MessageComponent},
              {path: 'list', component: ListsComponent}
              ]

  },
  {path: 'member/edit', component: MemberEditComponent,canDeactivate: [PreventUnsavedChangesGuard]},
  {path: '**', component: HomeComponent, pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
