import { Component, Input, OnInit } from '@angular/core';
import { MembersService } from '../../_Services/members.service';
import { member } from '../../_models/member';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../_Services/account.service';
import { UserPhoto } from '../../_models/UserPhoto';
@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {

  @Input() member!: member;
  selectedFiles: File[] = [];
  constructor(private memberService: MembersService,private toastr: ToastrService,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFiles = Array.from(input.files);
    }
  }
  onUpload(): void {
    if (!this.selectedFiles.length) return;

    const user = this.accountService.getCurrentUser();
    const formData = new FormData();
    this.selectedFiles.forEach((file, index) => {
      formData.append('files', file); // or `files[${index}]` if backend expects it
    });

    this.memberService.FileUpload(formData).subscribe({
      next: (response : any) => {
       response.forEach(photo => {
          const newPhoto: UserPhoto = {
            PhotoId: photo.PhotoId,
            UserId: this.member.Id,
            FileName: photo.FileName,
            FilePath: photo.FilePath,
            IsMain: 'N'
          };
          this.member.UserPhotos.push(newPhoto);
        }
        );
        this.toastr.success('Upload successful');
        this.selectedFiles = [];
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) {
        fileInput.value = '';
        }
      },
      complete: () => {
      },
      error: err => {
        console.log('Upload error:', err);
        this.toastr.error('Upload failed');
      }
    });
  }

  onReset(fileInput: HTMLInputElement): void {
    this.selectedFiles = [];
    fileInput.value = '';
  }
  onSelectPhoto(photo: UserPhoto): void {
          this.memberService.setMainPhoto(photo).subscribe({
            next: (response: any) => {
              const mainPhoto = this.member.UserPhotos.findIndex(p => p.IsMain === 'Y');
              const currentPhoto = this.member.UserPhotos.findIndex(p => p.PhotoId === photo.PhotoId);
                   if (mainPhoto != -1) {
                      this.member.UserPhotos[mainPhoto].IsMain = 'N';
                   }
                   if (currentPhoto != -1) {
                      this.member.UserPhotos[currentPhoto].IsMain = 'Y';
                   }
                   this.member.MainPhotoUrl = photo.FilePath;
                    this.toastr.success('Main photo updated successfully');
            },
            error: err => {
              console.log('Error setting main photo:', err);
            }
          });
  }
  onDeletePhoto(photo: UserPhoto): void {
    this.memberService.deletePhoto(photo).subscribe({
      next: () => {
        const index = this.member.UserPhotos.findIndex(p => p.PhotoId === photo.PhotoId);
        if (index !== -1) {
          this.member.UserPhotos.splice(index, 1);
          this.toastr.success('Photo deleted successfully');
        }
      },
      error: err => {
        console.log('Error deleting photo:', err);
      }
    });
  }

}
