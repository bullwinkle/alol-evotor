"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var rxjs_1 = require('rxjs');
var logger_service_1 = require("./logger.service");
var EvotorConnection = (function () {
    function EvotorConnection(request) {
        var _this = this;
        this.http = window['http'];
        this.request = request;
        this.readyState = http_1.ReadyState.Open;
        this.response = new rxjs_1.Observable(function (responseObserver) {
            var methodString = (function () {
                switch (request.method) {
                    case http_1.RequestMethod.Get:
                        return 'GET';
                    case http_1.RequestMethod.Post:
                        return 'POST';
                    case http_1.RequestMethod.Put:
                        return 'PUT';
                    case http_1.RequestMethod.Patch:
                        return 'PATCH';
                    case http_1.RequestMethod.Delete:
                        return 'DELETE';
                    case http_1.RequestMethod.Options:
                        return 'OPTIONS';
                    case http_1.RequestMethod.Head:
                        return 'HEAD';
                }
            })();
            var evoResponseBody = (function () {
                try {
                    var res = _this.http.send(JSON.stringify({
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
                        res = JSON.parse(res);
                    }
                    return res.body || res;
                }
                catch (err) {
                    return {
                        error: 'request error' + err
                    };
                }
            })();
            var response = new http_1.Response({
                body: evoResponseBody,
                status: 200,
                headers: new http_1.Headers(),
                url: request.url,
                merge: function (options) {
                    return options;
                }
            });
            console.info('response', response);
            if (!evoResponseBody.error) {
                responseObserver.next(response);
            }
            else {
                responseObserver.error(response);
            }
            responseObserver.complete();
        });
    }
    return EvotorConnection;
}());
exports.EvotorConnection = EvotorConnection;
var EvotorBackend = (function () {
    function EvotorBackend() {
    }
    EvotorBackend.prototype.createConnection = function (request) {
        console.warn('createConnection', request);
        return new EvotorConnection(request);
    };
    return EvotorBackend;
}());
exports.EvotorBackend = EvotorBackend;
var EvotorService = (function () {
    function EvotorService(settings, logger) {
        this.settings = settings;
        this.logger = logger;
        this.http = window['http'];
        this.receipt = window['receipt'];
        this.navigation = window['navigation'];
        this.inventory = window['inventory'];
        if (this.settings.debug)
            this.testAlert();
    }
    EvotorService.prototype.close = function (data) {
        console.info(this.constructor.name, 'close', data);
        try {
            window['navigation'].pushNext();
        }
        catch (err) {
            console.warn(err);
            this.logger.log(logger_service_1.LoggerService.LogTypes.error, { 'navigation.pushNext()': err });
        }
    };
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
    EvotorService.prototype.getProductFromDBById = function (productId) {
        try {
            return JSON.parse(this.inventory.getProduct(productId));
        }
        catch (err) {
            alert('get product error' + err);
        }
    };
    EvotorService.prototype.applyDiscount = function (discountPercent) {
        if (this.receipt && this.receipt.applyReceiptDiscountPercent) {
            this.receipt.applyReceiptDiscountPercent(discountPercent);
        }
    };
    EvotorService.prototype.testAlert = function () {
        if (confirm('run test?')) {
            try {
                var interfacesInfo = JSON.stringify({
                    http: Object.keys(window['http'] || {}),
                    receipt: Object.keys(window['receipt'] || {}),
                    navigation: Object.keys(window['navigation'] || {}),
                    inventory: Object.keys(window['inventory'] || {}),
                    logger: Object.keys(window['logger'] || {})
                }, null, 2);
                alert('Evotor interfaces:' + interfacesInfo);
            }
            catch (err) {
                this.logger.log(logger_service_1.LoggerService.LogTypes.error, err);
            }
        }
    };
    EvotorService = __decorate([
        core_1.Injectable()
    ], EvotorService);
    return EvotorService;
}());
exports.EvotorService = EvotorService;
