import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  selectedColor = 'blue';
  showColors = false;
  constructor() { }

  ngOnInit() {
    this.selectedColor = 'blue';
  }

  changeColor(str) {
    this.selectedColor = str;
    this.showColors = false;
  }

  onMouseOver() {
    this.showColors = !this.showColors;
  }

}
