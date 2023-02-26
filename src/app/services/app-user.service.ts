import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { AppUser } from '../DataClasses/AppUser';

@Injectable({
  providedIn: 'root'
})
export class AppUserService {
  constructor(private http:HttpClient, private authService:AuthService) { }

  getUsers(): Observable<HttpResponse<AppUser[]>>{
    if(localStorage.getItem("access_token")!=null && this.authService.user.roles.includes("SYSTEM_ADMIN")){
      const headers = { 'Authorization': "Bearer " + localStorage.getItem("access_token"),'Content-Type': 'application/json; charset=utf-8' };
      return this.http.get<AppUser[]>('https://localhost:8443/api/user/',{headers, observe:'response'});
    }
    return null;
  }

  getUser(email: string): Observable<HttpResponse<AppUser>>{
    if(localStorage.getItem("access_token")!=null && this.authService.user.roles.includes("SYSTEM_ADMIN")){
      const headers = { 'Authorization': "Bearer " + localStorage.getItem("access_token"),'Content-Type': 'application/json; charset=utf-8' };
      return this.http.get<AppUser>('https://localhost:8443/api/user/'+email,{headers, observe:'response'});
    }
    return null;
  }

  updateUser(email:string, roles:string[], showID: number): Observable<HttpResponse<AppUser>>{
    const body = {"roles": roles, "showID": showID};
    if(localStorage.getItem("access_token")!=null && this.authService.user.roles.includes("SYSTEM_ADMIN")){
      const headers = { 'Authorization': "Bearer " + localStorage.getItem("access_token"),'Content-Type': 'application/json; charset=utf-8' };
      return this.http.patch<AppUser>('https://localhost:8443/api/user/'+email, JSON.stringify(body),{headers, observe:'response'});
    }
    return null;
  }
}
