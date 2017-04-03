import { Injectable } from '@angular/core';

import {AppSettings} from "../../app.settings";

const LogTypes = {
  error: 'Error',
  success: 'Success',
  responseError: 'ResponseError',
  responseSuccess: 'ResponseSuccess'
};

@Injectable()
export class LoggerService {

  static LogTypes = LogTypes;

  constructor(public settings: AppSettings) {}

  log(name: string,data:any) {
    console.info(name,data)

    try {
      data = this.normalizeData(data);

      window['logger'].log('ru.evotor.market.booster_test ' + data)
    } catch (err) {}

    if (this.settings.debug) {
      alert(name+''+data)
    }

  }

  normalizeData(data:any):Object {
    if (typeof data === 'object') {
      data =  JSON.stringify(data,null,2)
    }
    return data;
  }

}
