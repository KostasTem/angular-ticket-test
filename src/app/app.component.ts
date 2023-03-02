import { Component,AfterViewInit, OnInit } from '@angular/core';

import { AuthService } from './services/auth.service';
import { ShowService } from './services/show.service';
import { Show } from './DataClasses/Show';
import { AppUser } from './DataClasses/AppUser';
import { ReservationService } from './services/reservation.service';
import { ReservationResponse } from './DataClasses/ReservationResponse';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Auditorium } from './DataClasses/Auditorium';
import { PerformanceService } from './services/performance.service';
import { DomSanitizer } from '@angular/platform-browser';

declare var google: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit,OnInit{
  email: string;
  password: string;
  reservation_list: ReservationResponse[];
  show_list: Show[];
  auditorium_list:Auditorium[];
  imageSrc;
  constructor(private showService:ShowService, private performanceService:PerformanceService,private jwtHelper:JwtHelperService,private authService:AuthService,private reservationService:ReservationService,private sanitizer:DomSanitizer){}

  ngAfterViewInit(): void {
  }
  ngOnInit(): void {
      if(localStorage.getItem("access_token")!=null){
        this.authService.user = JSON.parse(localStorage.getItem("user"));
        if(localStorage.getItem("performance")!=null){
          this.authService.performance = JSON.parse(localStorage.getItem("performance"));
        }
        if(this.authService.user.image!=null){
          this.imageSrc = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' 
          + this.authService.user.image);
        }
      }
  }

  check_user(){
    return this.authService.user != null;
  }

  check_user_role(){
    return this.authService.user.roles;
  }
  
  login(){
    this.authService.login(this.email, this.password).subscribe(response => {
      if(response.status==200){
          this.email = "";
          this.password = "";
          localStorage.setItem("access_token",response.body.token);
          const dec_data = this.jwtHelper.decodeToken(response.body.token);
          this.authService.user = new AppUser(dec_data.sub,dec_data.roles.split(" "),new Date(dec_data.exp));
          localStorage.setItem("user",JSON.stringify(this.authService.user));
          if(this.authService.user.roles.includes("ADMIN")){
            this.performanceService.getPerformance().subscribe(res =>
              { 
                this.authService.performance = res.body
                localStorage.setItem("performance",JSON.stringify(res.body));
              });
          }
          if(response.body.user.image!=null){
            this.imageSrc = response.body.user.image!=null ? this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' 
              + response.body.user.image.split(",")[1]):"";
          }
      }
    });
  }
  logout(){
    this.authService.logout();
  }
}
