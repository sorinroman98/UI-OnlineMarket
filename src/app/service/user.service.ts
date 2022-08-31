import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { CustomHttpResponse } from '../model/custom-http-response';
import { Role } from '../enum/role.enum';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }

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
  

  public getUsers(): Observable<User[]>{
      return this.http.get<User[]> (`${this.host}/user/list`);
  }

  public addUser(formData: FormData): Observable<User>{ // not working, need to modify the backend
    return this.http.post<User> (`${this.host}/user/add`, formData);
  }

  public updateUser(formData: FormData): Observable<User>{ // not working, need to modify the backend
    return this.http.post<User> (`${this.host}/user/update`, formData);
  }

  public resetPassword(email: string): Observable<CustomHttpResponse>{ 
    return this.http.get<CustomHttpResponse > (`${this.host}/user/resetpassword/${email}`);
  }
  
  public updateProfileImage(formData: FormData): Observable<HttpEvent<User>>{ 
    return this.http.post<User> (`${this.host}/user/updateProfileImage`, formData, 
    {reportProgress: true,
    observe: 'events'
    });
  }

  public deleteUser(username: string): Observable<CustomHttpResponse>{ 
    return this.http.delete<CustomHttpResponse> (`${this.host}/user/delete/${username}`);
  }

  public addUsersToLocaleCache(users: User[]): void{ 
    localStorage.setItem('users', JSON.stringify(users))
  }

  public getUsersFromLocaleCache(): User[] | null{ 
    if (localStorage.getItem('users') != null){
      return JSON.parse(localStorage.getItem('users')) ;
    }
      return null;
  }

  public createUserFormData(loggedInUsername: string, user: User, profileImage: File): FormData{
      const formData = new FormData();
      formData.append('currentUsername', loggedInUsername);
      formData.append('firstName', user.firstName);
      formData.append('lastName', user.lastName);
      formData.append('username', user.username);
      formData.append('email', user.email);
      formData.append('role', user.role);
      formData.append('profileImage', profileImage);
      formData.append('isActive', JSON.stringify(user.active));
      formData.append('isNonLocked', JSON.stringify(user.notLocked));

      return formData;

  } 
}
