import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { CustomHttpResponse } from '../model/custom-http-response';
import { Order } from '../model/order';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type' : 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllOrders(): Observable<Order[]>{

    return this.http.get<Order[]>(`${this.host}/api/order/getAll`);
  }

  getOrderById(uuid: String){

    return this.http.get('server/api/order/getById?uuid='+uuid);
  }

  deleteOrderByUuid(uuid: String): Observable<CustomHttpResponse>{

    return this.http.delete<CustomHttpResponse>(`${this.host}/api/order/deleteById?uuid=`+uuid);
  }
}
