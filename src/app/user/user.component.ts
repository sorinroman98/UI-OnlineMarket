import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { NotificationType } from '../enum/notification-type.enum';
import { Role } from '../enum/role.enum';
import { CustomHttpResponse } from '../model/custom-http-response';
import { FileUploadStatus } from '../model/file-upload.status';
import { User } from '../model/user';
import { AuthenticationService } from '../service/authentication.service';
import { NotificationService } from '../service/notification.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {
  private titleSubject = new BehaviorSubject<string>('Users');
  public titleAction$ = this.titleSubject.asObservable();
  public users: User[];
  public user: User;
  public refreshing: boolean;
  private subscriptions: Subscription[] = [];
  public selectedUser: User;
  public fileName: string;
  public profileImage: File;
  public editUser = new User();
  private currentUsername: string;
  public currentLoggedInUsername: string;
  public fileStatus = new FileUploadStatus();


  constructor(private authenticationService: AuthenticationService
    , private userService: UserService, private notifier: NotificationService,
    private router: Router) { }

  ngOnInit(): void {
    this.user = this.authenticationService.getUserFromLocalCache();
    this.getUsers(true);
    this.currentLoggedInUsername = this.user.username;
  }

  public changeTitle(title: string): void {
    this.titleSubject.next(title);
  }

  public getUsers(showNotification: boolean) {
    this.refreshing = true;
    this.subscriptions.push();
    this.userService.getUsers().subscribe(
      (response: User[]) => {
        this.userService.addUsersToLocaleCache(response);
        this.users = response;
        this.refreshing = false;

        if (showNotification) {
          this.sendNotification(NotificationType.SUCCESS, `${response.length} user(s) loaded successfully`);
        }
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        this.refreshing = false;
      }
    )
  }

  public onSelectedUser(selectedUser: User): void {
    this.selectedUser = selectedUser;
    this.clickButton("openUserInfo");
  }

  public saveNewUser(): void {
    this.clickButton("new-user-save");
  }

  public onAddNewUser(userForm: NgForm): void {
    const formData = this.userService.createUserFormData(null, userForm.value, this.profileImage);

    this.subscriptions.push(
      this.userService.addUser(formData).subscribe(
        (response: User) => {
          this.clickButton('new-user-close');
          this.getUsers(false);
          this.fileName = null;
          this.profileImage = null;
          userForm.reset();
          this.sendNotification(NotificationType.SUCCESS, `New account was created for ${response.firstName}. Please check your email for password to log in`);

        },
        (errorResponse: HttpErrorResponse) => {
          this.profileImage = null;
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      ))

  }

  public onUpdateCurrentUser(user: User): void {

    this.refreshing = true;
    this.currentUsername = this.authenticationService.getUserFromLocalCache().username;
    const formData = this.userService.createUserFormData(this.currentUsername, user, this.profileImage);

    this.subscriptions.push(
      this.userService.updateUser(formData).subscribe(
        (response: User) => {
          this.authenticationService.addUserToLocalCache(user);
          this.getUsers(false);
          this.fileName = null;
          this.profileImage = null;
          this.sendNotification(NotificationType.SUCCESS, `User ${response.firstName} was updated successfuly.`);
          this.refreshing = false;

        },
        (errorResponse: HttpErrorResponse) => {
          this.profileImage = null;
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.refreshing = false;

        }
      ))

  }

  public updateProfileImage(): void {
    this.clickButton('profile-image-input');
  }

  public onUpdateProfileImage(): void {
    const formData = new FormData();
    formData.append('username', this.user.username);
    formData.append('profileImage', this.profileImage);

    this.subscriptions.push(
      this.userService.updateProfileImage(formData).subscribe(
        (event: HttpEvent<any>) => {
          this.reportUploadProgress(event);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.fileStatus.status = 'done'
        }
      )
    );
  }
  private reportUploadProgress(event: HttpEvent<any>): void {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        this.fileStatus.precentage = Math.round(100 * event.loaded / event.total);
        this.fileStatus.status = 'progress';
        break;

      case HttpEventType.Response:
        if (event.status === 200) {
          console.log(event)
          this.user.profileImageUrl = `${event.body.profileImageUrl}?time=${new Date().getTime()}`;
          this.sendNotification(NotificationType.SUCCESS, `${event.body.firstName}\'s profile image updated successfully`);
          this.fileStatus.status = 'done'
          break;
        } else {
          this.sendNotification(NotificationType.ERROR, `Unable to upload image. Please try again`);
          break;
        }

      default:
        `Finish all procesess`;
    }
  }

  public onLogOut(): void {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
    this.sendNotification(NotificationType.SUCCESS, "You've been successfully logged out");
  }

  public onResetPassword(emailForm: NgForm): void {
    this.refreshing = true;
    const emailAddress = emailForm.value['reset-password-email'];
    this.subscriptions.push(
      this.userService.resetPassword(emailAddress).subscribe(
        (respons: CustomHttpResponse | HttpErrorResponse) => {
          this.sendNotification(NotificationType.SUCCESS, respons.message);
          this.refreshing = false;
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.WARNING, errorResponse.error.message);
          this.refreshing = false;
          emailForm.reset()

        },
        () => emailForm.reset()
      )
    )
  }

  public onDeleteUser(username: string): void {
    this.subscriptions.push(
      this.userService.deleteUser(username).subscribe(
        (response: CustomHttpResponse) => {
          this.sendNotification(NotificationType.SUCCESS, response.message);
          this.getUsers(false);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.profileImage = null;
        }
      ))
  }

  public onEditUser(editUserForm: NgForm): void {
    const formData = this.userService.createUserFormData(this.currentUsername, this.editUser, this.profileImage);

    this.subscriptions.push(
      this.userService.updateUser(formData).subscribe(
        (response: User) => {
          this.clickButton('edit-user-close');
          this.getUsers(false);
          this.fileName = null;
          this.profileImage = null;
          this.sendNotification(NotificationType.SUCCESS, `User ${response.firstName} was updated successfuly.`);

        },
        (errorResponse: HttpErrorResponse) => {
          this.profileImage = null;
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      ))
  }

  public onUpdateUser(): void {
    this.clickButton("edit-user-save");
  }

  public onProfileImageChange(fileName: string, file: File): void {
    this.fileName = fileName;
    this.profileImage = file;
  }


  public onEditdUser(editUser: User): void {
    this.editUser = editUser;
    this.currentUsername = editUser.username;
    this.clickButton('openUserEdit');
  }

  public searchUser(searchTearm: string): void {
    // console.log(searchTearm)
    const results: User[] = [];
    for (const user of this.userService.getUsersFromLocaleCache()) {
      if (user.firstName.toLowerCase().indexOf(searchTearm.toLowerCase()) !== -1 ||
        user.lastName.toLowerCase().indexOf(searchTearm.toLowerCase()) !== -1 ||
        user.username.toLowerCase().indexOf(searchTearm.toLowerCase()) !== -1 ||
        user.email.toLowerCase().indexOf(searchTearm.toLowerCase()) !== -1 ||
        user.userId.toLowerCase().indexOf(searchTearm.toLowerCase()) !== -1) {
        results.push(user);
      }
    }
    this.users = results;

    if (results.length === 0 && searchTearm) {
      this.sendNotification(NotificationType.ERROR, "0 user found!");
    }

    if (!searchTearm) {
      this.users = this.userService.getUsersFromLocaleCache();
    }
  }

  public get isAdmin(): boolean{
    return this.getUserRole() === Role.ADMIN || this.getUserRole() === Role.SUPER_ADMIN;
  }

  public get isManager(): boolean{
    return this.isAdmin || this.getUserRole() === Role.MANAGER;
  }

  public get isAdminOrManager(): boolean{
    return this.isAdmin || this.isManager;
  }

  private getUserRole(): string {
    return this.authenticationService.getUserFromLocalCache().role;
  }

  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notifier.notify(notificationType, message);
    } else {
      this.notifier.notify(notificationType, "An error occured. Please try again");
    }
  }

  private clickButton(buttonId: string): void {
    document.getElementById(buttonId).click();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
