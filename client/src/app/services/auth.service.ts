import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {

  // domain = ""; // Production
  domain = environment.domain;
  authToken;
  user;
  options;

  constructor(
    private http: Http
  ) { }

  
  createAuthenticationHeaders() {
    this.loadToken(); 
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json', 
        'authorization': this.authToken 
      })
    });
  }

 
  loadToken() {
    this.authToken = localStorage.getItem('token');; // Get token and asssign to variable to be used elsewhere
  }
  registerUser(user) {
    return this.http.post(this.domain + 'authentication/register', user).map(res => res.json());
  }
checkUsername(username) {
    return this.http.get(this.domain + 'authentication/checkUsername/' + username).map(res => res.json());
  }
checkEmail(email) {
    return this.http.get(this.domain + 'authentication/checkEmail/' + email).map(res => res.json());
  }
login(user) {
    return this.http.post(this.domain + 'authentication/login', user).map(res => res.json());
  }
  logout() {
    this.authToken = null; 
    this.user = null; 
    localStorage.clear(); 
  }


  storeUserData(token, user) {
    localStorage.setItem('token', token); 
    localStorage.setItem('user', JSON.stringify(user)); 
    this.authToken = token; 
    this.user = user; 
  }


  getProfile() {
    this.createAuthenticationHeaders(); 
    return this.http.get(this.domain + 'authentication/profile', this.options).map(res => res.json());
  }

  
  getPublicProfile(username) {
    this.createAuthenticationHeaders(); 
    return this.http.get(this.domain + 'authentication/publicProfile/' + username, this.options).map(res => res.json());
  }


  loggedIn() {
    return tokenNotExpired();
  }

}
