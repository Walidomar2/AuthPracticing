import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-registration',
  imports: [ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styles: ``
})
export class RegistrationComponent {
  registerForm!: FormGroup;
  
  constructor(public fb: FormBuilder) { }

  ngOnInit() {
    this.buidForm();
  }

  buidForm(){
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  onSubmit(){
    if(this.registerForm.valid){
      console.log(this.registerForm.value);
    } else {
      console.log("Form is not valid");
    }
  }
}