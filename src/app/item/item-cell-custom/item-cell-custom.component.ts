import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-item-cell-custom',
  templateUrl: './item-cell-custom.component.html',
  styleUrls: ['./item-cell-custom.component.css']
})
export class ItemCellCustomComponent implements OnInit {
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
