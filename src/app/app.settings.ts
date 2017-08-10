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
  authorizationHeader: 'Bearer c9c6497598f3a334a5f101b63dc2e58fde88de42'
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
