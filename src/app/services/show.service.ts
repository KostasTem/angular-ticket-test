import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ShowList } from '../DataClasses/ShowList'
import { Show } from '../DataClasses/Show';
import { AuthService } from './auth.service';
import { Auditorium } from '../DataClasses/Auditorium';


@Injectable({
  providedIn: 'root'
})
export class ShowService {
  constructor(private http:HttpClient,private authService:AuthService) { }

  getShows(): Observable<HttpResponse<ShowList[]>>{
    const headers = { 'access-control-allow-origin': "*",'Content-Type': 'application/json; charset=utf-8' };
    return this.http.get<ShowList[]>('https://localhost:8443/api/show/future',{headers, observe:'response'});
  }

  getShowsForPerformance(id: number): Observable<HttpResponse<Show[]>>{
    if(localStorage.getItem("access_token")!=null){
      const headers = {'Content-Type': 'application/json; charset=utf-8' };
      return this.http.get<Show[]>('https://localhost:8443/api/show/performance/'+ id,{headers, observe:'response'});
    }
    return null;
  }

  getShow(id:number): Observable<HttpResponse<Show>>{
    const headers = { 'access-control-allow-origin': "*",'Content-Type': 'application/json; charset=utf-8' };
    return this.http.get<Show>('https://localhost:8443/api/show/'+id,{headers, observe:'response'});
  }

  getAvailableAuditoriums(date:Date): Observable<HttpResponse<Auditorium[]>>{
    const show = new Show(null,date,null,null); 
    if(localStorage.getItem("access_token")!=null && this.authService.user.roles.includes("ADMIN")){
      const headers = { 'Authorization': "Bearer " + localStorage.getItem("access_token"),'Content-Type': 'application/json; charset=utf-8' };
      return this.http.post<Auditorium[]>('https://localhost:8443/api/show/available', JSON.stringify(show),{headers, observe:'response'});
    }
    return null;
  }

  createShow(show: Show): Observable<HttpResponse<Show>>{
    const body = JSON.stringify(show);
    if(localStorage.getItem("access_token")!=null && this.authService.user.roles.includes("ADMIN")){
      const headers = { 'Authorization': "Bearer " + localStorage.getItem("access_token"),'Content-Type': 'application/json; charset=utf-8' };
      return this.http.post<Show>('https://localhost:8443/api/show/', body,{headers, observe:'response'});
    }
    return null;
  }
  updateShow(id: number, updatedShow: Show): Observable<HttpResponse<Show>>{
    const body = JSON.stringify(updatedShow);
    if(localStorage.getItem("access_token")!=null && this.authService.user.roles.includes("ADMIN")){
      const headers = { 'Authorization': "Bearer " + localStorage.getItem("access_token"),'Content-Type': 'application/json; charset=utf-8' };
      return this.http.patch<Show>('https://localhost:8443/api/show/'+id, body,{headers, observe:'response'});
    }
    return null;
  }
  deleteShow(id: number): Observable<any>{
    if(localStorage.getItem("access_token")!=null && this.authService.user.roles.includes("ADMIN")){
      const headers = { 'Authorization': "Bearer " + localStorage.getItem("access_token"),'Content-Type': 'application/json; charset=utf-8' };
      return this.http.delete<string>('https://localhost:8443/api/show/'+id,{headers, observe:'response', responseType: 'text' as 'json'});
    }
    return null;
  }
}
