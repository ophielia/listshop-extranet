import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {SignUpComponent} from "./sign-up/sign-up.component";
import {ChangePasswordComponent} from "./change-password/change-password.component";
import {TokenGatewayComponent} from "./token-gateway/token-gateway.component";
import {ResetPasswordComponent} from "./reset-password/reset-password.component";
import {ResetConfirmComponent} from "./reset-confirm/reset-confirm.component";

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'The List Shop | Login',
      content: 'The List Shop | Login'
    }
  },
  {
    path: 'signup',
    component: SignUpComponent,
    data: {
      title: 'The List Shop | Sign Up',
      content: 'The List Shop | Sign Up'
    }
  },
  {
    path: 'password',
    component: ChangePasswordComponent,
      data: {
          title: 'The List Shop | Change Password',
          content: 'The List Shop | Change Password'
      }
  },
    {
        path: 'reset',
        component: ResetPasswordComponent,
        data: {
            title: 'The List Shop | Reset Password',
            content: 'The List Shop | Reset Password',

        }
    },
    {
        path: 'resetconfirm',
        component: ResetConfirmComponent,
        data: {
            title: 'The List Shop | Password Reset',
            content: 'The List Shop | Password Reset',

        }
    },
    {
        path: 'gateway',
        component: TokenGatewayComponent,
        data: {
            title: 'The List Shop | Change Password',
            content: 'The List Shop | Change Password'
        }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
