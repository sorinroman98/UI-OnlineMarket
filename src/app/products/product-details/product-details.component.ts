import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { UserService } from 'src/app/service/user.service';
import { ProductService } from '../../service/product.service';


@Component({
  selector: 'pm-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  pageTitle: string = 'Product Detail';
  product: any | undefined = [];
  productDisplay: any;
  onStock?: boolean;
  isAdmin?: boolean;
  user: User;

  constructor(private route: ActivatedRoute,
              private router: Router, private productService: ProductService,
             private userService: UserService,
             private autenticationService: AuthenticationService) {  
              }

              
  ngOnInit(): void {
    this.isAdmin = this.userService.isAdmin;
    this.user = this.autenticationService.getUserFromLocalCache();

    const id = String(this.route.snapshot.paramMap.get('id'));
    // this.productService.getProductByIdSpring(id).subscribe(
    //   data => {
    //     this.product = data;
    //     if(this.product.quantity > 0)
    //     this.onStock = true;
    //     else
    //     this.onStock = false;
    //   },
    //   err => console.log(err),
    //   () => console.log("Product loaded")
    // );                                                                                
   
    this.pageTitle += `: ${id}`;

  }


  addToTheCart() {
  
    var order = {
        "uuidProduct":this.route.snapshot.paramMap.get('id'),
        "email": this.user.email,
        "name" : this.user.username
    }
      
    // this.productService.addProductToShoppingCart(order).toPromise()
    // .then(
    //   res => { 
    //     this.router.navigate(['/productsSpring']);
    //   },
    //   msg => { 
    //     console.log(msg);
    //   }
    // );
  }


  onBack(): void {
    this.router.navigate(['/productsSpring']);
  }

}
