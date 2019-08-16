import { Component, OnInit, LOCALE_ID, ViewChild, AfterViewInit } from '@angular/core';
import { OvertimeService } from '../shared/overtime.service';
import { Overtime } from '../models/overtime.model';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AgGridNg2 } from 'ag-grid-angular';
import { OvertimeCellCustomComponent } from './overtime-cell-custom/overtime-cell-custom.component';
import { EmployeeService } from '../shared/employee.service';
import { Employee } from '../models/employee.model';
import { CompleterService } from 'ng2-completer';
import { slider } from '../route-animations';

@Component({
  selector: 'app-overtime',
  templateUrl: './overtime.component.html',
  styleUrls: ['./overtime.component.css'],
  animations: [
    slider
  ],
})
export class OvertimeComponent implements OnInit, AfterViewInit {
  
  @ViewChild('agGrid') agGrid: AgGridNg2;
  gridOptions: any;
  gridApi: any;
  gridColumnApi: any;
  overtimes: Overtime[];
  employees: any[];
  selectedDatas: any[];
  formModel: FormGroup;
  workStartDate: Date;
  getSelectedRow: any;
  dataService: any;
  firstWarning = true;
  selectedEmp: number;
  isOpen = false;
  columnDefs = [

    {
      headerName: '', checkboxSelection: true, width: 50, headerCheckboxSelection: true
    },
    {
      headerName: 'View - Edit - Delete', field: 'overtimeId',
      cellRendererFramework: OvertimeCellCustomComponent
    },
    {
      headerName: 'Employee', field: 'employeeId',
      cellRendererFramework: OvertimeCellCustomComponent
      // cellRenderer: "agGroupCellRenderer",
      // cellRendererParams: {
      //   innerRenderer: function(params) {
      //     return `<span>${params.value}</span>`
      //   }
      // }
    },
    { headerName: 'Date', field: 'overtimeDay', sortable: true, valueFormatter: this.dateFormatter },
    { headerName: 'Hour', field: 'hour', sortable: true }
  ];

  constructor(
    private overtimeService: OvertimeService,
    private employeeService: EmployeeService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private completerService: CompleterService,
    private router: Router,
    public ngxSmartModalService: NgxSmartModalService,
  ) {
    this.gridOptions = {
      context: {
        componentParent: this
      }
    }
  }


  ngOnInit() {
    this.refreshList();
    this.formModel = this.fb.group({
      overtimeId: new FormControl(),
      employeeId: new FormControl(),
      hour: new FormControl(),
      overtimeDay: new FormControl(),
    });
    this.employeeService.getAllEmployee().snapshotChanges()
      .subscribe(
        item => {
          this.employees = [];
          item.forEach(el => {
            var p = el.payload.toJSON();
            p['employeeId'] = el.key;
            this.employees.push(p as Employee);
          });
          this.dataService = this.completerService.local(this.employees, 'fullName', 'fullName');
        }
      );
      this.isOpen = true;
  }

  ngAfterViewInit(): void {
    this.isOpen = false;
  }

  onAutoCompleteSelect(data) {
    this.selectedEmp = data.originalObject.employeeId;
  }

  getEmployeeName(id): string {
    var emp = this.employees.filter(x => x.employeeId == id);
    if (emp.length <= 0) { return 'Deleted User' }
    return emp[0].fullName
  }


  dateFormatter(params) {
    const date = new DatePipe('en-US');
    return date.transform(params.value);
  }

  nameFormatter(params) {
    var emp = this.employees.filter(x => x.employeeId == params.value);
    console.log(emp);

    return emp[0].fullName
  }

