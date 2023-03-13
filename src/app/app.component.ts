import {Component, AfterViewInit, OnInit, ViewEncapsulation} from '@angular/core';

import { AuthService } from './services/auth.service';
import { ShowService } from './services/show.service';
import { Performance } from './DataClasses/Performance';
import { AppUser } from './DataClasses/AppUser';
import { ReservationService } from './services/reservation.service';
import { ReservationResponse } from './DataClasses/ReservationResponse';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Auditorium } from './DataClasses/Auditorium';
import { PerformanceService } from './services/performance.service';
import { DomSanitizer } from '@angular/platform-browser';
import {MatCalendarCellClassFunction} from "@angular/material/datepicker";
import {ShowList} from "./DataClasses/ShowList";
import {Router} from "@angular/router";
import {Show} from "./DataClasses/Show";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit{
  imageSrc;
  constructor(private showService:ShowService, private performanceService:PerformanceService,private jwtHelper:JwtHelperService,private authService:AuthService,private reservationService:ReservationService,private sanitizer:DomSanitizer,private router:Router){}

  ngOnInit(): void {
      if(localStorage.getItem("access_token")!=null){
        this.authService.user = JSON.parse(localStorage.getItem("user"));
        if(localStorage.getItem("performance")!=null){
          this.authService.performance = JSON.parse(localStorage.getItem("performance"));
        }
      }
  }

  check_user(){
    return this.authService.user != null;
  }

  check_user_role(){
    return this.authService.user.roles;
  }

  logout(){
    this.authService.logout();
  }
}
