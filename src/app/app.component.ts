import {Component, Inject, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Router, ActivatedRoute} from '@angular/router';
import {Http, XHRBackend, BaseRequestOptions} from '@angular/http';

import * as _ from "lodash";
const get = _.get;

import {EvotorService} from './common/services/evotor.service';
import {UserService} from './services/user.service';
import {RoutesRecognized} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title: string;
  goBackHidden: boolean;
  urlToBack: string;

  constructor(private http: Http,
              private _location: Location,
              private _router: Router,
              private _route: ActivatedRoute,
              private evo: EvotorService,
              public user: UserService,) {

    this.title = 'Программа лояльности';

  }

  ngOnInit() {
    this._router.events
      .filter(e => (e instanceof RoutesRecognized))
      .subscribe((e: any) => {
      this.emit('route event', e);

      /*
       Bind to data from router config
       do not know, why need to use data from child?
       */

      let newTitle = get(e, 'state.root.firstChild.data.title') as string;
      if (newTitle) this.title = String(newTitle);

      this.urlToBack = get(e, 'state.root.firstChild.data.backTo','') as string;
      this.goBackHidden = get(e, 'state.root.firstChild.data.goBackHidden',false) as boolean;

    });
  }


  goBack() {
    // this._location.back();
    this._router.navigateByUrl(this.urlToBack || '');
  }

  bypass() {
    this.evo.close()
  }

  emit(eventName, ...args) {
    console.info(`[AppComponent:${eventName}]`, ...args);
  }
}


