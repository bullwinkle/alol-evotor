import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {LoggerService} from "../../common/services/logger.service";
import {NotificationService} from '../../common/services/notification.service';
import {EvotorResource} from '../../common/resources/evotor.resource';
import {UserService} from '../../services/user.service';
import {DiscountCardsService} from '../../services/discount-cards.service';
import {INPUT_MASKS} from "../../common/constants/inputMasks";

@Component({
  selector: 'app-select-loyalty-program',
  templateUrl: './select-loyalty-program.component.html',
  styleUrls: ['./select-loyalty-program.component.scss']
})
export class SelectLoyaltyProgramComponent implements OnInit {

  public isSubmitBlocked: boolean = false;
  public isLoading: boolean = false;

  constructor(private logger: LoggerService,
              public user: UserService,
              public discountCards: DiscountCardsService,
              public INPUT_MASKS: INPUT_MASKS,
              private router: Router,
              private evoResource: EvotorResource,
              private notificator: NotificationService) {
  }

  ngOnInit() {
    this.getDiscrountCards();
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

  isPhoneValid(val:string):boolean {
    try {
      return this.evoResource.clearInput(val).length >= 11
    } catch (err) {
      return false;
    }
  }

  getDiscrountCards() {
    this.isLoading = true;
    this.evoResource.getCompanyDiscrountCards()
      .finally(() => {
        this.isLoading = false
      })
      .delay(100)
      .subscribe(
        res => {

          try {
            this.logger.log(LoggerService.LogTypes.responseSuccess, res)

            let resDiscountCards = res.company_discount_cards || [];

            this.discountCards.splice(0);
            this.discountCards.push(...resDiscountCards);

            if (this.discountCards.length) {
              this.user.discountCardId = this.discountCards[0].id
            }

          } catch (err) { this.logger.log(LoggerService.LogTypes.error, err) }

        },
        err => {
          console.warn(err)

          this.logger.log(LoggerService.LogTypes.responseError, err)
          this.notificator.error(err)
        })
  }

  submitForm(val) {
    console.info('submit form', val);
    try {

      if (this.isSubmitBlocked) return;

      this.router.navigateByUrl('confirmation');

    } catch (err) { this.logger.log(LoggerService.LogTypes.error, err) }

  }

}
