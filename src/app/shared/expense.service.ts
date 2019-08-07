import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Expense } from '../models/expense.model';
import { Observable } from 'rxjs';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  expenseList: AngularFireList<any>;
  totalHour = 0;
  constructor(private firebase: AngularFireDatabase) { }
  readonly BaseURI = 'https://textileappdb.firebaseio.com';

  addExpense(expense: Expense) {
    return this.expenseList.push(
      {
        description: expense.description,
        amount: expense.amount,
        expenseDate: expense.expenseDate,
      }
    );
  }

  editExpense(expense: Expense) {
    return this.expenseList.update(expense.expenseId,
      {
        description: expense.description,
        amount: expense.amount,
        expenseDate: expense.expenseDate,
      }
    );
  }

  deleteExpense(id) {
    return this.expenseList.remove(id);
  }

  deleteBulkExpense(expenses: Expense[]) {
    var ref = this.firebase.database.ref('Expenses');
    var deletedExpenses = {};
    expenses.forEach(el => {
      deletedExpenses[el.expenseId] = null;
    });
    return ref.update(deletedExpenses);
  }

  getExpenseById(id) {
    return this.firebase.object('/Expenses/' + id);
  }

  getAllExpense() {
    this.expenseList = this.firebase.list('Expenses');
    return this.expenseList;
  }

}
