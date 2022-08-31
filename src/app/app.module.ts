import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule, HTTP_INTERCEPTORS} from'@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationService } from './service/authentication.service';
import { UserService } from './service/user.service';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { AuthenticationGuard } from './guard/authentication.guard';
import { NotificationModule } from './notification.module';
import { NotificationService } from './service/notification.service';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './navbar/navbar.component';

import { OrderService } from './service/order.service';
import { ProductService } from './service/product.service';
import { ProductComponent } from './products/products.component';
import { ProductDetailsComponent } from './products/product-details/product-details.component';
import { SharedModule } from './shared/shared-module.model';
import { OrdersComponent } from './order/orders/orders.component';
import { CheckoutComponent } from './checkout/checkout/checkout.component';
import { ShoppingCartService } from './service/shopping-cart-service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UserComponent,
    NavbarComponent,
    ProductComponent,
    ProductDetailsComponent,
    OrdersComponent,
    CheckoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NotificationModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [NotificationService, AuthenticationGuard ,AuthenticationService, UserService, OrderService,
    ProductService,ShoppingCartService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
