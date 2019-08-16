import { Component, OnInit, LOCALE_ID, ViewChild, AfterViewInit } from '@angular/core';
import { EmployeeService } from '../shared/employee.service';
import { Employee } from '../models/employee.model';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { AgGridNg2 } from 'ag-grid-angular';
import { EmployeeCellCustomComponent } from './employee-cell-custom/employee-cell-custom.component';
import { slider } from '../route-animations';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  animations: [
    slider
  ]
})
export class EmployeeComponent implements OnInit, AfterViewInit {
  @ViewChild('agGrid') agGrid: AgGridNg2;
  gridOptions: any;
  gridApi: any;
  gridColumnApi: any;
  employees: Employee[];
  selectedDatas: any[];
  formModel: FormGroup;
  workStartDate: Date;
  getSelectedRow: any;
  firstWarning = true;
  isOpen = false;
  columnDefs = [

    {
      headerName: '', checkboxSelection: true, width: 50, headerCheckboxSelection: true
    },
    {
      headerName: 'View - Edit - Delete', field: 'employeeId',
      cellRendererFramework: EmployeeCellCustomComponent
    },
    { headerName: 'Full Name', width: 220, field: 'fullName', sortable: true, resizable: true, filter: true, suppressSizeToFit: true },
    { headerName: 'Salary', field: 'salary', sortable: true, filter: "agNumberColumnFilter", valueFormatter: this.currencyFormatter },
    { headerName: 'Start Date', field: 'startDate', sortable: true, valueFormatter: this.dateFormatter },
    { headerName: 'Phone', field: 'phone', sortable: true },
    { headerName: 'Description', field: 'description', resizable: true },
  ];

  constructor(
    private employeeService: EmployeeService,
    private fb: FormBuilder,
    private toastr: ToastrService,
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
      employeeId: new FormControl(),
      phone: new FormControl(),
      salary: new FormControl(),
      description: new FormControl(),
      startDate: new FormControl(),
      fullName: new FormControl()
    });
    this.isOpen = true;
  }

  ngAfterViewInit() {
    this.isOpen = false;
  }

  dateFormatter(params) {
    const date = new DatePipe('en-US');
    return date.transform(params.value);
  }

  currencyFormatter(params) {
    return params.value + ' $';
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  getSelectedRows() {
    const selectedNodes = this.agGrid.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    this.selectedDatas = selectedData;
  }

  onRowSelected(data) {
    this.getSelectedRows();
  }

  refreshList() {
    this.employeeService.getAllEmployee().snapshotChanges()
      .subscribe(
        item => {
          this.employees = [];
          item.forEach(el => {
            var p = el.payload.toJSON();
            p['employeeId'] = el.key;
            this.employees.push(p as Employee);
          });
        }
      );
  }

  addEmployee() {
    this.employeeService.addEmployee(this.formModel.value).then(te => {
      this.toastr.success('New Employee Added!', 'Success.');
    }).catch(error => {
      this.toastr.error('Cannot Add!', 'Error.');
    }).finally(() => {
      this.ngxSmartModalService.close('addEmployeeModal');
    });
  }

  deleteEmployee(id) {
    this.employeeService.deleteEmployee(id)
      .then(res => { this.toastr.success('Selected Employee Deleted!', 'Success.'); })
      .catch(err => { this.toastr.error('Cannot Delete!', 'Error.'); })
      .finally(() => { this.ngxSmartModalService.close('deleteEmployeeModal'); });
  }

  deleteBulkEmployee(data) {
    this.employeeService.deleteBulkEmployee(data)
      .then(res => { this.toastr.success('Selected Employees Deleted!', 'Success.'); })
      .catch(err => { this.toastr.error('Cannot Delete!', 'Error.'); })
      .finally(() => { this.ngxSmartModalService.close('deleteBulkModal'); });
  }

  editEmployee() {
    this.employeeService.editEmployee(this.formModel.value).then(te => {
      this.toastr.success('Employee Has Edited!', 'Success.');
    }).catch(error => {
      this.toastr.error('Cannot Edit!', 'Error.');
    }).finally(() => {
      this.ngxSmartModalService.close('editEmployeeModal');
    });
  }

  // Open Modals
  openAddModal() {
    this.formModel.reset();
    this.ngxSmartModalService.open('addEmployeeModal');
  }

  public openDeleteBulkModal() {
    this.getSelectedRows();
    if (this.selectedDatas.length == this.employees.length) {
      if (confirm('You are not deleting only shown employees but all employees. Are you sure ?')) {
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

  public openDeleteModal(employeeItem) {
    this.ngxSmartModalService.resetModalData('deleteEmployeeModal');
    var obj = employeeItem;
    this.ngxSmartModalService.setModalData(obj, 'deleteEmployeeModal');
    this.ngxSmartModalService.open('deleteEmployeeModal');
  }

  public openEditModal(employeeItem) {
    let datePipe = new DatePipe('en-US');
    this.formModel.patchValue(
      {
        employeeId: employeeItem.employeeId,
        fullName: employeeItem.fullName,
        phone: employeeItem.phone,
        salary: employeeItem.salary,
        description: employeeItem.description,
        startDate: datePipe.transform(employeeItem.startDate, 'yyyy-MM-dd')
      }
    );
    this.ngxSmartModalService.open('editEmployeeModal');
  }

}
