// import 'hammerjs';

import {AppSettings} from './app.settings';
import {NgModule} from '@angular/core';
import {HttpModule, Http, XHRBackend, BaseRequestOptions,BaseResponseOptions, ConnectionBackend} from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {RouterModule} from '@angular/router';
import {APP_BASE_HREF} from '@angular/common';

import { TextMaskModule } from 'angular2-text-mask';

import { MdButtonModule } from '@angular/material/button/index';
import { MdCheckboxModule } from '@angular/material/checkbox/index';
import { MdRadioModule } from '@angular/material/radio/index';
import { MdIconModule } from '@angular/material/icon/index';
import { MdProgressSpinnerModule } from '@angular/material/progress-spinner/index';
import { MdInputModule } from '@angular/material/input/index';
import { MdSnackBarModule } from '@angular/material/snack-bar/index';
import { MdToolbarModule } from '@angular/material/toolbar/index';
import { MdDialogModule } from '@angular/material/dialog/index';

import {HttpService} from './common/services/_http.service';
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
    ,CommonModule
    ,FormsModule
    ,ReactiveFormsModule
    ,HttpModule
    ,RouterModule.forRoot(appRoutes)
    ,FlexLayoutModule
    ,AppCommonModule

    ,TextMaskModule

    ,MdButtonModule.forRoot()
    ,MdCheckboxModule.forRoot()
    ,MdRadioModule.forRoot()
    ,MdIconModule.forRoot()
    ,MdProgressSpinnerModule.forRoot()
    ,MdInputModule.forRoot()
    ,MdSnackBarModule.forRoot()
    ,MdToolbarModule.forRoot()
    ,MdDialogModule.forRoot()

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
      deps: [XHRBackend, EvotorBackend, BaseRequestOptions],
    },
    { provide: APP_BASE_HREF, useValue: './' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

