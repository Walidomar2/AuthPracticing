import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AUTH_TOKEN_KEY } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  baseUrl: string = 'http://localhost:4000/api/users';

  createUser(formData: any) {
    return this.http.post(`${this.baseUrl}/signup`, formData);
  }

  login(formData: any) {
    return this.http.post(`${this.baseUrl}/login`, formData);
  }

  logout() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }

  saveToken(token: string) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    return !!token;
  }
}
