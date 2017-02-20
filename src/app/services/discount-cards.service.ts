import { Injectable } from '@angular/core';

import {
  ICompanyDiscrountCard
} from '../../typings';

const DISCOUNT_CARDS: ICompanyDiscrountCard[] = [];

@Injectable()
export class DiscountCardsService extends Array {

  constructor () {
    super();
    return DISCOUNT_CARDS;
  }

}
