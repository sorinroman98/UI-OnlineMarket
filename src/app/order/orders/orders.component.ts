import { Component } from "@angular/core";
import { Subscription } from "rxjs/internal/Subscription";
import { OrderService } from "src/app/service/order.service";
import { UserService } from "src/app/service/user.service";


@Component({
  selector: 'pm-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent {

  public orders: any;
  private _listFilter: string = '';
  public filteredOrders: any = [];
  private subscriptions: Subscription[] = [];;
  errorMessage?: string;

  constructor(private orderService: OrderService, private userService: UserService) {
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
    this.subscriptions.push(this.orderService.getAllOrders().subscribe(
      data => {
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

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  

  
}
