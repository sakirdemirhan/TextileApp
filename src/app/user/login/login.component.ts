import { Component } from "@angular/core";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [` form{
    margin: 0px 16px;
    padding: 23px;
}
label{
  color: #fff
}`]
})
export class LoginComponent {
  // formModel = {
  //   UserName: '',
  //   Password: ''
  // }
  // constructor(private service: UserService, private router: Router, private toastr: ToastrService) { }

  // ngOnInit() {
  //   if (localStorage.getItem('token') != null)
  //     this.router.navigateByUrl('/dashboard');
  // }

  // onSubmit(form: NgForm) {
  //   this.service.login(form.value).subscribe(
  //     (res: any) => {
  //       localStorage.setItem('token', res.token);
  //       this.router.navigateByUrl('/dashboard');
  //     },
  //     err => {
  //       if (err.status == 400)
  //         this.toastr.error('Incorrect username or password.', 'Authentication failed.');
  //       else
  //         console.log(err);
  //     }
  //   );
  // }
}
