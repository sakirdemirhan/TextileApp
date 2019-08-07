import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable()
export class AuthInterceptor {

    // constructor(private router: Router) {

    // }

    // intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //     var clonedReq;
    //     if (localStorage.getItem('token') != null) {
    //         if(!req.url.includes('https://api.cloudinary.com/v1_1/dtwayb8co/image/upload')) {
    //             clonedReq = req.clone({
    //                 headers: req.headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'))
    //             });
    //         } else {
    //             clonedReq = req.clone();
    //         }
            
    //         return next.handle(clonedReq).pipe(
    //             tap(
    //                 succ => { },
    //                 err => {
    //                     if (err.status == 401){
    //                         localStorage.removeItem('token');
    //                         this.router.navigateByUrl('/user/login');
    //                     }
    //                 }
    //             )
    //         )
    //     }
    //     else
    //         return next.handle(req.clone());
    // }
}