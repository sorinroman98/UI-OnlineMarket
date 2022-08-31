import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { CustomHttpResponse } from "../model/custom-http-response";
import { Product } from "../model/product";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type' : 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productUrl = 'api/products/products.json';
  private host = environment.apiUrl;
 

  constructor(private http: HttpClient) { }

  public getAllProducts(): Observable<Product[]>{
    return this.http.get<Product[]> (`${this.host}/api/product/getAll`);
}

public addNewProduct(product: Product): Observable<any>{

 return this.http.post<CustomHttpResponse> (`${this.host}/api/product/add`,product);
}

public updateProduct(product: Product): Observable<CustomHttpResponse>{
   return this.http.post<CustomHttpResponse> (`${this.host}/api/product/update`,product);
 }


}
