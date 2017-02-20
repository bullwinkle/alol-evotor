import { Injectable } from '@angular/core';
import {
  Http,
  ConnectionBackend,
  RequestOptions,
  Request,
  RequestOptionsArgs,
  Response
} from '@angular/http';
import { Observable } from 'rxjs/Observable';

import {ApiService} from "./api.service"

@Injectable()
export class HttpService extends Http implements Http {

  protected _backend: ConnectionBackend;
  protected _defaultOptions: RequestOptions;

  constructor(
    _backend: ConnectionBackend,
    _defaultOptions: RequestOptions
  ) {
    super(_backend,_defaultOptions)
  }

  private buildUrl (relativeUrl:string):string {
    return ApiService.buildUrl(relativeUrl);
  }

  // private buildOptions (options:any):RequestOptionsArgs {
  //   return ApiService.buildOptions(options);
  // }

  request(url: string|Request, options?: RequestOptionsArgs) : Observable<Response> {

    if (url instanceof Request) {
      url.url = this.buildUrl(url.url);
    } else if (typeof url === 'string') {
      url = this.buildUrl(url);
    }

    console.info(`[${this.constructor.name}.request]`,url,options);

    return super.request(url,options);
  }

}
