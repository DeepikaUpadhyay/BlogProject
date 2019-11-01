import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  messageClass;
  message;
  processing = false;
  form;
  previousUrl;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private authGuard: AuthGuard
  ) {
    this.createForm(); // Create Login Form when component is constructed
  }

  // Function to create login form
  createForm() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required], // Username field
      password: ['', Validators.required] // Password field
    });
  }

  // Function to disable form
  disableForm() {
    this.form.controls['username'].disable(); // Disable username field
    this.form.controls['password'].disable(); // Disable password field
  }

  // Function to enable form
  enableForm() {
    this.form.controls['username'].enable(); // Enable username field
    this.form.controls['password'].enable(); // Enable password field
  }

  // Functiont to submit form and login user
  onLoginSubmit() {
    this.processing = true; // Used to submit button while is being processed
    this.disableForm(); // Disable form while being process
    // Create user object from user's input
    const user = {
      username: this.form.get('username').value, // Username input field
      password: this.form.get('password').value // Password input field
    }

  
    this.authService.login(user).subscribe(data => {
     
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message; 
        this.processing = false; 
        this.enableForm(); 
      } else {
        this.messageClass = 'alert alert-success'; 
        this.message = data.message; 
  
        this.authService.storeUserData(data.token, data.user);
       
        setTimeout(() => {
         
          if (this.previousUrl) {
            this.router.navigate([this.previousUrl]); // Redirect to page they were trying to view before
          } else {
            this.router.navigate(['/dashboard']); 
          }
        }, 2000);
      }
    });
  }

  ngOnInit() {
    
    if (this.authGuard.redirectUrl) {
      this.messageClass = 'alert alert-danger'; 
      this.message = 'You must be logged in to view that page.'; 
      this.previousUrl = this.authGuard.redirectUrl; 
      this.authGuard.redirectUrl = undefined; 
    }
  }

}
