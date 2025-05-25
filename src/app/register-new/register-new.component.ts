import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { passwordMatchValidator } from '../_customValidators/passwordMatch';
import { AccountService } from '../_Services/account.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-register-new',
  templateUrl: './register-new.component.html',
  styleUrls: ['./register-new.component.css']
})
export class RegisterNewComponent implements OnInit {

  constructor(private accountService: AccountService,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initilizedForm();
  }

  registerForm: FormGroup = new FormGroup({ });
  initilizedForm(){
    this.registerForm = new FormGroup({
     username: new FormControl('', [Validators.required, Validators.minLength(3)]),
     password : new FormControl('', [
      Validators.required,
       Validators.minLength(6),
        RegisterNewComponent.strongPassword()
      ]),
     confirmPassword : new FormControl( '', [Validators.required, Validators.minLength(6)]),
     dateOfBirth: new FormControl(null, Validators.required)
     
    },
    { validators: passwordMatchValidator }
  );
  }
  register(){
    if(this.registerForm.valid){
    //  console.log(this.registerForm.value);

      const birth: Date = this.registerForm.get('dateOfBirth')?.value;
      console.log(birth);

      this.accountService.register(this.registerForm.value).subscribe({
        next: (response) => {
          this.toastr.success("Registration successful");
          this.registerForm.reset();
        },
        error: (error) => {
          console.log(error);
        }
      });
    }else{
      console.log("Form is invalid");
    }
  }
  static strongPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumeric = /[0-9]/.test(value);
      const isValidLength = value.length >= 8;
      const isValid = hasUpperCase && hasLowerCase && hasNumeric && isValidLength;
      return !isValid ? { strongPassword: true } : null;
    };
  }

  passwordMatchError(): boolean | undefined {
    return this.registerForm.hasError('passwordMismatch') && this.registerForm.get('confirmPassword')?.touched;
  }

  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);
    if (control?.hasError('required')) {
      return `${this.toTitleCase(controlName)} is required.`;
    }
    if (controlName === 'password' && control?.hasError('strongPassword')) {
      return 'Password must be at least 8 characters long and include uppercase, lowercase, and a number.';
    }
    if (controlName === 'confirmPassword' && this.registerForm.hasError('passwordMismatch')) {
      return 'Passwords do not match.';
    }
    return '';
  }
  
  private toTitleCase(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  shouldShowError(controlName: string): boolean {
    const control = this.registerForm.get(controlName);
    if (!control) return false;
    // For confirmPassword, check group-level password mismatch error
    if (controlName === 'confirmPassword') {
      return (control.touched || control.dirty) && this.registerForm.hasError('passwordMismatch');
    }
    return control.invalid && (control.touched || control.dirty);
  }
  


  
}
