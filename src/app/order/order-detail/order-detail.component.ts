import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/model/product';
import { ProductService } from 'src/app/service/product.service';
import { UserService } from 'src/app/service/user.service';
import { OrderService } from '../../service/order.service';

@Component({
  selector: 'pm-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {

 
  pageTitle: string = 'Product Detail';
  order: any | undefined = [];
  productDisplay: any;
  onStock?: boolean;
  isAdmin?: boolean;
  orderPayed?: String;
  products?: Product[];

  constructor(private route: ActivatedRoute,
              private router: Router, private orderService: OrderService,
              private userService: UserService) {  
              }

  ngOnInit(): void {
    this.isAdmin = this.userService.isAdmin;
    const id = String(this.route.snapshot.paramMap.get('id'));
    this.orderService.getOrderById(id).subscribe(
      data => {
      
        this.order = data;
        this.products = this.order['productDtoList'];
        console.log(this.order['orderId']);
       
      },
      err => console.log(err),
      () => console.log("Product loaded")
    );                                                                                
   
    this.pageTitle += `: ${id}`;

  }

  onBack(): void {
    this.router.navigate(['/productsSpring']);
  }

  onDelete(): void{
    const uuid = String (this.route.snapshot.paramMap.get('id'));
   this.orderService.deleteOrderByUuid(uuid).subscribe(
    data => {
    
      this.router.navigate(['/productsSpring']);

     
    },
    err => console.log(err)
    );
  }

}

