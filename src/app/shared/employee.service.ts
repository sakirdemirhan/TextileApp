import { Injectable } from '@angular/core';
import { Employee } from '../models/employee.model';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  employeeList: AngularFireList<any>;
  constructor(private firebase: AngularFireDatabase) { }
  readonly BaseURI = 'https://textileappdb.firebaseio.com';

  addEmployee(employee: Employee) {
    return this.employeeList.push(
      {
        phone: employee.phone,
        description: employee.description,
        salary: employee.salary,
        startDate: employee.startDate,
        fullName: employee.fullName
      }
    );
  }

  editEmployee(employee: Employee) {
    return this.employeeList.update(employee.employeeId,
      {
        phone: employee.phone,
        description: employee.description,
        salary: employee.salary,
        startDate: employee.startDate,
        fullName: employee.fullName
      }
    );
  }

  deleteEmployee(id) {
    return this.employeeList.remove(id);
  }

  deleteBulkEmployee(employees: Employee[]) {
    var ref = this.firebase.database.ref('Employees');
    var deletedEmployees = {};
    employees.forEach(el => {
      deletedEmployees[el.employeeId] = null;
    });
    return ref.update(deletedEmployees);
  }

  getEmployeeById(id) {
    return this.firebase.object('/Employees/' + id);
  }

  getAllEmployee() {
    this.employeeList = this.firebase.list('Employees');
    return this.employeeList;
  }

}
