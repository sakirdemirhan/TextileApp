import { Component, OnInit } from '@angular/core';
import { Expense } from 'src/app/models/expense.model';
import { ActivatedRoute } from '@angular/router';
import { ExpenseService } from 'src/app/shared/expense.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-expense-detail',
  templateUrl: './expense-detail.component.html',
  styleUrls: ['./expense-detail.component.css']
})
export class ExpenseDetailComponent implements OnInit {
  id: any;
  expense: Expense;
  constructor(
    private route: ActivatedRoute,
    private expenseService: ExpenseService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id']; // (+) converts string 'id' to a number
    this.expenseService.getExpenseById(this.id).valueChanges()
    .subscribe(
      item => {
        this.expense = item as Expense;
      },
      err => {
        this.toastr.error('Error.');
      }
    );
  }


}
