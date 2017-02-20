// import {NgModule} from '@angular/core/';
import {Routes} from '@angular/router';

import {StartComponent} from './components/start/start.component';
import {SelectLoyaltyProgramComponent} from './components/select-loyalty-program/select-loyalty-program.component';
import {ConfirmationComponent} from './components/confirmation/confirmation.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: StartComponent,
    data: {
      title: "Поиск клиента",
      goBackHidden: true
    }
  },
  {
    path: 'select-layalty',
    component: SelectLoyaltyProgramComponent,
    data: {
      title: "Программа лояльности",
      backTo: ''
    }
  },
  {
    path: 'confirmation',
    component: ConfirmationComponent,
    data: {
      title: "Регистрация",
      backTo: 'select-layalty'
    }
  },
  {
    path: '**',
    redirectTo: ''
    // component: NotFoundComponent,
    // data: {
    //   title: "404 - не найдено"
    // }
  },
];

// @NgModule({
//   imports: [
//     RouterModule.forRoot(appRoutes)
//   ],
//   exports: [
//     RouterModule
//   ]
// })
// export class AppRouterModule {}
