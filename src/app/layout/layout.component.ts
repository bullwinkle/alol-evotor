import { Component, OnInit } from '@angular/core';
import { AppSettings } from '../app.settings';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  constructor(
    public APP_SETTINGS: AppSettings,
    public user: UserService
  ) {}

  ngOnInit() {}

}
