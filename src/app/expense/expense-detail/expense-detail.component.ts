import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Expense } from 'src/app/models/expense.model';
import { ActivatedRoute } from '@angular/router';
import { ExpenseService } from 'src/app/shared/expense.service';
import { ToastrService } from 'ngx-toastr';
import { slider } from 'src/app/route-animations';

@Component({
  selector: 'app-expense-detail',
  templateUrl: './expense-detail.component.html',
  styleUrls: ['./expense-detail.component.css'],
  animations: [
    slider
  ]
})
export class ExpenseDetailComponent implements OnInit, AfterViewInit {
  id: any;
  expense: Expense;
  isOpen = false;
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

      this.isOpen = true;
  }

  ngAfterViewInit(): void {
    this.isOpen = false;
  }

}
