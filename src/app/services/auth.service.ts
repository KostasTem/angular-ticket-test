import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppUser } from '../DataClasses/AppUser';
import { JwtHelperService } from '@auth0/angular-jwt';
import { PerformanceService } from './performance.service';
import { Performance } from '../DataClasses/Performance';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: AppUser = null;

  performance: Performance = null;

  constructor(private http:HttpClient,private jwtHelper: JwtHelperService, private performanceService:PerformanceService,private router:Router) { }
  handleGoogleSignIn(response: any) {
    const headers = { 'Content-Type': 'application/json; charset=utf-8' };
    const body = { googleToken: response.credential }
    this.http.post<any>('https://localhost:8443/api/auth/google', JSON.stringify(body), {headers}).subscribe(data => {
      console.log(data);
  });
  }
  register(user:AppUser){
    const headers = {"Content-Type":'application/json'};
    return this.http.post<any>('https://localhost:8443/api/auth/register', JSON.stringify(user), {headers, observe: 'response'});
  }
  login(email: string, password: string){
    const data = {
      "username": email,
      "password": password
    };
    const headers = {'access-control-allow-origin': "*","Content-Type":'application/json'};
    return this.http.post<any>('https://localhost:8443/api/auth/login', JSON.stringify(data), {headers, observe:'response'});
  }
  logout(){
    if(localStorage.getItem("access_token")!=null){
        localStorage.removeItem("access_token");
        this.user = null;
        this.performance = null
        this.router.navigateByUrl("");
    }
  }
}
