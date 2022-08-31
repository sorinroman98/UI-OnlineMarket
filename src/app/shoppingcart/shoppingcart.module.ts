import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShoppingcartComponent } from './shoppingcart.component';
import { BrowserModule } from '@angular/platform-browser';
import { LoggedInGuardGuard } from '../user/logged-in-guard.guard';


@NgModule({
  declarations: [ShoppingcartComponent],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule.forChild([
      {path: 'shoppingCart', component: ShoppingcartComponent, canActivate: [LoggedInGuardGuard] },
    ])
  ]
})
export class ShoppingcartModule {

}
