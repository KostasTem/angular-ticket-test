import { Component,AfterViewInit } from '@angular/core';

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
export class AppComponent implements AfterViewInit{
  email: string;
  password: string;
  num: number;
  user: AppUser = null;
  reservation_list: ReservationResponse[];
  show_list: Show[];
  auditorium_list:Auditorium[];
  imageSrc;
  constructor(private showService:ShowService, private performanceService:PerformanceService,private jwtHelper:JwtHelperService,private authService:AuthService,private reservationService:ReservationService,private sanitizer:DomSanitizer){}

  ngAfterViewInit(): void {
    google.accounts.id.initialize({
      client_id: "828794899730-o8d8o76vll1mu6eff1ngile60u5k4re8.apps.googleusercontent.com",
      callback: (response: any) => this.authService.handleGoogleSignIn(response)
    });
    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { size: "large", type: "icon", shape: "pill" }  // customization attributes
    );
  }

  check_user(){
    return this.authService.user != null;
  }

  check_user_role(){
    return this.authService.user.roles;
  }
  make_reservation(){
    this.reservationService.createReservation(this.num,["A1","B1","C1"]).subscribe(res => console.log(res.body));
  }
  
  login(){
    this.authService.login(this.email, this.password).subscribe(response => {
      if(response.status==200){
          localStorage.setItem("access_token",response.body.token);
          const dec_data = this.jwtHelper.decodeToken(response.body.token);
          this.authService.user = new AppUser(dec_data.sub,dec_data.roles.split(" "),new Date(dec_data.exp));
          if(this.authService.user.roles.includes("ADMIN")){
            this.performanceService.getPerformance().subscribe(res => this.authService.performance = res.body)
          }
          this.imageSrc = response.body.user.image!=null ? this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' 
            + response.body.user.image.split(",")[1]):"";
      }
    });
  }
  logout(){
    this.authService.logout();
  }
  test_auth(){
  this.showService.getShows().subscribe(res => {
    let show: Show = res.body.at(1).shows.find(s => s.performance.name === "Performance 1");
    console.log(show);
    this.showService.deleteShow(show.id).subscribe(res => console.log(res.body));
  });
  }
}
