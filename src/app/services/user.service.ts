import { Injectable } from '@angular/core';
import {ICompanyDiscrountCard, IUser} from '../../typings'
import * as _ from "lodash";
const get = _.get;

export enum Sex {male,female}

export const USER = {
  id:  0,
  name: '',
  lastName: '',
  phone: '',
  cardNumber: '',
  discountCardId: 0,
  sex: Sex.male,
  dateOfBirth: '',
  email: '',
  comment: '',
  discountCards: []
};

@Injectable()
export class UserService {

  public id: number;
  public name: string;
  public lastName: string;
  public phone: string;
  public cardNumber: string;
  public discountCardId: number;
  public sex: Sex;
  public dateOfBirth: string;
  public email: string;
  public comment: string;
  public discountCards: ICompanyDiscrountCard[];

  static setData(data) {
    let user = get(data,'user') as any;
    let discountCards = get(data,'discount_cards',[]) as Array<any>;
    let userPhone = get(data,'user.phone','') as string;

    if (userPhone) {
      let l = userPhone; // 71234567890
      userPhone = `+7 (${l.substr(1,3)}) ${l.substr(4,3)}-${l.substr(7)}`;
    }

    if (user) {
      Object.assign(USER,{
        id:  user.id,
        name: user.first_name,
        lastName: user.last_name,
        phone: userPhone,
        sex: user.sex,
        dateOfBirth: user.birthday,
        email: user.email,
      });
    }

    if (discountCards.length)
      USER.discountCards.push(...discountCards);

  }

  constructor() {
    return USER;
  }

}
