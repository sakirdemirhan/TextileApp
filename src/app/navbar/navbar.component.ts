import { Component, OnInit } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(public ngxSmartModalService: NgxSmartModalService,) { }

  ngOnInit() {
  }

  // onLogout() {
  //   localStorage.removeItem('token');
  //   this.router.navigate(['/user/login']);
  // }

  onOpenMenu() {
    this.ngxSmartModalService.open('showMenu');
  }

}
