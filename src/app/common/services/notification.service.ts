import {Injectable, ViewContainerRef} from '@angular/core';
import {MdSnackBar, MdSnackBarRef, MdSnackBarConfig} from '@angular/material';
import {SimpleSnackBar} from '@angular/material';

export interface NotifyOptions {
  data: Object | string,
  action?: string,
  config?: MdSnackBarConfig
}

@Injectable()
export class NotificationService {

  private defaultSnackConfig: MdSnackBarConfig = Object.assign(new MdSnackBarConfig(), {
    duration: 6000
  });
  private defaultSnackOptions: NotifyOptions = {
    data: {},
    action: 'ok',
    config: this.defaultSnackConfig
  };

  constructor(private snackBar: MdSnackBar) {
  }

  error(options: NotifyOptions): MdSnackBarRef<SimpleSnackBar> {
    return this.notify(options);
  }

  log(options: NotifyOptions): MdSnackBarRef<SimpleSnackBar> {
    return this.notify(options);
  }

  warn(options: NotifyOptions): MdSnackBarRef<SimpleSnackBar> {
    return this.notify(options);
  }

  notify(options: NotifyOptions): MdSnackBarRef<SimpleSnackBar> {
    console.info(`[${this.constructor.name}.notify]`)

    options = this.normalizeOptions(options);
    return this.snackBar.open(
      options.data as string,
      options.action,
      options.config
    );
  }

  normalizeOptions(options: NotifyOptions): NotifyOptions {
    options.data = (() => {
      switch (typeof options.data) {
        case 'object':
          return JSON.stringify(options.data);
        case 'string':
          return String(options.data)
      }
    })();

    return Object.assign({}, this.defaultSnackOptions, options);
  }


}
