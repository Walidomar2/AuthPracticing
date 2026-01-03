import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FirstKeyPipe } from '../../shared/pipes/first-key.pipe';
import { AuthService } from '../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterModule, FirstKeyPipe],
  templateUrl: './login.component.html',
  styles: ``
})
export class LoginComponent {
  loginForm!: FormGroup;
  isSubmitted: boolean = false;

  constructor(public fb: FormBuilder, private authService: AuthService, private toastr: ToastrService) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.loginForm = this.fb.group({
      userNameOrEmail: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response: any) => {
          this.toastr.success('Login successful!'); 
        },
        error: (error: any) => {
          this.toastr.error(error.error.message || 'Login failed. Please try again.');
        }
      });
    } 
  }

    hasError(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }
}