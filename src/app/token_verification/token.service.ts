import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private http: HttpClient) { }

  verifyToken(token: any): Observable<any> {
    return this.http.post('/server/api/token/verify', token, {
          headers: new HttpHeaders({ 'Content-Type': 'text/plain' })
    });
  }
   
  resendToken(token: any): Observable<any> {
    return this.http.post('/server/api/token/resend', token, {
          headers: new HttpHeaders({ 'Content-Type': 'text/plain' })
    });
  }
}
