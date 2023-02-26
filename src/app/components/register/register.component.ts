import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AppUser } from 'src/app/DataClasses/AppUser';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  @Input() user:AppUser = new AppUser(null,null,null);
  imageFile;
  confirm:string = "";

  constructor(private authService:AuthService,private router:Router){}

  load_image(event: Event){
    var eventTarget = (event.target as HTMLInputElement);
    if(eventTarget){
      this.imageFile = eventTarget.files[0];
      var fr = new FileReader();
      fr.onload = this._handleReader.bind(this);
      fr.readAsDataURL(eventTarget.files[0]);
    }
  }
  _handleReader(readerEvent){
    this.user.image = readerEvent.target.result;
  }

  register(){
    if(this.confirm==this.user.password){
      this.authService.register(this.user).subscribe(res => {
        if(res.status==200){
          this.router.navigateByUrl("/");
        }
        else{
          alert(res.headers.get("Error-Message"));
        }
      });
    }
    else{
      alert("Passwords Don't Match");
    }
  }

}
