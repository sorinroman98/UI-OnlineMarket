import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TokenService } from './token.service';

export enum TokenStatus {
  VALID,
  INVALID,
  EXPIRED,
  SENDING,
  SENT
}

@Component({
  selector: 'pm-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.css']
})
export class TokenComponent implements OnInit {
  token:any = '';
  tokenStatus = TokenStatus;
  status? : TokenStatus;
  errorMessage = '';

  constructor(private authService: TokenService, private route: ActivatedRoute) {

  }

  ngOnInit(): void {

      this.status = TokenStatus.SENDING;

      this.token = this.route.snapshot.queryParamMap.get('token');
      if(this.token){
        this.status = TokenStatus.SENT;
          this.authService.verifyToken(this.token).subscribe(
          data => {
              this.status = TokenStatus[data.message as keyof typeof TokenStatus];
          }
          ,
          err => {
              this.errorMessage = err.error.message;
          }
          );
      }   
  }

  resendToken(): void {
      this.status = TokenStatus.SENDING;
      this.authService.resendToken(this.token).subscribe(
      data => {
          this.status = TokenStatus.SENT;
      }
      ,
      err => {
          this.errorMessage = err.error.message;
      }
      );
  }

}
