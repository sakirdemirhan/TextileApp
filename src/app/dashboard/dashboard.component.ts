import { Component, OnInit } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { DatePipe } from '@angular/common';
import { DashboardService } from '../shared/dashboard.service';
import { Item } from '../models/item.model';
import { ItemService } from '../shared/item.service';
import { ExpenseService } from '../shared/expense.service';
import { Expense } from '../models/expense.model';
import { EmployeeService } from '../shared/employee.service';
import { Employee } from '../models/employee.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  months = ['January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  datePipe = new DatePipe('en-US');
  today = new Date();
  strMonth = this.months[this.today.getMonth()];
  strYear = this.today.getFullYear();
  incomesByMonths = [];
  itemsByMonths = [];
  incomesAndExpenses = [];
  completedAndOnProcessItems = [];
  totalEmployees = 0;
  totalIncomes = 0;
  totalCompletedItems = 0;
  show = false;
  chartDataIncomesByMonths = [{ data: [], label: '' }];
  chartDataItemsByMonths = [{ data: [], label: '' }];
  /////////////////
  items: Item[];
  expenses: Expense[];
  employees: Employee[];
  numbers: any[];
  constructor(
    private itemService: ItemService,
    private expenseService: ExpenseService,
    private employeeService: EmployeeService
  ) { }

  ngOnInit() {
    // this.dashboardService.GetIncomesByMonths().subscribe(
    //   res => {
    //     this.incomesByMonths = res;
    //     this.chartDataIncomesByMonths = [
    //       { data: this.incomesByMonths, label: 'Total Incomes by Month (' + this.strYear + ')' },
    //     ];
    //   },
    //   err => { }
    // );
    this.getIncomesByMonth();

    // this.dashboardService.GetCompletedItemsByMonths().subscribe(
    //   res => {
    //     this.itemsByMonths = res;
    //     this.chartDataItemsByMonths = [
    //       { data: this.itemsByMonths, label: 'Total Completed Items by Month (' + this.strYear + ')' },
    //     ];
    //   },
    //   err => { }
    // );

    this.getCompletedItemsByMonth();

    // this.dashboardService.GetItemsOfThisMonth().subscribe(
    //   res => {
    //     this.completedAndOnProcessItems = res;
    //   },
    //   err => { }
    // );

    this.getItemsOfThisMonth();

    // this.dashboardService.GetIncomeAndExpenseOfThisMonth().subscribe(
    //   res => {
    //     this.incomesAndExpenses = res;
    //   },
    //   err => { }
    // );

    this.getIncomesAndExpenseOfThisMonth();

    // this.dashboardService.GetAllCompletedItems().subscribe(
    //   res => {
    //     this.totalCompletedItems = res;
    //   },
    //   err => { }
    // );

    this.getAllCompetedItems();

    // this.dashboardService.GetAllEmployees().subscribe(
    //   res => {
    //     this.totalEmployees = res;
    //   },
    //   err => { }
    // );

    this.getAllEmployees();

    // this.dashboardService.GetAllIncomes().subscribe(
    //   res => {
    //     this.totalIncomes = res;
    //   },
    //   err => { }
    // );

    this.getAllIncomes();

    this.show = true;

  }



  getIncomesByMonth() {
    this.itemService.getAllItem().snapshotChanges()
      .subscribe(
        item => {
          this.items = [];
          item.forEach(el => {
            var p = el.payload.toJSON();
            p['itemId'] = el.key;
            this.items.push(p as Item);
          });
          let total = 0;
          let numbers = [];
          for (let index = 0; index < 12; index++) {
            this.items.forEach(element => {
              if (element.isCompleted == true
                && new Date(element.comingDate).getFullYear() == new Date().getFullYear()
                && new Date(element.comingDate).getMonth() == index) {
                total += element.count * element.price;
              }
            });
            numbers.push(total);
            total = 0;
          }

          this.incomesByMonths = numbers;
          this.chartDataIncomesByMonths = [
            { data: this.incomesByMonths, label: 'Total Incomes by Month (' + this.strYear + ')' },
          ];

        }
      );
  }

  getCompletedItemsByMonth() {
    this.itemService.getAllItem().snapshotChanges()
      .subscribe(
        item => {
          this.items = [];
          item.forEach(el => {
            var p = el.payload.toJSON();
            p['itemId'] = el.key;
            this.items.push(p as Item);
          });
          let totalItems = 0;
          let numbers = [];
          for (let index = 0; index < 12; index++) {
            this.items.forEach(element => {
              if (element.isCompleted == true
                && new Date(element.comingDate).getFullYear() == new Date().getFullYear()
                && new Date(element.comingDate).getMonth() == index) {
                totalItems += element.count;
              }
            });
            numbers.push(totalItems);
            totalItems = 0;
          }

          this.itemsByMonths = numbers;
          this.chartDataItemsByMonths = [
            { data: this.itemsByMonths, label: 'Total Completed Items by Month (' + this.strYear + ')' },
          ];

        }
      );
  }


  getItemsOfThisMonth() {
    this.itemService.getAllItem().snapshotChanges()
      .subscribe(
        item => {
          this.items = [];
          item.forEach(el => {
            var p = el.payload.toJSON();
            p['itemId'] = el.key;
            this.items.push(p as Item);
          });
          let total = 0;
          let numbers = [];
          this.items.forEach(element => {
            if (element.isCompleted == true
              && new Date(element.comingDate).getFullYear() == new Date().getFullYear()
              && new Date(element.comingDate).getMonth() == new Date().getMonth()) {
              total += element.count;
            }
          });
          numbers.push(total);
          total = 0;
          this.items.forEach(element => {
            if (element.isCompleted == false
              && new Date(element.comingDate).getFullYear() == new Date().getFullYear()
              && new Date(element.comingDate).getMonth() == new Date().getMonth()) {
              total += element.count;
            }
          });
          numbers.push(total);
          this.completedAndOnProcessItems = numbers;
        });
  }

  getIncomesAndExpenseOfThisMonth() {
    let numbers = [];
    let total = 0;

    this.expenseService.getAllExpense().snapshotChanges()
      .subscribe(
        expense => {
          this.expenses = [];
          expense.forEach(el => {
            var p = el.payload.toJSON();
            p['expenseId'] = el.key;
            this.expenses.push(p as Expense);
          });

          this.expenses.forEach(element => {
            if (new Date(element.expenseDate).getFullYear() == new Date().getFullYear()
              && new Date(element.expenseDate).getMonth() == new Date().getMonth()) {
              total += element.amount
            }
          });
          numbers.push(total);
          total = 0;
          this.itemService.getAllItem().snapshotChanges()
            .subscribe(
              item => {
                this.items = [];
                item.forEach(el => {
                  var p = el.payload.toJSON();
                  p['itemId'] = el.key;
                  this.items.push(p as Item);
                });

                this.items.forEach(element => {
                  if (element.isCompleted == true
                    && new Date(element.comingDate).getFullYear() == new Date().getFullYear()
                    && new Date(element.comingDate).getMonth() == new Date().getMonth()) {
                    total += element.count * element.price;
                  }
                });
                numbers.push(total);
              });
          this.incomesAndExpenses = numbers;
        });
  }

  getAllCompetedItems() {
    this.itemService.getAllItem().snapshotChanges()
      .subscribe(
        item => {
          this.items = [];
          item.forEach(el => {
            var p = el.payload.toJSON();
            p['itemId'] = el.key;
            this.items.push(p as Item);
          });
          let total = 0;
          this.items.forEach(element => {
            if (element.isCompleted == true) {
              total += element.count;
            }
          });
          this.totalCompletedItems = total;
        });
  }

  getAllIncomes() {
    this.itemService.getAllItem().snapshotChanges()
      .subscribe(
        item => {
          this.items = [];
          item.forEach(el => {
            var p = el.payload.toJSON();
            p['itemId'] = el.key;
            this.items.push(p as Item);
          });
          let total = 0;
          this.items.forEach(element => {
            if (element.isCompleted == true) {
              total += element.count * element.price;
            }
          });
          this.totalIncomes = total;
        });
  }

  getAllEmployees() {
    this.employeeService.getAllEmployee().snapshotChanges()
      .subscribe(
        employee => {
          this.employees = [];
          employee.forEach(el => {
            var p = el.payload.toJSON();
            p['employeeId'] = el.key;
            this.employees.push(p as Employee);
          });
          this.totalEmployees = this.employees.length;
        });
  }


  chartOptions = {
    responsive: true
  };
  chartOptions2 = {
    responsive: true
  };

  chartLabels = this.months;
  chartLabels2 = this.months;

  onChartClick(event) {
    console.log(event);
  }

  myColors = [
    {
      backgroundColor: 'rgba(239, 83, 80, .1)',
      borderColor: 'rgb(239, 83, 80)',
      pointBackgroundColor: 'rgb(103, 58, 183)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(103, 58, 183, .8)'
    }
  ];

  myColors2 = [
    {
      backgroundColor: 'rgba(38, 198, 218, .1)',
      borderColor: 'rgb(38, 198, 218)',
      pointBackgroundColor: 'rgb(103, 58, 183)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(103, 58, 183, .8)'
    }
  ];

  // Pie
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    }
  };

  public pieChartLabels: Label[] = ['Expenses in ' + this.strMonth, 'Incomes in ' + this.strMonth];
  //public pieChartData: number[] = this.incomesAndExpenses;
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartColors = [
    {
      backgroundColor: ['rgba(240, 87, 124, 0.6)', 'rgba(28, 217, 168 ,0.6)'],
    },
  ];

  // Pie2
  public pieChartOptions2: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    }
  };

  public pieChartLabels2: Label[] = ['Completed items in ' + this.strMonth, 'Items in progress in ' + this.strMonth];
  //public pieChartData2: number[] = this.completedAndOnProcessItems;
  public pieChartType2: ChartType = 'pie';
  public pieChartLegend2 = true;
  public pieChartColors2 = [
    {
      backgroundColor: ['rgba(28, 217, 168 ,0.6)', 'rgba(240, 87, 124, 0.6)'],
    },
  ];

}
