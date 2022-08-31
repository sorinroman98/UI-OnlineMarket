import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { User } from '../model/user';
import { AuthenticationService } from '../service/authentication.service';
import { NotificationService } from '../service/notification.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public currentLoggedInUsername: string;
  public user: User;
  private titleSubject = new BehaviorSubject<string>('Users');
  public users: User[];

  constructor(private authenticationService: AuthenticationService
    , private userService: UserService, private notifier: NotificationService,
    private router: Router) { }

  ngOnInit(): void {
    this.user = this.authenticationService.getUserFromLocalCache();
    this.currentLoggedInUsername = this.user.username;
  }

  public get isAdmin(): boolean{
   return this.userService.isAdmin;
  }

  public changeTitle(title: string): void {
    this.titleSubject.next(title);
  }
  
}
