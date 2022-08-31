import { Component, OnInit, ɵsetCurrentInjector } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../products/product.service';
import { UserService } from '../user/user.service';

@Component({
  selector: 'pm-shoppingcart',
  templateUrl: './shoppingcart.component.html',
  styleUrls: ['./shoppingcart.component.css']
})
export class ShoppingcartComponent implements OnInit {

  products?: any;
  orderid?: any;
  totalPrice: number = 0;
  length: number = 0;

  constructor( private productService: ProductService,
   private userService: UserService,
   private routers: Router) {  
 }


 payShoppingCart(){
  var customerName = this.userService.getUserName();
  var customerEmail = this.userService.getUserEmail();
  console.log("try");
  this.productService.getShoppingCardOrderId(customerName, customerEmail).subscribe(
    data => {
      this.orderid = data;
      this.routers.navigate(["payOrder", data, this.totalPrice]);

    },
    err => console.log(err),
    () => console.log("Product loaded")
  );

  
 }

 removeProductOrder(uuidProduct: String){
  var customerName = this.userService.getUserName();
  var customerEmail = this.userService.getUserEmail();
  console.log(uuidProduct);
  this.productService.getShoppingCardOrderId(customerName, customerEmail).subscribe(
    data => {
      this.orderid = data;
      this.productService.removeProductFromOrder(uuidProduct, this.orderid,customerName).subscribe(
        data => {
          window.location.reload();
        },
        err => console.log(err),
        () => console.log("Product loaded")
      );
    },
    err => console.log(err),
    () => console.log("Product loaded")
  );

  
 }

  ngOnInit(): void {
    var customerName = this.userService.getUserName();
    var customerEmail = this.userService.getUserEmail();

    this.productService.getProductsShoppingCart(customerName, customerEmail).subscribe(
      data => {
        this.products = data;
        console.log(this.products);
        this.length = this.products.length;
        for (var i = 0; i < this.products.length; i++) { 
          this.totalPrice += this.products[i].price;
         
         }

      },
      err => console.log(err),
      () => console.log("Product loaded")
    );
  }
  
}
