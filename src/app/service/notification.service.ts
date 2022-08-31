import { not } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { NotFoundError } from 'rxjs';
import { NotificationType } from '../enum/notification-type.enum';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private notifier: NotifierService) {}

  public notify(type: NotificationType, message: string){
    this.notifier.notify(type,message);
  }

}
