import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MaterialModule} from '@angular/material';
import {NgModule} from '@angular/core';

import {AuthAcquiaComponent} from './auth-acquia.component';
import {AuthAcquiaRoutingModule} from './auth-acquia-routing.module';
import {ElementalModule} from '../elemental/elemental.module';
import {JobsModule} from '../jobs/jobs.module';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    AuthAcquiaRoutingModule,
    MaterialModule.forRoot(),
    FormsModule,
    ElementalModule,
    JobsModule,
    SharedModule
  ],
  declarations: [
    AuthAcquiaComponent
  ]
})
export class AuthAcquiaModule { }
