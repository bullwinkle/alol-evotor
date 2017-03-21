import { Injectable } from '@angular/core';
import {
  Http,
  ConnectionBackend,
  RequestOptions,
  Request,
  RequestOptionsArgs,
  Response,
  RequestMethod
} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

import {ApiService} from "./api.service"
import {LoggerService} from "./logger.service"

let requestId = 0;

@Injectable()
export class HttpService extends Http implements Http {

  protected _backend: ConnectionBackend;
  protected _defaultOptions: RequestOptions;

  constructor(
    _backend: ConnectionBackend,
    _defaultOptions: RequestOptions,
    private logger: LoggerService
  ) {
    super(_backend,_defaultOptions);
    this.logger = logger;
  }

  private buildUrl (relativeUrl:string):string {
    return ApiService.buildUrl(relativeUrl);
  }

  // private buildOptions (options:any):RequestOptionsArgs {
  //   return ApiService.buildOptions(options);
  // }

  request(url: string|Request, options?: RequestOptionsArgs) : Observable<Response> {
    requestId++;

    window['Observable'] = Observable;

    if (url instanceof Request) {
      url.url = this.buildUrl(url.url);
    } else if (typeof url === 'string') {
      url = this.buildUrl(url);
    }

    let logData = (()=>{
      if (url instanceof Request) {
        return {
          url:url.url,
          body:url.json(),
          method:(RequestMethod[url.method] || '').toUpperCase()
        }
      } else if (typeof url === 'string') {
        return {
          url:`${url}${options.search}`,
          body:options.body,
          method:(RequestMethod[options.method] || '').toUpperCase()
        }
      }
    })();

    let requestObservable = super.request(url,options);

    this.logger.log(`[REQUEST #${requestId} STARTED] ${logData.method} ${logData.url}\nat ${new Date()}`,{
      request_params:logData.body
    });

    return requestObservable.do(
      (response) => {
        this.logger.log(`[REQUEST #${requestId} FINISHED_SUCCESS]  ${logData.method} ${logData.url}\nat ${new Date()}`,{
          request_params:logData.body,response:response.json()});
      },
      (error) => {
        this.logger.log(`[REQUEST #${requestId} FINISHED_ERROR]  ${logData.method} ${logData.url}\nat ${new Date()}`,{
          request_params:logData.body,response:error});
      }
    );
  }

}
