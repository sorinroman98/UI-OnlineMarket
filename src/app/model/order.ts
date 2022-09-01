import { Product } from "./product";

export class Order{
    id: Int16Array;
    orderUuid: String;
    userName: String;
    userEmail: String;
    localDateTime: any;
    totalAmount: number;
    payed: boolean;
    products: Product[]
}