import {BaseRequestOptions, ConnectionBackend, Headers} from '@angular/http';
import * as _ from "lodash";
const merge = _.merge;

import {HttpService} from './services/_http.service';
import {ApiService} from "./services/api.service";

export function HttpFactory (
   xhrBackend: ConnectionBackend,
   evotorBackend: ConnectionBackend,
   baseRequestOptions: BaseRequestOptions
) {

  let backend = (() => {
    if (typeof window['http'] !== 'undefined') {
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
          Authorization: ApiService.settings.authorizationHeader
        })
      }
    );

  return new HttpService(backend, baseRequestOptions);

}
