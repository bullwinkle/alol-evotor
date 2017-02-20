/* tslint:disable:no-unused-variable */

import 'jasmine';
import { TestBed, async, inject } from '@angular/core/testing';
import { EvotorResource } from './evotor.resource';

describe('EvotorResource', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EvotorResource]
    });
  });

  it('should ...', inject([EvotorResource], (service: EvotorResource) => {
    expect(service).toBeTruthy();
  }));
});
