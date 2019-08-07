import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }
  readonly BaseURI = 'http://beta.demtas.com/api/values/';

  GetIncomesByMonths(){
    return this.http.get<number[]>(this.BaseURI + 'GetIncomesByMonths');
  }

  GetCompletedItemsByMonths(){
    return this.http.get<number[]>(this.BaseURI + 'GetCompletedItemsByMonths');
  }

  GetAllCompletedItems(){
    return this.http.get<number>(this.BaseURI + 'GetAllCompletedItems');
  }

  GetAllEmployees(){
    return this.http.get<number>(this.BaseURI + 'GetAllEmployees');
  }

  GetAllIncomes(){
    return this.http.get<number>(this.BaseURI + 'GetAllIncomes');
  }

  GetIncomeAndExpenseOfThisMonth(){
    return this.http.get<number[]>(this.BaseURI + 'GetIncomeAndExpenseOfThisMonth');
  }

  GetItemsOfThisMonth(){
    return this.http.get<number[]>(this.BaseURI + 'GetItemsOfThisMonth');
  }

}
