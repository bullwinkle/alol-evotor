import { Injectable } from '@angular/core';

export interface IAppSettings {
  debug: boolean,
  baseUrl: string,
  apiUrl: string,
  authorizationHeader: string
}

export const APP_SETTINGS: IAppSettings = {
  debug: false,
  baseUrl: 'https://stage.alol.io',
  apiUrl: '/rest/2.0/',
  authorizationHeader: 'Bearer 9105afc974d12f793f3ab04f996485f7f512de21'
};

@Injectable()
export class AppSettings implements IAppSettings {

  public debug: boolean;
  public baseUrl: string;
  public apiUrl: string;
  public authorizationHeader: string;

  constructor() {
    return APP_SETTINGS;
  }

}
