import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Auditorium } from '../DataClasses/Auditorium';
import {catchError, Observable} from 'rxjs';
import { AuthService } from './auth.service';



@Injectable({
  providedIn: 'root'
})
export class AuditoriumService {
  constructor(private http:HttpClient, private authService:AuthService) { }

  getAuditoriums(): Observable<HttpResponse<Auditorium[]>>{
    if(localStorage.getItem("access_token")!=null && this.authService.user.roles.includes("SYSTEM_ADMIN")){
      const headers = { 'Authorization': "Bearer " + localStorage.getItem("access_token"),'Content-Type': 'application/json; charset=utf-8' };
      return this.http.get<Auditorium[]>('https://localhost:8443/api/auditorium/',{headers, observe:'response'});
    }
    return null;
  }

  getAuditorium(id: number): Observable<HttpResponse<Auditorium>>{
    if(localStorage.getItem("access_token")!=null && this.authService.user.roles.includes("SYSTEM_ADMIN")){
      const headers = { 'Authorization': "Bearer " + localStorage.getItem("access_token"),'Content-Type': 'application/json; charset=utf-8' };
      return this.http.get<Auditorium>('https://localhost:8443/api/auditorium/'+id,{headers, observe:'response'});
    }
    return null;
  }

  createAuditorium(auditorium: Auditorium): Observable<HttpResponse<Auditorium>>{
    if(localStorage.getItem("access_token")!=null && this.authService.user.roles.includes("SYSTEM_ADMIN")){
      const headers = { 'Authorization': "Bearer " + localStorage.getItem("access_token"),'Content-Type': 'application/json; charset=utf-8' };
      return this.http.post<Auditorium>('https://localhost:8443/api/auditorium/', JSON.stringify(auditorium) ,{headers, observe:'response'});
    }
    return null;
  }

  updateAuditorium(id:number, updatedAuditorium: Auditorium): Observable<HttpResponse<Auditorium>>{
    if(localStorage.getItem("access_token")!=null && this.authService.user.roles.includes("SYSTEM_ADMIN")){
      const headers = { 'Authorization': "Bearer " + localStorage.getItem("access_token"),'Content-Type': 'application/json; charset=utf-8' };
      return this.http.patch<Auditorium>('https://localhost:8443/api/auditorium/'+id, JSON.stringify(updatedAuditorium) ,{headers, observe:'response'});
    }
    return null;
  }

  deleteAuditorium(id:number): Observable<HttpResponse<string>>{
    if(localStorage.getItem("access_token")!=null && this.authService.user.roles.includes("SYSTEM_ADMIN")){
      const headers = { 'Authorization': "Bearer " + localStorage.getItem("access_token"),'Content-Type': 'application/json; charset=utf-8' };
      return this.http.delete<string>('https://localhost:8443/api/auditorium/'+id ,{headers, observe:'response',responseType:'text' as 'json'});
    }
    return null;
  }
}
