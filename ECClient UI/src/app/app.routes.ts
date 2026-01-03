import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './user/login/login.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
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
        component: UserComponent
    },
    {
        path: 'dashboard',
        component: DashboardComponent
    }

];