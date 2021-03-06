import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from 'src/app/shared/employee.service';
import { Employee } from 'src/app/models/employee.model';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { OvertimeService } from 'src/app/shared/overtime.service';
import { Overtime } from 'src/app/models/overtime.model';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { NgxSmartModalService } from 'ngx-smart-modal';
import * as _ from "lodash";
import { slider } from 'src/app/route-animations';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css'],
  animations: [
    slider
  ]
})
export class EmployeeDetailComponent implements OnInit, AfterViewInit {

  id: any;
  employee: Employee;
  selectedMonth = 1;
  selectedYear = 2019;
  formModel: FormGroup;
  overtimeDataSum: Overtime[] = [];
  totalOvertimeHour = 0;
  overtimeData: Overtime[] = [];
  months = [
    { 'key': 1, 'value': 'January' },
    { 'key': 2, 'value': 'February' },
    { 'key': 3, 'value': 'March' },
    { 'key': 4, 'value': 'April' },
    { 'key': 5, 'value': 'May' },
    { 'key': 6, 'value': 'June' },
    { 'key': 7, 'value': 'July' },
    { 'key': 8, 'value': 'August' },
    { 'key': 9, 'value': 'September' },
    { 'key': 10, 'value': 'October' },
    { 'key': 11, 'value': 'November' },
    { 'key': 12, 'value': 'December' },
  ];
  years = [];
  today = new Date();
  isOpen = false;
  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private overtimeService: OvertimeService,
    public ngxSmartModalService: NgxSmartModalService,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.employeeService.getEmployeeById(this.id).valueChanges()
    .subscribe(
      item => {
        this.employee = item as Employee;
        this.getEmployeeOvertimeByEmployeeId();
      },
      err => {
        this.toastr.error('Error.');
      }
    );

    for (let i = -1; i < 10; i++) {
      this.years.push(this.today.getFullYear() + i);
    }

    this.selectedMonth = this.months[0].key;
    this.selectedYear = this.years[0];
    this.formModel = this.fb.group({
      overtimeId: new FormControl(),
      overtimeDay: new FormControl(),
      hour: new FormControl(),
      employeeId: new FormControl()
    });
    this.isOpen = true;
  }

  ngAfterViewInit(): void {
    this.isOpen = false;
  }

  totalWorkDays(date: Date): number {
    if (date == null) {
      return;
    }
    let datePipe = new DatePipe('en-US');
    let begin = new Date(datePipe.transform(date, 'yyyy-MM-dd'));
    let today = new Date();
    let oneDay = 24 * 60 * 60 * 1000;
    return Math.round((today.getTime() - begin.getTime()) / oneDay);
  }

  onChange(val) {
    this.getEmployeeOvertimeByEmployeeId();
    if (val > 12) {
      this.selectedYear = val;
    } else {
      this.selectedMonth = val;
    }
  }

  getEmployeeOvertimeByDate() {
    // this.overtimeService.GetOvertimeListDateBetween(this.employee.employeeId, this.selectedMonth, this.selectedYear)
    // .subscribe(
    //   res => {
    //     this.overtimeData = res;
    //   }
    // );
  }

  getEmployeeOvertimeByEmployeeId() {
    var totalHour = 0;
    this.overtimeService.getOvertimeListByEmployeeId(this.id).once('value', function(data){
      _.flatMap(data.val()).forEach(element => {
        totalHour += element.hour;
      });
    }).then(res => {
      this.totalOvertimeHour = totalHour;
    });
  }
  
  addOvertime() {
    this.formModel.patchValue({
      employeeId: this.id
    });
    this.overtimeService.addOvertime(this.formModel.value).then(te => {
      this.toastr.success('New Overtime Added!', 'Success.');
    }).catch(error => {
      this.toastr.error('Cannot Add Overtime!', 'Error.');
    }).finally(() => {
      this.ngxSmartModalService.close('addOvertimeModal');
    });
  }
}
