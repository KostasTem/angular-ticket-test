import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AppUser} from "../../DataClasses/AppUser";
import {AuthService} from "../../services/auth.service";

import { JwtHelperService } from '@auth0/angular-jwt';
import {PerformanceService} from "../../services/performance.service";
import {DomSanitizer} from "@angular/platform-browser";
import {AppComponent} from "../../app.component";
import {Router} from "@angular/router";

declare var google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,AfterViewInit{
  email: string;
  password: string;

  constructor(private authService:AuthService,private router:Router,private jwtHelper:JwtHelperService,private performanceService:PerformanceService,private sanitizer:DomSanitizer,private appComponent:AppComponent) {
  }
  ngOnInit() {
    if(this.authService.user!=null){
      this.router.navigateByUrl("");
    }
  }

  ngAfterViewInit() {
    google.accounts.id.initialize({
      client_id: "",
      callback: (response: any) => this.authService.handleGoogleSignIn(response)
    });
    google.accounts.id.renderButton(
      document.getElementById("googleButton"),
      { theme: 'outline',
        size: 'large',
        text: 'Sign In With' }  // customization attributes
    );
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
        this.router.navigateByUrl("/");
      }
    });
  }
}
