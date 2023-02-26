import { Component,OnInit } from '@angular/core';
import { AuditoriumService } from 'src/app/services/auditorium.service';
import { Auditorium } from 'src/app/DataClasses/Auditorium';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-auditorium',
  templateUrl: './auditorium.component.html',
  styleUrls: ['./auditorium.component.css']
})
export class AuditoriumComponent implements OnInit {

  auditorium_list: Auditorium[];

  constructor(private auditoriumService:AuditoriumService,private authService:AuthService,private router:Router){}
  
  ngOnInit(): void {
    if(this.authService.user==null || !this.authService.user.roles.includes("SYSTEM_ADMIN")){
      this.router.navigateByUrl("/");
      return;
    }
    this.get_auditoriums();
  }

  delete_auditorium(id: number){
    this.auditoriumService.deleteAuditorium(id).subscribe(res => {
      if(res.status==200){
        console.log(res.body);
        this.get_auditoriums();
      }
    });
  }
  get_auditoriums(){
    this.auditoriumService.getAuditoriums().subscribe(res => {
      if(res.status==200){
        this.auditorium_list = res.body
        this.auditorium_list.sort(function(a, b) {
          var textA = a.name.toUpperCase();
          var textB = b.name.toUpperCase();
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      })
      }
    });
  }
}
