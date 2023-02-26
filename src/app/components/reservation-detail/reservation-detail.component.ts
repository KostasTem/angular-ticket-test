import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Show } from 'src/app/DataClasses/Show';
import { Ticket } from 'src/app/DataClasses/Ticket';
import { AuthService } from 'src/app/services/auth.service';
import { ReservationService } from 'src/app/services/reservation.service';
import { TicketService } from 'src/app/services/ticket.service';

@Component({
  selector: 'app-reservation-detail',
  templateUrl: './reservation-detail.component.html',
  styleUrls: ['./reservation-detail.component.css']
})
export class ReservationDetailComponent implements OnInit{

  ticket_list:Ticket[][];
  
  selected_tickets: string[] = [];

  show:Show;

  constructor(private authService:AuthService,private ticketService:TicketService,private reservationService:ReservationService,private router:Router,private route:ActivatedRoute){}

  ngOnInit(): void {
    if(this.authService.user==null){
      this.router.navigateByUrl("/");
      return;
    }
    const id =+ this.route.snapshot.paramMap.get('id');
    if(!Number.isNaN(id)){
      this.ticketService.getTickets(id).subscribe(res =>
        {
          if(res.status==200){
            var a, b, a1, b1, rx=/(\d+)|(\D+)/g, rd=/\d+/;
            const temp = res.body.tickets;
            temp.sort(function(as, bs){
              a= String(as.seat).toLowerCase().match(rx);
              b= String(bs.seat).toLowerCase().match(rx);
              while(a.length && b.length){
                  a1= a.shift();
                  b1= b.shift();
                  if(rd.test(a1) || rd.test(b1)){
                      if(!rd.test(a1)) return 1;
                      if(!rd.test(b1)) return -1;
                      if(a1!= b1) return a1-b1;
                  }
                  else if(a1!= b1) return a1> b1? 1: -1;
              }
              return a.length- b.length;
            });
            this.ticket_list = this.chunkArrayInGroups(temp,res.body.show.auditorium.seatsPerRow);  
            this.show = res.body.show;
            this.show.dateTime = new Date(Date.parse(this.show.dateTime.toString()));
          }
        })
    }
  }

  select_seat(seat:string){
    if(this.selected_tickets.includes(seat)){
      this.selected_tickets.splice(this.selected_tickets.indexOf(seat),1);
    }
    else{
      if(this.selected_tickets.length<10){
        this.selected_tickets.push(seat);
      }
      else{
        alert("You can't reserve more than 10 seats.");
      }
    }
  }

  chunkArrayInGroups(arr, size) {
    var myArray = [];
    for(var i = 0; i < arr.length; i += size) {
      myArray.push(arr.slice(i, i+size));
    }
    return myArray;
  }

  make_reservation(){
    this.reservationService.createReservation(this.show.id,this.selected_tickets).subscribe(res =>
      {
        if(res.status==200){
          console.log(res.body);
          this.router.navigateByUrl("/reservations");
        }
      });
  }
}