  currencyFormatter(params) {
    return '$' + params.value;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  getSelectedRows() {
    const selectedNodes = this.agGrid.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    this.selectedDatas = selectedData;
    // const selectedDataStringPresentation = selectedData.map(node => node.fullName + ' ' + node.salary).join(', ');
    // alert(`Selected nodes: ${selectedDataStringPresentation}`);
  }

  onRowSelected(data) {
    this.getSelectedRows();
  }

  refreshList() {
    this.overtimeService.getAllOvertime().snapshotChanges()
      .subscribe(
        item => {
          this.overtimes = [];
          item.forEach(el => {
            var p = el.payload.toJSON();
            p['overtimeId'] = el.key;
            this.overtimes.push(p as Overtime);
          });
        }
      );
  }

  addOvertime() {
    this.formModel.patchValue({
      employeeId: this.selectedEmp
    })
    this.overtimeService.addOvertime(this.formModel.value).then(te => {
      this.toastr.success('New Overtime Added!', 'Success.');
    }).catch(error => {
      this.toastr.error('Cannot Add!', 'Error.');
    }).finally(() => {
      this.ngxSmartModalService.close('addOvertimeModal');
    });
  }

  deleteOvertime(id) {
    this.overtimeService.deleteOvertime(id).then(te => {
      this.toastr.success('Selected Overtime Deleted!', 'Success.');
    }).catch(error => {
      this.toastr.error('Cannot Delete!', 'Error.');
    }).finally(() => {
      this.ngxSmartModalService.close('deleteOvertimeModal');
    });
  }

  deleteBulkOvertime(data) {
    this.overtimeService.deleteBulkOvertime(data).then(te => {
      this.toastr.success('Selected Overtimes Deleted!', 'Success.');
    }).catch(error => {
      this.toastr.error('Cannot Delete!', 'Error.');
    }).finally(() => {
      this.ngxSmartModalService.close('deleteBulkModal');
    });
  }

  editOvertime() {
    this.overtimeService.editOvertime(this.formModel.value).then(te => {
      this.toastr.success('Overtime Has Edited!', 'Success.');
    }).catch(error => {
      this.toastr.error('Cannot Edit!', 'Error.');
    }).finally(() => {
      this.ngxSmartModalService.close('editEmployeeModal');
    });
  }

  // Open Modals
  openAddModal() {
    this.formModel.reset();
    this.ngxSmartModalService.open('addOvertimeModal');
  }

  public openDeleteBulkModal() {
    this.getSelectedRows();
    if (this.selectedDatas.length == this.overtimes.length) {
      if (confirm('You are not deleting only shown items but all items. Are you sure ?')) {
        this.ngxSmartModalService.resetModalData('deleteBulkModal');
        this.ngxSmartModalService.setModalData(this.selectedDatas, 'deleteBulkModal');
        this.ngxSmartModalService.open('deleteBulkModal');
      } else {
        this.gridOptions.api.deselectAll();
        return;
      }

    }
    this.ngxSmartModalService.resetModalData('deleteBulkModal');
    this.ngxSmartModalService.setModalData(this.selectedDatas, 'deleteBulkModal');
    this.ngxSmartModalService.open('deleteBulkModal');
  }

  closeBulkModal() {
    this.gridOptions.api.deselectAll();
    this.ngxSmartModalService.close('deleteBulkModal');
  }

  public openDeleteModal(overtimeItem) {
    this.ngxSmartModalService.resetModalData('deleteOvertimeModal');
    var obj = overtimeItem;
    this.ngxSmartModalService.setModalData(obj, 'deleteOvertimeModal');
    this.ngxSmartModalService.open('deleteOvertimeModal');
  }

  public openEditModal(overtimeItem) {
    let datePipe = new DatePipe('en-US');
    this.selectedEmp = overtimeItem.employeeId;
    this.formModel.patchValue(
      {
        overtimeId: overtimeItem.overtimeId,
        employeeId: this.getEmployeeName(overtimeItem.employeeId),
        hour: overtimeItem.hour,
        overtimeDay: datePipe.transform(overtimeItem.overtimeDay, 'yyyy-MM-dd')
      }
    );

    this.ngxSmartModalService.open('editOvertimeModal');
  }

  // overtimeDetail(emp: Overtime) {
  //   this.router.navigate('')
  // }

}
