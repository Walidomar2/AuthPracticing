import { Routes } from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthLayoutComponent } from './layouts/auth-layout.component';
import { authGuard } from './shared/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'signup',
        component: RegistrationComponent,
    },
    {
        path: '',
        component: AuthLayoutComponent,
        children: [
            { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    }
];