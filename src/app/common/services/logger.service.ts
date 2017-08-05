import { Injectable } from '@angular/core';

import {AppSettings} from "../../app.settings";
import { IEvotorLoger } from '../../../typings';

const LogTypes = {
  error: 'Error',
  success: 'Success',
  responseError: 'ResponseError',
  responseSuccess: 'ResponseSuccess'
};

declare var logger:any;

@Injectable()
export class LoggerService implements IEvotorLoger {

  static LogTypes = LogTypes;

  constructor(public settings: AppSettings) {}

  log(name: string,data:any) {
    try {
      data = this.normalizeData(data);
      console.info(name,data)
      logger.log(name + ': ' + data)
    } catch (err) {
      console.error('Logger error',err)
    }

    if (this.settings.debug) {
      alert(name+''+data)
    }

  }

  normalizeData(data:any):string {
    if (typeof data !== 'string') {
      data =  JSON.stringify(data,null,2)
    }
    return data;
  }

}
