import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import * as _ from "lodash"
const get = _.get;

import {EvotorResource} from '../../common/resources/evotor.resource';
import {NotificationService} from '../../common/services/notification.service';
import {EvotorService} from '../../common/services/evotor.service';
import {UserService,Sex} from '../../services/user.service';
import {INPUT_MASKS} from "../../common/constants/inputMasks";
import {LoggerService} from "../../common/services/logger.service";

import {
  IConfirmConnectionParams,
  ISmsRequest,
} from '../../../typings'

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {

  private timeRemain: number = 0;
  private timeRemainInterval: number;
  private smsCode: string = '';
  private canSubmitSmsCode: boolean = true;
  private isSMSCodeSubmitting: boolean = false;
  private isSubmitBlocked: boolean = false;

  constructor(private chRef: ChangeDetectorRef,
              private logger: LoggerService,
              public INPUT_MASKS: INPUT_MASKS,
              private router: Router,
              private evo: EvotorService,
              private evoResource: EvotorResource,
              private notificator: NotificationService,
              public user: UserService) {
  }

  ngOnInit() {

    this.sendSMSCode({
      phone: this.user.phone,
      cardId: this.user.discountCardId,
      userId: this.user.id
    });

  }

  submitConfirmation(data: any): Subscription {
    console.info('submitConfirmation', data);

    let params:IConfirmConnectionParams = {
      phone: this.user.phone,
      email: this.user.email,
      cardId: this.user.discountCardId,
      confirmationCode: this.smsCode,
      userId: this.user.id,
      name: this.user.name,
      lastName: this.user.lastName,
      sex: this.user.sex,
      dateOfBirth: this.user.dateOfBirth,
      cardNumber: this.user.cardNumber
    } as IConfirmConnectionParams;

    this.isSubmitBlocked = true;
    return this.evoResource.confirmLayaltyConnection(params)
      .finally(() => this.isSubmitBlocked = false)
      .subscribe(
        res => {
          try {

            this.logger.log(LoggerService.LogTypes.responseSuccess, res);

            let discountPercent = get(res,'discount_cards[0].percent',0);
            this.notificator.error({data: 'Подтверждение отправлено'});

            if (this.parseConfirmationResponse(res)) {
              this.evo.applyDiscount(discountPercent);
              this.evo.addExtraDataToReceipt({
                user_id: this.user.id,
                user_phone: this.user.phone,
                card_number: this.user.cardNumber
              });

              return this.evo.close();

            } else {
              return false;

            }

          } catch (err) {
            this.logger.log(LoggerService.LogTypes.error, err)
          }
        },
        err => {
          console.warn('request error:', err);

          this.logger.log(LoggerService.LogTypes.responseError, err);

          this.notificator.error({data: "Ошибка запроса" + err})
        }
      )
  }

  onInputInput(e: Event) {
    let el = e.currentTarget as HTMLInputElement;
    this.INPUT_MASKS.setDefaultValue(el, el.name)
  }

  onInputBlur(e: Event) {
    let el = e.target as HTMLInputElement;
    this.INPUT_MASKS.unsetDefaultValue(el, el.name);
  }

  onInputFocus(e: FocusEvent) {
    let el = e.currentTarget as HTMLInputElement;
    this.INPUT_MASKS.setDefaultValue(el, el.name)
  }

  sendSMSCode(params: ISmsRequest = {
    phone: this.user.phone,
    cardId: this.user.discountCardId,
    userId: this.user.id
  }): Subscription | void {

    console.info(params);

    let {phone, cardId, userId} = params;
    if (!phone || !cardId) return;

    this.blockSubmitSMSCodeButton();

    return this.evoResource.sendSMSCode({phone, cardId, userId})
      .subscribe(
        res => {

          try {

            this.logger.log(LoggerService.LogTypes.responseSuccess, res);

            let state = res.state || {
                is_code_sent: false
              };

            try {
              UserService.setData(res);
            } catch (err) {
              this.logger.log(LoggerService.LogTypes.error, err);
            }


            if (res.state.is_code_sent) {
              console.info('SMS send success', res);
              this.notificator.error({data: 'SMS отправлено'})

            } else {
              this.timeRemain = 0;
              this.notificator.error({data: 'Ошибка при отправке SMS'})
            }

          } catch (err) {
            this.logger.log(LoggerService.LogTypes.error, err)
          }
        },
        err => {
          console.warn('request error:', err);

          this.logger.log(LoggerService.LogTypes.responseError, err);

          this.notificator.error({data: 'request error'})
        }
      )
  }

  parseConfirmationResponse(data: any) {
    try {

      let result = true;
      let messages = data.messages || {};
      let state = data.state || {};
      let user = data.user || {};

      if (!state.is_confirmed) {
        result = false;
        this.notificator.error({data: messages.check_confirmation_code || 'Неверный код подтверждения'})
      }
      if (state.is_phone_number_valid === false) {
        result = false;
        this.notificator.error({
          data: messages.invalid_phone || 'Некорректный номер телефона',
          action: 'ok'
        });
      }

      return result;

    } catch (err) {
      this.logger.log(LoggerService.LogTypes.error, err)
    }
  }

  blockSubmitSMSCodeButton(time: number = 20 * 1000) {
    try {

      if (this.timeRemainInterval) clearInterval(this.timeRemainInterval);

      let step = 1000;

      this.timeRemain = time;
      this.canSubmitSmsCode = false;

      this.timeRemainInterval = setInterval(() => {
        this.timeRemain -= step;
        if (this.timeRemain > 0) {
          this.canSubmitSmsCode = false;
        } else {
          this.timeRemain = 0;
          this.canSubmitSmsCode = true;
          clearInterval(this.timeRemainInterval);
        }

      }, step);

    } catch (err) {
      this.logger.log(LoggerService.LogTypes.error, err)
    }
  }

}
