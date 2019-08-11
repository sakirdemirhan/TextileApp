import { Component, OnInit } from '@angular/core';
import { EmployeeService } from 'src/app/shared/employee.service';
import { Employee } from 'src/app/models/employee.model';

@Component({
  selector: 'app-overtime-cell-custom',
  templateUrl: './overtime-cell-custom.component.html',
  styleUrls: ['./overtime-cell-custom.component.css']
})
export class OvertimeCellCustomComponent implements OnInit {
  data: any;
  params: any;
  value: any;
  empName = '';
  employees: Employee[]
  constructor(private employeeService: EmployeeService) { }

  agInit(params) {
    this.params = params
    this.data = params.node.data;
    this.value = params.value;

    if (this.params.node.data['employeeId'] === this.params.value) {
      this.employeeService.getAllEmployee().snapshotChanges().subscribe(
        item => {
          this.employees = [];
          item.forEach(el => {
            var p = el.payload.toJSON();
            p['employeeId'] = el.key;
            this.employees.push(p as Employee);
          });
          const result = this.employees.filter(x => x.employeeId == this.value);
          this.empName = result.length <= 0 ? 'Deleted Employee' : result[0].fullName;
        }
      );
    }

  }
  ngOnInit() {
    
  }

  public callEditModal() {
    this.params.context.componentParent.openEditModal(this.data)
  }
  public callDeleteModal() {
    this.params.context.componentParent.openDeleteModal(this.data)
  }

}
