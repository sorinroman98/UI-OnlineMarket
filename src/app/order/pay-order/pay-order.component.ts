import { Component, OnInit } from "@angular/core";
import { fakeAsync } from "@angular/core/testing";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { User } from "src/app/model/user";
import { AuthenticationService } from "src/app/service/authentication.service";
import { ProductService } from "src/app/service/product.service";
import { UserService } from "src/app/service/user.service";
import { OrderService } from "../../service/order.service";


@Component({
  selector: 'pm-pay-order',
  templateUrl: './pay-order.component.html',
  styleUrls: ['./pay-order.component.css']
})
export class PayOrderComponent implements OnInit {
  user: User;
  creditCardForm!: FormGroup;
  price: any;
  uuid?: string;
  username?: String;
  email?: any;
  name?: any;
  card_num?: any;
  exp?: any;
  cvv?: any;
  orderId?: any;
  errorMessage?: String;
  succefulyPaid?:any = false;


  constructor(private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private userService: UserService,
    private orderService: OrderService,
    private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.uuid = String(this.route.snapshot.paramMap.get('id'));
    this.user = this.authenticationService.getUserFromLocalCache();
    this.price = Number(this.route.snapshot.paramMap.get('price'));
    console.log(this.price);
    this.creditCardForm = new FormGroup({
      name: new FormControl('', Validators.required),
      card_num: new FormControl('', Validators.required),
      exp: new FormControl('', Validators.required),
      cvv: new FormControl('', Validators.required)
    });

  }

  submitCreditCard() {

    this.username = this.user.username;
    this.email = this.user.email;
    this.name = this.creditCardForm.get('name')?.value;
    this.card_num = this.creditCardForm.get('card_num')?.value;
    this.exp = this.creditCardForm.get('exp')?.value;
    this.cvv = this.creditCardForm.get('cvv')?.value;


    if (this.creditCardForm.valid) {
      this.creditCardForm.reset();
     
        this.orderId = String(this.route.snapshot.paramMap.get('id'));
        console.log(this.orderId);
        var processOrder = {
          "creditCard": {
            "creditCardNumber": this.card_num,
            "cardHolderName": this.name,
            "expiryDate": this.exp,
            "civ": this.cvv
          },
          "idOrder": String(this.orderId)
        }
        var jsonProcessOrder = JSON.stringify(processOrder);

        this.productService.payOrderSpring(jsonProcessOrder).subscribe(
          data => {
            console.log("Succefuly payed!");
            this.succefulyPaid = true;
          //  this.router.navigate(['/productsSpring'])
            return true;
          },
          error => {
            this.errorMessage = error.error;
            console.log(this.orderId['orderId'])
            return console.error();
          }
        )
        return true;
      

    }else{
      this.errorMessage = "Some fields are empty!";
      return false;
    }
    
  }
}
