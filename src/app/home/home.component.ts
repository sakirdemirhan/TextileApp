import { Component, OnInit } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {
  userDetails;
  formModel;

  constructor(
    public ngxSmartModalService: NgxSmartModalService) { }

  ngOnInit() {
    // this.service.getUserProfile().subscribe(
    //   res => {
    //     this.userDetails = res;
    //   },
    //   err => {
    //     console.log(err);
    //   },
    // );

  }


}
