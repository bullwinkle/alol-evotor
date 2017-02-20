/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DiscountCardsService } from './discount-cards.service';

describe('DiscountCardsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DiscountCardsService]
    });
  });

  it('should ...', inject([DiscountCardsService], (service: DiscountCardsService) => {
    expect(service).toBeTruthy();
  }));
});
