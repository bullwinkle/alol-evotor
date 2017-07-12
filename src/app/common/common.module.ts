import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/finally';

import {ApiService} from "./services/api.service"
import {EvotorService} from "./services/evotor.service"
import {NotificationService} from "./services/notification.service";

import {EvotorResource} from "./resources/evotor.resource";
import {INPUT_MASKS} from "./constants/inputMasks";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
  ],
  exports: [
  ],
  providers: [
    ApiService,
    EvotorService,
    NotificationService,
    EvotorResource,
    INPUT_MASKS
  ]
})
export class AppCommonModule { }
