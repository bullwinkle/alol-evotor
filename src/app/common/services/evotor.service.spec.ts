/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EvotorService } from './evotor.service';

describe('EvotorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EvotorService]
    });
  });

  it('should ...', inject([EvotorService], (service: EvotorService) => {
    expect(service).toBeTruthy();
  }));
});
