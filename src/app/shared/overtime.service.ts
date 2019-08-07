import { Injectable } from '@angular/core';
import { Overtime } from '../models/overtime.model';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';
@Injectable({
  providedIn: 'root'
})
export class OvertimeService {

  overtimeList: AngularFireList<any>;
  totalHour = 0;
  constructor(private firebase: AngularFireDatabase) { }
  readonly BaseURI = 'https://textileappdb.firebaseio.com';

  addOvertime(overtime: Overtime) {
    return this.overtimeList.push(
      {
        employeeId: overtime.employeeId,
        hour: overtime.hour,
        overtimeDay: overtime.overtimeDay,
      }
    );
  }

  editOvertime(overtime: Overtime) {
    return this.overtimeList.update(overtime.overtimeId,
      {
        employeeId: overtime.employeeId,
        hour: overtime.hour,
        overtimeDay: overtime.overtimeDay,
      }
    );
  }

  deleteOvertime(id) {
    return this.overtimeList.remove(id);
  }

  deleteBulkOvertime(overtimes: Overtime[]) {
    var ref = this.firebase.database.ref('Overtimes');
    var deletedOvertimes = {};
    overtimes.forEach(el => {
      deletedOvertimes[el.overtimeId] = null;
    });
    return ref.update(deletedOvertimes);
  }

  getOvertimeById(id) {
    return this.firebase.object('/Overtimes/' + id);
  }

  getAllOvertime() {
    this.overtimeList = this.firebase.list('Overtimes');
    return this.overtimeList;
  }

  getOvertimeListByEmployeeId(id) {
    return this.firebase.database.ref('Overtimes').orderByChild('employeeId').equalTo(id);
  }

}
