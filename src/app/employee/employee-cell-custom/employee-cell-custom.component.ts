import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-employee-cell-custom',
  templateUrl: './employee-cell-custom.component.html',
  styleUrls: ['./employee-cell-custom.component.css']
})
export class EmployeeCellCustomComponent implements OnInit {
  data: any;
  params: any;
  constructor() { }

  agInit(params) {
    this.params = params
    this.data = params.node.data;

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
