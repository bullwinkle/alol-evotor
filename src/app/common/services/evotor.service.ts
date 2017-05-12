import {Injectable} from '@angular/core';
import {
  Http,
  ConnectionBackend,
  Request,
  Connection,
  ReadyState,
  RequestOptions,
  RequestOptionsArgs,
  Response,
  ResponseOptions,
  Headers,
  RequestMethod
} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {
  IEvotorHttp,
  IEvotorRequest,
  IEvotorReceipt,
  IEvotorNavigation,
  IEvotorProduct,
  IEvotorInventory,
  IEvotorLoger
} from '../../../typings';
import {AppSettings} from "../../app.settings";
import {LoggerService} from "./logger.service";
import {Observer} from "rxjs";

const scannerEvents = ((window):Observable<any> => {

  let fake = Observable.create((observer)=>{});

  try {

    let defaultHandler = (e) => {
      console.info('scannerEvents defaultHandler', e)
    };
    let globalHandler = window['handleScannerEvent'] || defaultHandler;

    let observable = Observable.create((observer) => {
      window['handleScannerEvent'] = (data: any) => {
        console.warn('handling events from service');
        observer.next(data);
        globalHandler(data);
      };
    })
      .map(el => {
        console.log(el);
        return el;
      });

    return observable;

  } catch (err) {
    alert("scannerEvents error:"+err)
    return fake
  }
})(window);

declare const http:any;
declare const receipt:any;
declare const navigation:any;
declare const inventory:any;

export class EvotorConnection implements Connection {
  public readyState: ReadyState;
  public request: Request;
  public response: any;
  public http: IEvotorHttp;
  public logger: IEvotorLoger;

  constructor(request: Request) {
    this.http = http;
    this.request = request;
    this.readyState = ReadyState.Open;
    this.response = new Observable((responseObserver) => {

      let methodString = (() => {
        switch (request.method) {
          case RequestMethod.Get:
            return 'GET';
          case RequestMethod.Post:
            return 'POST';
          case RequestMethod.Put:
            return 'PUT';
          case RequestMethod.Patch:
            return 'PATCH';
          case RequestMethod.Delete:
            return 'DELETE';
          case RequestMethod.Options:
            return 'OPTIONS';
          case RequestMethod.Head:
            return 'HEAD';
        }
      })();

      let evoResponseBody = ((): any => {
        try {
          let res = this.http.send(JSON.stringify({
            method: methodString,
            path: request.url,
            body: request.getBody()
          }));


          // var xhr = new XMLHttpRequest();
          // xhr.open(
          //   methodString,
          //   ('http://stage.alol.io/rest/2.0/'+request.url),
          //   false
          // );
          // xhr.setRequestHeader('Content-Type', 'application/json');
          // xhr.setRequestHeader('Authorization', (new AppSettings().authorizationHeader));
          // xhr.send(request.getBody());
          // var res = xhr.responseText as any;

          if (typeof res === "string") {
            res = JSON.parse(res)
          }

          return res.body || res;

        } catch (err) {
          return {
            error: 'request error' + err
          }
        }
      })();

      let response = new Response({
        body: evoResponseBody,
        status: 200,
        headers: new Headers(),
        url: request.url,
        merge: (options) => {
          return options as ResponseOptions
        }
      });

      console.info('response', response);

      if (!evoResponseBody.error) {
        responseObserver.next(response);
      } else {
        responseObserver.error(response);
      }

      responseObserver.complete();

    })
  }
}

export class EvotorBackend implements ConnectionBackend {

  createConnection(request: Request): Connection {
    console.warn('createConnection', request)
    return new EvotorConnection(request)
  }
}

@Injectable()
export class EvotorService {

  private http: IEvotorHttp;
  private receipt: IEvotorReceipt;
  private navigation: IEvotorNavigation;
  private inventory: IEvotorInventory;

  public scannerEvents: Observable<any> = scannerEvents;

  private _extraData = null;

  constructor(public settings: AppSettings,
              public logger: LoggerService) {
    window['evo'] = this;
    try {
      this.http = http;
      this.receipt = receipt;
      this.navigation = navigation;
      this.inventory = inventory;
    } catch (e) {

    }

    // if (this.settings.debug)
    //   this.testAlert();
    this.scannerEvents.subscribe(
      e => {
        console.info('scannerEvents', e)
      },
      err => {
        console.info('scannerEvents', err)
      }
    )
  }

  close(data?: Object): void {
    console.info(this.constructor.name, 'close', data)

    try {
      Array.from(document.querySelectorAll('input,textarea'))
        .forEach((el:HTMLElement)=>{
          el.blur();
        })
    } catch (e) {
      console.warn('blur error')
    }

    setTimeout(()=>{
      try {
        this.navigation.pushNext();
      }
      catch (err) {
        console.warn(err);
        this.logger.log(LoggerService.LogTypes.error, {'navigation.pushNext()': err})
      }
    },50)
  }

  // request(request: IEvotorRequest): any {
  //
  //   let params = {
  //     method: 'POST',
  //     path: '',
  //     body: {}
  //   };
  //
  //   try {
  //     request.method = request.method.toUpperCase();
  //     let params = JSON.stringify(request);
  //     let response = this.http.send(params);
  //     return response;
  //   } catch (err) {
  //     console.warn(err);
  //     alert('HTTP error' + err);
  //   }
  // }

  getProductFromDBById(productId: string): IEvotorProduct | void {
    try {
      let result = JSON.parse(
        this.inventory.getProduct(productId)
      );

      this.logger.log(LoggerService.LogTypes.success, {'inventory.getProduct(...)': result});
      return result;

    } catch (err) {
      this.logger.log(LoggerService.LogTypes.error, {'inventory.getProduct(...)': err});

    }
  }

  applyDiscount(discountPercent: number) {
    try {
      this.receipt.applyReceiptDiscountPercent(discountPercent);
      this.logger.log(LoggerService.LogTypes.success, {'receipt.applyReceiptDiscountPercent(...)': discountPercent});
    } catch (e) {
      this.logger.log(LoggerService.LogTypes.error, {'receipt.applyReceiptDiscountPercent(...)': e});
    }
  }

  addExtraDataToReceipt(data: any) {
    this._extraData = data;

    try {
      let dataStr = JSON.stringify(data);
      this.receipt.addExtraReceiptData(dataStr);
      this.logger.log(LoggerService.LogTypes.success, {'receipt.addExtraReceiptData(...)': dataStr});
      return true;
    } catch (err) {
      this.logger.log(LoggerService.LogTypes.error, {'receipt.addExtraReceiptData(...)': err})
    }

    return false;
  }

  testAlert() {

    if (confirm('run test?')) {

      try {

        let interfacesInfo = JSON.stringify({
          http: Object.keys(window['http'] || {}),
          receipt: Object.keys(window['receipt'] || {}),
          navigation: Object.keys(window['navigation'] || {}),
          inventory: Object.keys(window['inventory'] || {}),
          logger: Object.keys(window['logger'] || {})
        }, null, 2);

        alert('Evotor interfaces:' + interfacesInfo);

      } catch (err) {
        this.logger.log(LoggerService.LogTypes.error, err)
      }

    }

  }

}
