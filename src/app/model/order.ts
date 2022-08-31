import { IProduct } from "./product";

export interface IOrder{
    id: Int16Array;
    orderId: String;
    customerName: String;
    localDateTime: any;
    totalAmount: number;
    products: IProduct[]
}