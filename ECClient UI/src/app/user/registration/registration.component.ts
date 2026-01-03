import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { FirstKeyPipe } from '../../shared/pipes/first-key.pipe';
import { AuthService } from '../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-registration',
  imports: [ReactiveFormsModule, CommonModule, FirstKeyPipe, RouterModule],
  templateUrl: './registration.component.html',
  styles: ``
})
export class RegistrationComponent {
  registerForm!: FormGroup;
  isSubmitted: boolean = false;

  constructor(public fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router) { }

  ngOnInit() {

    const authenticated = this.authService.isAuthenticated();
    if (authenticated) {
      this.router.navigateByUrl('/dashboard');
    }

    this.buidForm();
  }

  buidForm() {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      userName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/(?=.*[^a-zA-Z0-9])/)]],
      confirmPassword: ['', [Validators.required]]
    },
      {
        validators: this.matchPasswordValidator
      });
  }

  matchPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }

    return null;
  };

  onSubmit() {
    this.isSubmitted = true;
    if (this.registerForm.valid) {
      this.authService.createUser(this.registerForm.value).subscribe({
        next: (response: any) => {
          this.isSubmitted = false;
          this.registerForm.reset();
          this.toastr.success('New user created!', 'Registration successful');
        },
        error: (error: any) => {
          if (Array.isArray(error.error)) {
            error.error.forEach((err: any) => {
              switch (err.code) {
                case "DuplicateUserName":
                  this.toastr.error('Username already exists. Please choose another username.', 'Registration failed');
                  break;
                case "DuplicateEmail":
                  this.toastr.error('Email already exists. Please use another email.', 'Registration failed');
                  break;
                default:
                  this.toastr.error(err.description, 'Registration failed');
                  break;
              }
            });
          } else {
            this.toastr.error('Registration failed. Please try again.', 'Error');
          }
          this.isSubmitted = false;
        }

      });
    }
  }


  hasError(controlName: string): boolean {
    const control = this.registerForm.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }
}