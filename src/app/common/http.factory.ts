import {BaseRequestOptions, ConnectionBackend, Headers} from '@angular/http';
import * as _ from "lodash";
const merge = _.merge;

import {HttpService} from './services/_http.service';
import {ApiService} from "./services/api.service";
import {LoggerService} from "./services/logger.service";

declare var http:any;

export function HttpFactory (
   xhrBackend: ConnectionBackend,
   evotorBackend: ConnectionBackend,
   baseRequestOptions: BaseRequestOptions,
   logger: LoggerService
) {

  let backend = (() => {
    if (typeof http !== 'undefined') {
      return evotorBackend
    } else {
      return xhrBackend
    }
  })();

  baseRequestOptions.merge = (options) =>
    merge(
      baseRequestOptions,
      options,
      {
        headers: new Headers({
          Authorization: ApiService.settings.authorizationHeader,
          'Content-Type' : 'application/json; charset=UTF-8'
        })
      }
    );

  return new HttpService(backend, baseRequestOptions, logger);

}
