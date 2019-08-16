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
  // {
  //   path: 'user', component: UserComponent,
  //   children: [
  //     { path: 'registration', component: RegistrationComponent },
  //     { path: 'login', component: LoginComponent }
  //   ]
  // },
  {path:'home',component:HomeComponent, data: { animation: 'isRight' }},
  {path:'employee',component:EmployeeComponent, data: { animation: 'isRight' }},
  {path:'employeeDetail/:id',component:EmployeeDetailComponent, data: { animation: 'isRight' }},
  {path:'item',component:ItemComponent, data: { animation: 'isRight' }},
  {path:'itemDetail/:id',component:ItemDetailComponent, data: { animation: 'isRight' }},
  {path:'overtime',component:OvertimeComponent, data: { animation: 'isRight' }},
  {path:'overtimeDetail/:id',component:OvertimeDetailComponent, data: { animation: 'isRight' }},
  {path:'expense',component:ExpenseComponent, data: { animation: 'isRight' }},
  {path:'expenseDetail/:id',component:ExpenseDetailComponent, data: { animation: 'isRight' }},
  {path:'dashboard',component:DashboardComponent, data: { animation: 'isRight' }},
  {path:'menu',component:SidebarComponent, data: { animation: 'isRight' }},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
