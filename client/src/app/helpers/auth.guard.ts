import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../services/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthService
    ) { }

    canActivate() {

        const currentUser = this.authenticationService.currentUserValue;

        console.log(currentUser)
        if (currentUser) {
            // logged in so return true
            console.log('loggedin')
            return true;
        }

        console.log('pas loggedin')
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/']);
        return false;
    }
}
