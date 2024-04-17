import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss', './navbar-responsive.component.scss', './navbar-aside.component.scss']
})



export class NavbarComponent implements OnInit {
    userLoggedIn: boolean = false;
    user: {} = ''
    userPhotoURL: string = '';
    userName: string = '';
    userEmail: string = ''
    userDropdownOpen: boolean = false;
    menuBarsDisplayed: boolean = true;
    menuVisited: boolean = false;
    menuOpen:boolean = false;

    constructor(private authService: AuthService, private router: Router) {
      
    }

    ngOnInit(): void {
      console.log(environment.USER)
      this.user = environment.USER
      this.userPhotoURL = environment.USER_PHOTO_URL
      this.userName = environment.USER_NAME
      this.userEmail = environment.USER_EMAIL
      if( this.user && Object.keys(this.user).length > 0) {
        this.userLoggedIn = true
        this.menuBarsDisplayed = false
      } else {
        this.userLoggedIn = false
      }
    }

  logout(): void {
    this.authService.signOutUser()
    .then(() => {
      this.userLoggedIn = false;
      this.menuBarsDisplayed = true;
      this.router.navigate(['/']);
      
    })
    .catch((error) => {
      console.error(error)
    })
  }

  toogleMenu() {
    this.menuVisited = true;
    this.menuOpen = !this.menuOpen;    
  }


  toggleDropDown() {
    this.userDropdownOpen = !this.userDropdownOpen;
  }
}

