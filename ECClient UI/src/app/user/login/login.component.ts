import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FirstKeyPipe } from '../../shared/pipes/first-key.pipe';
import { AuthService } from '../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { AUTH_TOKEN_KEY } from '../../shared/constants';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterModule, FirstKeyPipe],
  templateUrl: './login.component.html',
  styles: ``
})
export class LoginComponent {
  loginForm!: FormGroup;
  isSubmitted: boolean = false;
  hasErrorMessage: boolean = false;
  errorMessage: string = '';  

  constructor(public fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router) { }

  ngOnInit() {
    const authenticated = this.authService.isAuthenticated();
    if (authenticated) {
      this.router.navigateByUrl('/dashboard');
    }
    
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
      this.isSubmitted = true;

      this.authService.login(this.loginForm.value).subscribe({
        next: (response: any) => {
          // console.log('Login successful:', response);
          // this.toastr.success('Login successful!');
          this.authService.saveToken(response.token);
          this.router.navigateByUrl('/dashboard');
          this.isSubmitted = false; 
        },
        error: (error: any) => {
          this.hasErrorMessage = true;

          if (error.status == 400) {
            this.errorMessage = error.error
          }else{
            this.errorMessage = 'An error occurred during login.';
          }
          
          this.isSubmitted = false;
        }
       
      });

    } 
  }

    hasError(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }
}