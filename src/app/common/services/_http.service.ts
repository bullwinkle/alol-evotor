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


interface RequestLog {
  url: string,
  body: any,
  method: string,
  start: Date,
  finish: Date,
}

let requestId = 0;



let loggedRequests = new class RequestLogger extends Array {
  $push (data:RequestLog):RequestLog {
    super.push(data);
    return data;
  }

  toJSON(){
    return this.map((el,i)=>{
      let scenario = el.body.scenario || `[UNKNOWN #${i}]`;
      let start = el.start;
      let finish = el.finish;
      let body = Object.assign({},el.body);
      delete body.scenario;
      delete body._requestsLog;
      return {[scenario]:{start,finish,body}}
    });
  }
};

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

    let logData:RequestLog = (()=>{
      if (url instanceof Request) {
        Object.assign(url['_body'],{_requestsLog:loggedRequests.toJSON()});
        return {
          url:url.url,
          body:url.json(),
          method:(RequestMethod[url.method] || '').toUpperCase(),
          start: new Date(),
          finish: new Date()
        }
      } else if (typeof url === 'string') {
        Object.assign(options.body,{_requestsLog:loggedRequests.toJSON()});
        return {
          url:`${url}${options.search}`,
          body:options.body,
          method:(RequestMethod[options.method] || '').toUpperCase(),
          start: new Date(),
          finish: new Date()
        }
      }
    })();

    let $logData = loggedRequests.$push(logData);

    let requestObservable = super.request(url,options);

    this.logger.log(`[REQUEST #${requestId} STARTED] ${logData.method} ${logData.url}\nat ${new Date()}`,{
      request_params:logData.body
    });

    return requestObservable.do(
      (response) => {
        $logData.finish = new Date();
        this.logger.log(`[REQUEST #${requestId} FINISHED_SUCCESS]  ${logData.method} ${logData.url}\nat ${new Date()}`,{
          request_params:logData.body,response:response.json()});
      },
      (error) => {
        $logData.finish = new Date();
        this.logger.log(`[REQUEST #${requestId} FINISHED_ERROR]  ${logData.method} ${logData.url}\nat ${new Date()}`,{
          request_params:logData.body,response:error});
      }
    );
  }

}
