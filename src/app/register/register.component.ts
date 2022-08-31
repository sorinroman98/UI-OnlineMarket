import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationType } from '../enum/notification-type.enum';
import { User } from '../model/user';
import { AuthenticationService } from '../service/authentication.service';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  showLoading: boolean;
  private subscription: Subscription[] = [];

  constructor(private router: Router, private authenticationService: AuthenticationService,
    private notifier: NotificationService) { }


  ngOnInit(): void {
    if (this.authenticationService.isUserLoggedIn()) {
      this.router.navigateByUrl('/user/management');
    }
  }

  public onRegister(user: User): void {
    this.showLoading = true;
    console.log(user);
    this.subscription.push(
      this.authenticationService.register(user).subscribe(
        (response: User) => {
            this.showLoading = false;
            this.sendNotification(NotificationType.SUCCESS, `New account was created for ${response.firstName}. Please check your email for password to log in`);
        }, (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.showLoading = false;
        }
      )
    );
  }


  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notifier.notify(notificationType, message);
    } else {
      this.notifier.notify(notificationType, "An error occured. Please try again");
    }
  }

  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
  }
}
