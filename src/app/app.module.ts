import 'hammerjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppSettings} from './app.settings';
import {NgModule} from '@angular/core';
import {HttpModule, Http, XHRBackend, BaseRequestOptions,BaseResponseOptions} from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {RouterModule} from '@angular/router';
import {APP_BASE_HREF} from '@angular/common';

import { TextMaskModule } from 'angular2-text-mask';

import {
  MdButtonModule,
  MdCheckboxModule,
  MdRadioModule,
  MdIconModule,
  MdProgressSpinnerModule,
  MdInputModule,
  MdSnackBarModule,
  MdToolbarModule,
  MdDialogModule
} from '@angular/material';

import {HttpService} from './common/services/http.service';
import {EvotorBackend} from './common/services/evotor.service';
import {LoggerService} from './common/services/logger.service';
import {AppCommonModule} from './common/common.module';
import {appRoutes} from './app.router';

import {UserService} from "./services/user.service"
import {DiscountCardsService} from "./services/discount-cards.service"

import {AppComponent} from './app.component';
import {NotFoundComponent} from './components/not-found/not-found.component';
import {SelectLoyaltyProgramComponent} from './components/select-loyalty-program/select-loyalty-program.component';
import {ConfirmationComponent} from './components/confirmation/confirmation.component';
import {StartComponent} from './components/start/start.component';
import {ConfirmRegisterModalComponent} from './components/start/modal/modal.component';
import {LayoutComponent} from './layout/layout.component';

import {HttpFactory} from './common/http.factory';

@NgModule({
  imports: [
    BrowserModule
    ,BrowserAnimationsModule
    ,CommonModule
    ,FormsModule
    ,ReactiveFormsModule
    ,HttpModule
    ,RouterModule.forRoot(appRoutes)
    ,FlexLayoutModule
    ,AppCommonModule

    ,TextMaskModule

    ,MdButtonModule
    ,MdCheckboxModule
    ,MdRadioModule
    ,MdIconModule
    ,MdProgressSpinnerModule
    ,MdInputModule
    ,MdSnackBarModule
    ,MdToolbarModule
    ,MdDialogModule

  ],
  declarations: [
    AppComponent
    ,NotFoundComponent

    ,StartComponent
    ,SelectLoyaltyProgramComponent
    ,ConfirmationComponent
    ,ConfirmRegisterModalComponent
    ,LayoutComponent
  ],
  entryComponents: [
    ConfirmRegisterModalComponent
  ],
  providers: [
    UserService,
    DiscountCardsService,

    HttpService,
    BaseResponseOptions,
    BaseRequestOptions,
    EvotorBackend,
    AppSettings,
    LoggerService,
    { provide: Http, useFactory: HttpFactory,
      deps: [XHRBackend, EvotorBackend, BaseRequestOptions, LoggerService],
    },
    { provide: APP_BASE_HREF, useValue: './' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

