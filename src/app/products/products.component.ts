import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs/internal/Subscription";
import { NotificationType } from "../enum/notification-type.enum";
import { Product } from "../model/product";
import { AuthenticationService } from "../service/authentication.service";
import { NotificationService } from "../service/notification.service";
import { ProductService } from "../service/product.service";
import { UserService } from "../service/user.service";

@Component({
  selector: 'pm-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductComponent implements OnInit,OnDestroy {
  public products: any;
  public editProduct = new Product();
  public newProduct = new Product();
  public infoProduct = new Product();
  private _listFilter: string = '';
  pageTitle: string;
  filteredProducts: any = [];
  isAdmin!: boolean;
  private subscriptions: Subscription[] = [];

  constructor(private productService: ProductService, private userService: UserService,
    private authenticationService: AuthenticationService, private notifier: NotificationService) {
    this.pageTitle = "Product List";
   
   }

   ngOnInit(): void {
    this.isAdmin=this.userService.isAdmin;
    this.getAllProducts();
  }
  
  get listFilter(): string {
    return this._listFilter;
  }

  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredProducts = this.performFilter(value);
  }

  performFilter(filterBy: string): any[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.products.filter((product: any) =>
      product.productName.toLocaleLowerCase().includes(filterBy));
  }

 
  getAllProducts(){
    this.subscriptions.push( this.productService.getAllProducts().subscribe(
      data => {
        this.products = data;
        this.filteredProducts = data;
        this.sendNotification( NotificationType.INFO,"Number of products loaded " +this.products.length );

      },
      err => console.log(err),
      () => console.log("Product not loaded")
    ));
  }

  onAddNewProduct(): void {
    this.clickButton("add-new-product");
  }

  onUpdateProduct() {
      this.clickButton("edit-existing-product");
  }

  onEditProduct(product: Product) {
    this.editProduct = product;
    this.clickButton("editPorduct");
  }

  onInfoClick(product: Product){
    this.infoProduct = product;
    this.clickButton("infoProduct");
  }
  
  onSaveProduct() {
    this.clickButton("add-new-product");
  }
  
  addNewProduct(addNewProductForm: NgForm){
    if(addNewProductForm.valid){
      this.productService.addNewProduct(this.newProduct).subscribe(
        data => {
          this.sendNotification(NotificationType.SUCCESS, `Product was updated successfuly.`);
          this.clickButton("add-new-product-close");
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    } else {
      this.sendNotification(NotificationType.ERROR, "Error");
    }
  }

  editExistingProduct(editProductForm: NgForm) {
    this.subscriptions.push(
      this.productService.updateProduct(this.editProduct).subscribe(
        (response: any) => {
          this.sendNotification(NotificationType.SUCCESS, `Product was updated successfuly.`);
          this.clickButton("edit-product-close");

        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      ))
    }

  private sendNotification(notificationType: NotificationType, message: string): void {
      if (message) {
        this.notifier.notify(notificationType, message);
      } else {
        this.notifier.notify(notificationType, "An error occured. Please try again");
      }
    }

    private clickButton(buttonId: string): void {
      document.getElementById(buttonId).click();
    }

    
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
