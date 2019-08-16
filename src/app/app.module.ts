import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { registerLocaleData } from '@angular/common';
import localeTr from '@angular/common/locales/tr';
import { NgxLoadingModule } from 'ngx-loading';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { AgGridModule } from 'ag-grid-angular';
import { Ng2CompleterModule } from 'ng2-completer';
import { ChartsModule } from 'ng2-charts';
registerLocaleData(localeTr);
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { UserService } from './shared/user.service';
import { LoginComponent } from './user/login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { EmployeeComponent } from './employee/employee.component';
import { ItemComponent } from './item/item.component';
import { ItemDetailComponent } from './item/item-detail/item-detail.component';
import { EmployeeDetailComponent } from './employee/employee-detail/employee-detail.component';
import { EmployeeCellCustomComponent } from './employee/employee-cell-custom/employee-cell-custom.component';
import { ItemCellCustomComponent } from './item/item-cell-custom/item-cell-custom.component';
import { OvertimeComponent } from './overtime/overtime.component';
import { ExpenseComponent } from './expense/expense.component';
import { OvertimeDetailComponent } from './overtime/overtime-detail/overtime-detail.component';
import { OvertimeCellCustomComponent } from './overtime/overtime-cell-custom/overtime-cell-custom.component';
import { ExpenseDetailComponent } from './expense/expense-detail/expense-detail.component';
import { ExpenseCellCustomComponent } from './expense/expense-cell-custom/expense-cell-custom.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule, AngularFireDatabase } from '@angular/fire/database';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DB_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    RegistrationComponent,
    LoginComponent,
    HomeComponent,
    SidebarComponent,
    NavbarComponent,
    EmployeeComponent,
    ItemComponent,
    ItemDetailComponent,
    EmployeeDetailComponent,
    EmployeeCellCustomComponent,
    EmployeeCellCustomComponent,
    ItemCellCustomComponent,
    OvertimeComponent,
    ExpenseComponent,
    OvertimeDetailComponent,
    OvertimeCellCustomComponent,
    ExpenseDetailComponent,
    ExpenseCellCustomComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    Ng2ImgMaxModule,
    Ng2CompleterModule,
    ChartsModule,
    AngularFireDatabaseModule, 
    AngularFireModule.initializeApp(firebaseConfig),
    AgGridModule.withComponents([]),
    NgxSmartModalModule.forRoot(),
    NgxLoadingModule.forRoot({}),
    ToastrModule.forRoot({
      progressBar: true
    }),
    FormsModule
  ],
  providers: [
    UserService, 
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: AuthInterceptor,
    //   multi: true
    // },
    {provide: LOCALE_ID, useValue: 'en-US'}
  ],
  entryComponents: [EmployeeCellCustomComponent, ItemCellCustomComponent, ExpenseCellCustomComponent, OvertimeCellCustomComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
