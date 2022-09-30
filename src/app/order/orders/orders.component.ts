import { HttpErrorResponse } from "@angular/common/http";
import { Component } from "@angular/core";
import { Subscription } from "rxjs/internal/Subscription";
import { NotificationType } from "src/app/enum/notification-type.enum";
import { CustomHttpResponse } from "src/app/model/custom-http-response";
import { Order } from "src/app/model/order";
import { Product } from "src/app/model/product";
import { NotificationService } from "src/app/service/notification.service";
import { OrderService } from "src/app/service/order.service";
import { UserService } from "src/app/service/user.service";


@Component({
  selector: 'pm-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent {

  public orders: any;
  public currentOrder = new Order();
  private _listFilter: string = '';
  public filteredOrders: any = [];
  private subscriptions: Subscription[] = [];;
  errorMessage?: string;

  constructor(private orderService: OrderService, private userService: UserService,
    private notifier: NotificationService) {
   }

   ngOnInit(): void {
    this.getOrdersList();
  }
  
  get listFilter(): string {
    return this._listFilter;
  }

  set listFilter(value: string) {
    this._listFilter = value;
    console.log('In setter:', value);
    this.filteredOrders = this.performFilter(value);
  }

  performFilter(filterBy: string): any[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.orders.filter((order: any) =>
    order.customerName.toLocaleLowerCase().includes(filterBy));
  }

  getOrdersList(){
    this.subscriptions.push(
      this.orderService.getAllOrders().subscribe(
      data => {
        console.log(data);
        this.orders = data;
        this.filteredOrders = data;
      },
      error =>{
        console.log(error.error); 
      this.errorMessage = error.error;
      
      },
      () => console.log("Orders loaded")
    ));
  }

  onInfoClick(order: Order){
    this.currentOrder = order;
    this.clickButton("infoOrder");
  }

  private clickButton(buttonId: string): void {
    document.getElementById(buttonId).click();
  }

  onDelete(){
    this.subscriptions.push(
      this.orderService.deleteOrderByUuid(this.currentOrder.orderUuid).subscribe(
        (response: CustomHttpResponse) => {
          this.sendNotification(NotificationType.SUCCESS, response.message);
          this.clickButton("info-order-close");
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.clickButton("info-order-close");
        }
      ))

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notifier.notify(notificationType, message);
    } else {
      this.notifier.notify(notificationType, "An error occured. Please try again");
    }
  }

  
}
