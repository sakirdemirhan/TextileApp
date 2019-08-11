import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ItemService } from './item.service';
import { Item } from '../models/item.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  items: Item[];
  numbers: any[];
  constructor(
    private http: HttpClient,
    private itemService: ItemService,

    ) { }

  // GetIncomesByMonths(): Observable<any[]>{
  //   this.itemService.getAllItem().snapshotChanges()
  //     .subscribe(
  //       item => {
  //         this.items = [];
  //         item.forEach(el => {
  //           var p = el.payload.toJSON();
  //           p['itemId'] = el.key;
  //           this.items.push(p as Item);
  //         });
  //         let totalPrc = 0;
  //         for (let index = 1; index < 13; index++) {
  //           this.items.forEach(element => {
  //             if (new Date(element.comingDate).getFullYear() == new Date().getFullYear() 
  //             &&  new Date(element.comingDate).getMonth() == index) {
  //               totalPrc += element.count * element.price;
  //             }
  //           }); 
  //           this.numbers.push(totalPrc);
  //           totalPrc = 0;
  //         }
  //       }
  //     );
  //   return this.numbers;
  // }

  // GetCompletedItemsByMonths(){
  //   return this.http.get<number[]>(this.BaseURI + 'GetCompletedItemsByMonths');
  // }

  // GetAllCompletedItems(){
  //   return this.http.get<number>(this.BaseURI + 'GetAllCompletedItems');
  // }

  // GetAllEmployees(){
  //   return this.http.get<number>(this.BaseURI + 'GetAllEmployees');
  // }

  // GetAllIncomes(){
  //   return this.http.get<number>(this.BaseURI + 'GetAllIncomes');
  // }

  // GetIncomeAndExpenseOfThisMonth(){
  //   return this.http.get<number[]>(this.BaseURI + 'GetIncomeAndExpenseOfThisMonth');
  // }

  // GetItemsOfThisMonth(){
  //   return this.http.get<number[]>(this.BaseURI + 'GetItemsOfThisMonth');
  // }

}
