import { Component, OnInit, ViewChild } from '@angular/core';
import { ExpenseService } from '../shared/expense.service';
import { Expense } from '../models/expense.model';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { AgGridNg2 } from 'ag-grid-angular';
import { ExpenseCellCustomComponent } from './expense-cell-custom/expense-cell-custom.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridNg2;
  gridOptions: any;
  gridApi: any;
  gridColumnApi: any;
  selectedDatas: any[];
  getSelectedRow: any;
  firstWarning = true;
  expenses: Expense[];
  formModel: FormGroup;
  selectedFile: File = null;
  public loading = false;
  columnDefs = [

    {
      headerName: '', checkboxSelection: true, width: 50, headerCheckboxSelection: true
    },
    {
      headerName: 'View - Edit - Delete', field: 'expenseId',
      cellRendererFramework: ExpenseCellCustomComponent
    },
    { headerName: 'Amount',width: 150, field: 'amount', sortable: true, valueFormatter: this.currencyFormatter },
    { headerName: 'Date', field: 'expenseDate', sortable: true, valueFormatter: this.dateFormatter },
    { headerName: 'Description', field: 'description', sortable: true },
  ];

  constructor(
    private expenseService: ExpenseService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    public ngxSmartModalService: NgxSmartModalService,
    public imgMaxService: Ng2ImgMaxService,
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
      expenseId: new FormControl(),
      description: new FormControl(),
      amount: new FormControl(),
      expenseDate: new FormControl(),
    });
  }

  refreshList() {
    this.expenseService.getAllExpense().snapshotChanges()
    .subscribe(
      item => {
        this.expenses = [];
        item.forEach(el => {
          var p = el.payload.toJSON();
          p['expenseId'] = el.key;
          this.expenses.push(p as Expense);
        });
      }
    );
  }

  dateFormatter(params) {
    const date = new DatePipe('tr-TR');
    return date.transform(params.value);
  }

  currencyFormatter(params) {
    var total = params.data.price * params.data.count;
    return `${params.value} ₺`;
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

  addExpense() {
    this.expenseService.addExpense(this.formModel.value).then(te => {
      this.toastr.success('New Expense Added!', 'Success.');
    }).catch(error => {
      this.toastr.error('Cannot Add!', 'Error.');
    }).finally(() => {
      this.ngxSmartModalService.close('addExpenseModal');
    });
  }

  deleteExpense(id) {
    this.expenseService.deleteExpense(id).then(te => {
      this.toastr.success('Selected Expense Deleted!', 'Success.');
    }).catch(error => {
      this.toastr.error('Cannot Delete!', 'Error.');
    }).finally(() => {
      this.ngxSmartModalService.close('deleteExpenseModal');
    });
  }

  deleteBulkExpense(data) {
    this.expenseService.deleteBulkExpense(data).then(te => {
      this.toastr.success('Selected Expenses Deleted!', 'Success.');
    }).catch(error => {
      this.toastr.error('Cannot Delete!', 'Error.');
    }).finally(() => {
      this.ngxSmartModalService.close('deleteBulkModal');
    });
  }

  editExpense() {
    this.expenseService.editExpense(this.formModel.value).then(te => {
      this.toastr.success('Expense Has Edited!', 'Success.');
    }).catch(error => {
      this.toastr.error('Cannot Edit!', 'Error.');
    }).finally(() => {
      this.ngxSmartModalService.close('editExpenseModal');
    });
  }

  // Open Modals
  openAddModal() {
    this.formModel.reset();
    this.ngxSmartModalService.open('addExpenseModal');
  }

  openDeleteModal(expenseExpense) {
    this.ngxSmartModalService.resetModalData('deleteExpenseModal');

    var obj = expenseExpense;
    this.ngxSmartModalService.setModalData(obj, 'deleteExpenseModal');
    this.ngxSmartModalService.open('deleteExpenseModal');
  }

  public openDeleteBulkModal() {
    this.getSelectedRows();
    if (this.selectedDatas.length == this.expenses.length) {
      if (confirm('You are not deleting only shown expenses but all expenses. Are you sure ?')) {
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

  openEditModal(expense) {
    let datePipe = new DatePipe('tr-TR');
    this.formModel.patchValue(
      {
        expenseId: expense.expenseId,
        description: expense.description,
        amount: expense.amount,
        expenseDate: datePipe.transform(expense.expenseDate, 'yyyy-MM-dd'),
      }

    );
    this.ngxSmartModalService.open('editExpenseModal');
  }

}
