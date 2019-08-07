import { Component, OnInit } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { DatePipe } from '@angular/common';
import { DashboardService } from '../shared/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  months = ['Ocak', 'Şubat', 'Mart', 'Nisan',
    'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  datePipe = new DatePipe('tr-TR');
  today = new Date();
  strMonth = this.months[this.today.getMonth()] + ' ';
  strYear = this.today.getFullYear() + ' ';
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

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.dashboardService.GetIncomesByMonths().subscribe(
      res => {
        this.incomesByMonths = res;
        this.chartDataIncomesByMonths = [
          { data: this.incomesByMonths, label: 'Aylara Göre Toplam Gelir (' + this.strYear + ')' },
        ];
      },
      err => { }
    );

    this.dashboardService.GetCompletedItemsByMonths().subscribe(
      res => {
        this.itemsByMonths = res;
        this.chartDataItemsByMonths = [
          { data: this.itemsByMonths, label: 'Aylara Göre Tamamlanan İş (' + this.strYear + ')' },
        ];
      },
      err => { }
    );

    this.dashboardService.GetItemsOfThisMonth().subscribe(
      res => {
        this.completedAndOnProcessItems = res;
      },
      err => { }
    );

    this.dashboardService.GetIncomeAndExpenseOfThisMonth().subscribe(
      res => {
        this.incomesAndExpenses = res;
      },
      err => { }
    );

    this.dashboardService.GetAllCompletedItems().subscribe(
      res => {
        this.totalCompletedItems = res;
      },
      err => { }
    );

    this.dashboardService.GetAllEmployees().subscribe(
      res => {
        this.totalEmployees = res;
      },
      err => { }
    );

    this.dashboardService.GetAllIncomes().subscribe(
      res => {
        this.totalIncomes = res;
      },
      err => { }
    );

    this.show = true;

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

  public pieChartLabels: Label[] = [this.strMonth + 'Ayı Geliri ', this.strMonth + 'Ayı Gideri'];
  //public pieChartData: number[] = this.incomesAndExpenses;
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartColors = [
    {
      backgroundColor: ['rgba(28, 217, 168 ,0.6)', 'rgba(240, 87, 124, 0.6)'],
    },
  ];

  // Pie2
  public pieChartOptions2: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    }
  };

  public pieChartLabels2: Label[] = [this.strMonth + 'Ayı Tamamlanan İş', this.strMonth + 'Ayı Devam Eden İş'];
  //public pieChartData2: number[] = this.completedAndOnProcessItems;
  public pieChartType2: ChartType = 'pie';
  public pieChartLegend2 = true;
  public pieChartColors2 = [
    {
      backgroundColor: ['rgba(28, 217, 168 ,0.6)', 'rgba(240, 87, 124, 0.6)'],
    },
  ];

}
