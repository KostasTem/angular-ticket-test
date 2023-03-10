import {AfterViewInit, Component, SecurityContext} from '@angular/core';
import {MatCalendarCellClassFunction} from "@angular/material/datepicker";
import {Show} from "../../DataClasses/Show";
import {Router} from "@angular/router";
import {ShowService} from "../../services/show.service";
import {ShowList} from "../../DataClasses/ShowList";
import {DomSanitizer} from "@angular/platform-browser";


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements AfterViewInit{
  selectedDate:Date=null;
  selectedPer:number = null;
  selectedShow:Show = null;
  datesWithShows:string[] = [];
  uniquePerformances = [];
  randomPerformances = [];
  show_list:ShowList[];
  images = [];
  tempVal;

  constructor(private router:Router,private showService:ShowService,private sanitizer:DomSanitizer) {
  }

  ngAfterViewInit() {
    if(localStorage.getItem("tempShowID")!=null && localStorage.getItem("access_token")!=null){
      const showID = localStorage.getItem("tempShowID");
      localStorage.removeItem("tempShowID");
      this.router.navigateByUrl("/reservations/new/"+String(showID));
      return;
    }
    this.showService.getShows().subscribe(res => {
      if(res.status==200){
        this.show_list=res.body;
        this.show_list.forEach(showD =>
        {
          showD.date = new Date(Date.parse(showD.date.toString()))
          showD.date.setHours(0);
          this.datesWithShows.push(showD.date.toISOString());
          showD.shows.forEach(show =>{
            if(!this.uniquePerformances.find(per => show.performance.id == per.id)){
              this.uniquePerformances.push(show.performance);
            }
          });
        });
        const shuffled = this.uniquePerformances.sort(() => 0.5 - Math.random());
        this.randomPerformances = shuffled.slice(0, 5);
        this.randomPerformances.at(0).image = "https://images.unsplash.com/photo-1677066684071-3f61f898b9a7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1965&q=80";
        this.randomPerformances.at(1).image = "https://images.unsplash.com/photo-1677001722073-b6af34fe73e1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80";
      }
    });
  }

  select_date(){
    if(this.selectedPer==null){
      const showDay = this.show_list.find(showD => showD.date.getTime() == this.selectedDate.getTime());
      if(showDay!=null){
        this.uniquePerformances = [];
        showDay.shows.forEach(show => this.uniquePerformances.push(show.performance));
      }
    }
    else{
      this.select_show()
    }
  }
  select_performance(event){
    this.selectedPer = Number(event.source.value);
    if(this.selectedDate==null || this.show_list.find(showD => showD.date.getTime()==this.selectedDate.getTime())==null){
      this.datesWithShows = [];
      this.show_list.forEach(showDay =>{
        if(showDay.shows.find(show => show.performance.id==this.selectedPer)){
          this.datesWithShows.push(showDay.date.toISOString());
        }
      });
    }
    else{
      this.select_show()
    }
  }

  select_show(){
    const showDay = this.show_list.find(showD => new Date(Date.parse(showD.date.toString())).getTime() == this.selectedDate.getTime());
    if(showDay!=null) {
      this.selectedShow = showDay.shows.find(show => show.performance.id == this.selectedPer);
    }
  }

  reservation_redirect(){
    if(localStorage.getItem("access_token")==null){
      alert("You need to sign in before making a reservation");
      localStorage.setItem("tempShowID",String(this.selectedShow.id));
      this.router.navigateByUrl("login");
    }
    else{
      this.router.navigateByUrl("/reservations/new/"+this.selectedShow.id);
    }
  }

  dateClass:MatCalendarCellClassFunction<Date> = (cellDate,view ) => {
    const highlightDate = this.datesWithShows
      .map(strDate => new Date(strDate))
      .some(d => d.getDate() === cellDate.getDate() && d.getMonth() === cellDate.getMonth() && d.getFullYear() === cellDate.getFullYear());

    return highlightDate
      ? ["custom-date-class"]
      : undefined;
  };
}
