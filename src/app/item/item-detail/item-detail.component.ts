import { Component, OnInit } from '@angular/core';
import { Item } from 'src/app/models/item.model';
import { ActivatedRoute } from '@angular/router';
import { ItemService } from 'src/app/shared/item.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css']
})
export class ItemDetailComponent implements OnInit {
  id: any;
  item: Item;
  constructor(
    private route: ActivatedRoute,
    private itemService: ItemService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.itemService.getItemById(this.id).valueChanges()
    .subscribe(
      item => {
        this.item = item as Item;
      },
      err => {
        this.toastr.error('Error.');
      }
    );
  }


}
