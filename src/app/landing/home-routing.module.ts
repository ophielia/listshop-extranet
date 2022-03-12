import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeTwoComponent } from './home/versions/home-two/home-two.component';
import {AuthGuardHandler} from "../shared/handlers/auth-guard-handler";
import {AboutmeComponent} from "./aboutme/aboutme.component";
import {PrivacyComponent} from "./privacy/privacy.component";

// Routes
const routes: Routes = [
  {
    path: '',
    component: HomeTwoComponent,
    data: {
      title: 'The List Shop',
      content: 'Your shopping mealPlans - quickly'
    },
  },
  {
    path: 'aboutme',
    component: AboutmeComponent,
    data: {
      title: 'The List Shop',
      content: 'Your shopping mealPlans - how it started'
    },
  },
  {
    path: 'privacy',
    component: PrivacyComponent,
    data: {
      title: 'The List Shop',
      content: 'Your shopping mealPlans - how it started'
    }
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
