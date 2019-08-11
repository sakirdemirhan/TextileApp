import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemService } from '../shared/item.service';
import { Item } from '../models/item.model';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { AgGridNg2 } from 'ag-grid-angular';
import { ItemCellCustomComponent } from './item-cell-custom/item-cell-custom.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridNg2;
  gridOptions: any;
  gridApi: any;
  gridColumnApi: any;
  selectedDatas: any[];
  getSelectedRow: any;
  firstWarning = true;
  items: Item[];
  formModel: FormGroup;
  selectedFile: File = null;
  public loading = false;
  columnDefs = [

    {
      headerName: '', checkboxSelection: true, width: 50, headerCheckboxSelection: true
    },
    {
      headerName: 'View - Edit - Delete', field: 'itemId',
      cellRendererFramework: ItemCellCustomComponent
    },
    {
      headerName: 'Item Code', width: 140, field: 'code', sortable: true, resizable: true, filter: true, suppressSizeToFit: true
      // cellRenderer: "agGroupCellRenderer",
      // cellRendererParams: {
      //   innerRenderer: function(params) {
      //     // var flag =
      //     //   '<img border="0" width="15" height="10" src="http://images.clipartpanda.com/apple-20clip-20art-nicubunu_Apple_Clipart_Free.png">';
      //     // return flag + params.data.fullName;
      //   }
      // }
    },
    {
      headerName: 'Image', width: 120, field: 'photoUrl', sortable: true,
      cellRenderer: "agGroupCellRenderer",
      cellRendererParams: {
        innerRenderer: function (params) {
          var pic =
            `<img style="margin-left: -42px;" border="0" width="50" height="50" src="${params.data.photoUrl}">`;
          return pic;
        }
      }
    },
    { headerName: 'Count', width: 100, field: 'count', sortable: true },
    { headerName: 'Price per Item', field: 'price', sortable: true, valueFormatter: this.currencyFormatter },
    { headerName: 'Coming Date', field: 'comingDate', sortable: true, valueFormatter: this.dateFormatter },
    { headerName: 'Status', field: 'isCompleted', sortable: true, valueFormatter: this.booleanFormatter },
    { headerName: 'Description', field: 'description', sortable: true },
  ];

  constructor(
    private itemService: ItemService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    public ngxSmartModalService: NgxSmartModalService,
    public imgMaxService: Ng2ImgMaxService,
  ) {
    this.gridOptions = {
      context: {
        componentParent: this
      }
    }
  }

  ngOnInit() {
    this.refreshList();

    this.formModel = this.fb.group({
      itemId: new FormControl(),
      code: new FormControl(),
      description: new FormControl(),
      count: new FormControl(),
      price: new FormControl(),
      comingDate: new FormControl(),
      isCompleted: new FormControl(),
      photoUrl: new FormControl()
    });
  }

  refreshList() {
    this.itemService.getAllItem().snapshotChanges()
      .subscribe(
        item => {
          this.items = [];
          item.forEach(el => {
            var p = el.payload.toJSON();
            p['itemId'] = el.key;
            this.items.push(p as Item);
          });
        }
      );
  }

  dateFormatter(params) {
    const date = new DatePipe('en-US');
    return date.transform(params.value);
  }

  currencyFormatter(params) {
    var total = params.data.price * params.data.count;
    return `${params.value} $  (Total: ${total} $)`;
  }

  booleanFormatter(params) {
    return params.value == true ? 'Completed' : 'In Process';
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // var allColumnIds = [];
    // this.gridColumnApi.getAllColumns().forEach(function(column) {
    //   allColumnIds.push(column.colId);
    // });
    // this.gridColumnApi.autoSizeColumns(allColumnIds);
  }

  getSelectedRows() {
    const selectedNodes = this.agGrid.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    this.selectedDatas = selectedData;
    // const selectedDataStringPresentation = selectedData.map(node => node.fullName + ' ' + node.salary).join(', ');
    // alert(`Selected nodes: ${selectedDataStringPresentation}`);
  }

  onRowSelected(data) {
    this.getSelectedRows();
  }

  onFileSelected(data) {
    let image = <File>data.target.files[0];
    this.imgMaxService.resizeImage(image, 10000, 400).subscribe(
      result => {
        this.selectedFile = new File([result], result.name);
      },
      error => {
        console.log('😢 Oh no!', error);
      }
    );
  }

  addItem() {

    if (this.formModel.value.isCompleted == null || this.formModel.value.isCompleted == undefined) {
      this.formModel.patchValue(
        {
          isCompleted: false
        }
      );
    }

    if (this.selectedFile != null) {
      this.loading = true;
      this.itemService.uploadPhoto(this.selectedFile).subscribe(
        res => {
          this.formModel.value.photoUrl = res.url;
          this.itemService.addItem(this.formModel.value).then(te => {
            this.toastr.success('New Item Added!', 'Success.');
            this.selectedFile = null;
            this.loading = false;
          }).catch(error => {
            this.toastr.error('Cannot Add!', 'Error.');
            this.loading = false;
          }).finally(() => {
            this.ngxSmartModalService.close('addItemModal');
          });
        },
        err => {
          this.toastr.error('Error occured during uploading photo. Try different image.', 'Error');
          this.loading = false;
        }
      );
    } else {
      this.loading = true;
      this.itemService.addItem(this.formModel.value).then(te => {
        this.toastr.success('New Item Added!', 'Success.');
        this.loading = false;
      }).catch(error => {
        this.toastr.error('Cannot Add!', 'Error.');
        this.loading = false;
      }).finally(() => {
        this.ngxSmartModalService.close('addItemModal');
      });
    }


  }

  deleteItem(id) {
    this.itemService.deleteItem(id).then(te => {
      this.toastr.success('Selected Item Deleted!', 'Success.');
    }).catch(error => {
      this.toastr.error('Cannot Delete!', 'Error.');
    }).finally(() => {
      this.ngxSmartModalService.close('deleteItemModal');
    });
  }

  deleteBulkItem(data) {
    this.itemService.deleteBulkItem(data).then(te => {
      this.toastr.success('Selected Items Deleted!', 'Success.');
    }).catch(error => {
      this.toastr.error('Cannot Delete!', 'Error.');
    }).finally(() => {
      this.ngxSmartModalService.close('deleteBulkModal');
    });
  }

  editItem() {
    if (this.selectedFile != null) {
      this.loading = true;
      this.itemService.uploadPhoto(this.selectedFile).subscribe(
        res => {
          this.formModel.value.photoUrl = res.url;
          this.itemService.editItem(this.formModel.value).then(te => {
            this.toastr.success('Item Has Edited!', 'Success.');
            this.selectedFile = null;
            this.loading = false;
          }).catch(error => {
            this.toastr.error('Cannot Edit!', 'Error.');
            this.loading = false;
          }).finally(() => {
            this.ngxSmartModalService.close('editItemModal');
          });
        },
        err => {
          this.toastr.error('Error occured during uploading photo. Try different image.', 'Error');
          this.loading = false;
        }
      );
    } else {
      this.loading = true;
      const oldUrl = this.items.filter(x => x.itemId == this.formModel.value.itemId)[0].photoUrl;
      this.formModel.value.photoUrl = oldUrl === undefined ? null : oldUrl;
      this.itemService.editItem(this.formModel.value).then(te => {
        this.toastr.success('Item Has Edited!', 'Success.');
        this.selectedFile = null;
        this.loading = false;
      }).catch(error => {
        this.toastr.error('Cannot Edit!', 'Error.');
        this.loading = false;
      }).finally(() => {
        this.ngxSmartModalService.close('editItemModal');
      });
    }
  }

  // Open Modals
  openAddModal() {
    this.formModel.reset();
    this.ngxSmartModalService.open('addItemModal');
  }

  openDeleteModal(itemItem) {
    this.ngxSmartModalService.resetModalData('deleteItemModal');

    var obj = itemItem;
    this.ngxSmartModalService.setModalData(obj, 'deleteItemModal');
    this.ngxSmartModalService.open('deleteItemModal');
  }

  public openDeleteBulkModal() {
    this.getSelectedRows();
    if (this.selectedDatas.length == this.items.length) {
      if (confirm('You are not deleting only shown items but all items. Are you sure ?')) {
        this.ngxSmartModalService.resetModalData('deleteBulkModal');
        this.ngxSmartModalService.setModalData(this.selectedDatas, 'deleteBulkModal');
        this.ngxSmartModalService.open('deleteBulkModal');
      } else {
        this.gridOptions.api.deselectAll();
        return;
      }

    }
    this.ngxSmartModalService.resetModalData('deleteBulkModal');
    this.ngxSmartModalService.setModalData(this.selectedDatas, 'deleteBulkModal');
    this.ngxSmartModalService.open('deleteBulkModal');
  }

  closeBulkModal() {
    this.gridOptions.api.deselectAll();
    this.ngxSmartModalService.close('deleteBulkModal');
  }

  openEditModal(itemItem) {
    let datePipe = new DatePipe('en-US');
    this.formModel.patchValue(
      {
        itemId: itemItem.itemId,
        code: itemItem.code,
        description: itemItem.description,
        count: itemItem.count,
        price: itemItem.price,
        comingDate: datePipe.transform(itemItem.comingDate, 'yyyy-MM-dd'),
        isCompleted: itemItem.isCompleted,
      }

    );
    this.ngxSmartModalService.open('editItemModal');
  }

}
