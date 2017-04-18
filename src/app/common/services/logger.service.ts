import { Injectable } from '@angular/core';

import {AppSettings} from "../../app.settings";

const LogTypes = {
  error: 'Error',
  success: 'Success',
  responseError: 'ResponseError',
  responseSuccess: 'ResponseSuccess'
};

declare var logger:any;

@Injectable()
export class LoggerService {

  static LogTypes = LogTypes;

  constructor(public settings: AppSettings) {}

  log(name: string,data:any) {
    try {
      data = this.normalizeData(data);
      console.info(name,data)
      // logger.log('ru.evotor.market.booster_test ' + data)
    } catch (err) {
      console.error('Logger error',err)
    }

    if (this.settings.debug) {
      alert(name+''+data)
    }

  }

  normalizeData(data:any):Object {
    if (typeof data !== 'string') {
      data =  JSON.stringify(data,null,2)
    }
    return data;
  }

}
