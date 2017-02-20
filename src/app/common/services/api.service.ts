import {Injectable} from '@angular/core';
import {RequestOptionsArgs, RequestOptions, Headers} from '@angular/http';
import {Location} from '@angular/common';
import * as _ from "lodash";
const merge = _.merge;
import { AppSettings, IAppSettings } from '../../app.settings';

@Injectable()
export class ApiService {

  static settings: IAppSettings = new AppSettings();

  static buildUrl(relativeUrl: string): string {

    let urlParts = [];

    if (window['http']) { // TODO SUPER DIRTY HACK, MAKE BETTER LATER
      urlParts.push(
        relativeUrl
      )
      urlParts[0] = urlParts[0].replace(/^\//,'');
    } else {
      urlParts.push(
        this.settings.baseUrl,
        this.settings.apiUrl,
        relativeUrl
      )
    }

    let fullUrl = urlParts.reduce((resultUrl,part,i)=>{
      return Location.joinWithSlash( resultUrl, part);
    },'');

    return Location.stripTrailingSlash( fullUrl );
  }

  static buildOptions(options: any): RequestOptions {
    return merge({},options, {
        // url: this.buildUrl(options.url),
        headers: new Headers({
          Authorization: this.settings.authorizationHeader
        })
      });
  }

  constructor() {}

}
