import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Item } from '../models/item.model';
import { Observable } from 'rxjs';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http: HttpClient, private firebase: AngularFireDatabase) { }

  readonly CLOUDINARY_IMAGE_UPLOAD = 'https://api.cloudinary.com/v1_1/dtwayb8co/image/upload';
  readonly CLOUDINARY_UPLOAD_PRESET = 't8cy95y6';
  readonly BaseURI = 'https://textileappdb.firebaseio.com';
  itemList: AngularFireList<any>;

  addItem(item: Item) {
    return this.itemList.push(
      {
        description: item.description,
        code: item.code,
        comingDate: item.comingDate,
        count: item.count,
        isCompleted: item.isCompleted,
        photoUrl: item.photoUrl,
        price: item.price,
      }
    );
  }

  editItem(item: Item) {
    return this.itemList.update(item.itemId,
      {
        description: item.description,
        code: item.code,
        comingDate: item.comingDate,
        count: item.count,
        isCompleted: item.isCompleted,
        photoUrl: item.photoUrl,
        price: item.price,
      }
    );
  }

  deleteItem(id) {
    return this.itemList.remove(id);
  }

  deleteBulkItem(items: Item[]) {
    var ref = this.firebase.database.ref('Items');
    var deletedItems = {};
    items.forEach(el => {
      deletedItems[el.itemId] = null;
    });
    return ref.update(deletedItems);
  }

  getItemById(id) {
    return this.firebase.object('/Items/' + id);
  }

  getAllItem() {
    this.itemList = this.firebase.list('Items');
    return this.itemList;
  }

  uploadPhoto(selectedFile) {
    const fd = new FormData();
    fd.append('file', selectedFile, selectedFile.name);
    fd.append('upload_preset', this.CLOUDINARY_UPLOAD_PRESET);
    return this.http.post<any>(this.CLOUDINARY_IMAGE_UPLOAD, fd);
  }

}
