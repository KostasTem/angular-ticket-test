import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppUser } from 'src/app/DataClasses/AppUser';
import { AppUserService } from 'src/app/services/app-user.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  user_list:AppUser[];
  constructor(private appUserService:AppUserService,private authService:AuthService,private router:Router){}

  ngOnInit(): void {
    if(this.authService.user==null || !this.authService.user.roles.includes("SYSTEM_ADMIN")){
      this.router.navigateByUrl("");
      return;
    }
    this.appUserService.getUsers().subscribe(res =>
      {
        if(res.status==200){
          this.user_list = res.body;
          this.user_list.sort(function(a, b) {
            var textA = a.email.toUpperCase();
            var textB = b.email.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        })
        }
      }); 
  }

}
