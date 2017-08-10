import { Injectable } from '@angular/core';

import {AppSettings} from "../../app.settings";
import { IEvotorLoger } from '../../../typings';

const LogTypes = {
  success: '[Success] ',
  warning: '[Warning] ',
  error: '[Error] ',
  responseError: '[ResponseError] ',
  responseSuccess: '[ResponseSuccess] ',
};

declare var logger:any;

@Injectable()
export class LoggerService implements IEvotorLoger {

  static LogTypes = LogTypes;

  constructor(public settings: AppSettings) {}

  log(name: string,data:any) {
    [
      [
        () => data = this.normalizeData(data),
        () => 'LoggerService: normalizeData failed'
      ],
      [
        () => { switch (name) {
            case LogTypes.success: console.log(name,data); break;
            case LogTypes.warning: console.warn(name,data); break;
            case LogTypes.error: console.warn(name,data); break;
            case LogTypes.responseSuccess: console.info(name,data); break;
            case LogTypes.responseError: console.warn(name,data); break;
            default: console.log(name,data); break;
        }},
        () => 'LoggerService: log failed'
      ],
      [
        () => logger.log(name + ': ' + data),
        () => 'LoggerService: evotor`s "logger.log" failed to log'
      ],
    ].forEach(([tryFn,parseError],i)=>{

      try { tryFn() }
      catch (e) { console.log(parseError()) }

    });

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
