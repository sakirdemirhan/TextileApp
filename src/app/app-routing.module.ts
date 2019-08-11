import { AuthGuard } from './auth/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user/user.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { LoginComponent } from './user/login/login.component';
import { HomeComponent } from './home/home.component';
import { EmployeeComponent } from './employee/employee.component';
import { ItemComponent } from './item/item.component';
import { EmployeeDetailComponent } from './employee/employee-detail/employee-detail.component';
import { ItemDetailComponent } from './item/item-detail/item-detail.component';
import { OvertimeComponent } from './overtime/overtime.component';
import { OvertimeDetailComponent } from './overtime/overtime-detail/overtime-detail.component';
import { ExpenseDetailComponent } from './expense/expense-detail/expense-detail.component';
import { ExpenseComponent } from './expense/expense.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './sidebar/sidebar.component';

const routes: Routes = [
  {path:'',redirectTo:'/dashboard',pathMatch:'full'},
  {
    path: 'user', component: UserComponent,
    children: [
      { path: 'registration', component: RegistrationComponent },
      { path: 'login', component: LoginComponent }
    ]
  },
  {path:'home',component:HomeComponent},
  {path:'employee',component:EmployeeComponent},
  {path:'employeeDetail/:id',component:EmployeeDetailComponent},
  {path:'item',component:ItemComponent},
  {path:'itemDetail/:id',component:ItemDetailComponent},
  {path:'overtime',component:OvertimeComponent},
  {path:'overtimeDetail/:id',component:OvertimeDetailComponent},
  {path:'expense',component:ExpenseComponent},
  {path:'expenseDetail/:id',component:ExpenseDetailComponent},
  {path:'dashboard',component:DashboardComponent},
  {path:'menu',component:SidebarComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
