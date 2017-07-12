import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import * as _ from "lodash";

import {
  IUser,
  ICompanyDiscrountCard,
  ILoyaltyConnection,
  IUserDiscountCardConnectionResponse,
  ISmsRequest,
  ISmsResponse,
  IConfirmConnectionParams,
  IConfirmConnectionResponse,
} from "../../../typings"

const SCENARIES = {
  USER_GET_OR_CREATE: 'check_loyalty_state',
  GET_COMPANY_DISCOUNTCARD: 'get_company_discountcard',
  VERIFY_DISCOUNTCARD_CONNECT: 'verify_discountcard_connect',
  DISCOUNTCARD_CONNECT: 'discountcard_connect'
};

const userFieldsToEncode = [
  'email',
  'first_name',
  'last_name',
  'nickname',
  'fts_nickname',
];

@Injectable()
export class EvotorResource {

  constructor(private http: Http) {}

  public clearInput(str:string=''):string {
    return !str?'':str.replace(/\D/g, '');
  }

  checkUser({phone, card}): Observable<{} | IUserDiscountCardConnectionResponse> {
    console.warn(this.http)

    if (!phone && !card)
      return Observable.throw('empty params')

    let rawPhone = this.clearInput(phone);
    let rawCard = this.clearInput(card);

    return this.http.post('/evotor?route=/api/v1/customer/register', {
      scenario: SCENARIES.USER_GET_OR_CREATE,
      phone: rawPhone,
      mastercard_number: rawCard
    })
      .map( response => {
        let res:IUserDiscountCardConnectionResponse = response.json();
        res.user = convert(
          convert(res.user,userFieldsToEncode,encodeURIComponent),
          userFieldsToEncode,
          decodeURIComponent
        ) as IUser;
        return res;
      } )
      .catch((err) => {
        throw err
      })
  }

  getCompanyDiscrountCards(): Observable<{
    company_discount_cards: ICompanyDiscrountCard[]
  }> {
    return this.http.post('/evotor?route=/api/v1/customer/register', {
      scenario: SCENARIES.GET_COMPANY_DISCOUNTCARD
    })
      .map(res => res.json())
      .catch((err) => {
        throw err
      })
  }

  confirmLayaltyConnection({
    phone,
    email,
    cardId,
    confirmationCode,
    userId,
    name,
    lastName,
    dateOfBirth,
    sex,
    cardNumber,
    comment
  }:IConfirmConnectionParams): Observable<IConfirmConnectionResponse> {

    userId || (userId = 0);
    phone || (phone = '');

    if (phone) phone = this.clearInput(phone);
    if (cardNumber) cardNumber = this.clearInput(cardNumber);
    if (dateOfBirth) dateOfBirth = this.normalizeDate(dateOfBirth);

    return this.http.post('/evotor?route=/api/v1/customer/register', convert(
        {
          scenario: SCENARIES.DISCOUNTCARD_CONNECT,
          phone,
          sex: sex,
          discountcard_id: cardId,
          confirmation_code: confirmationCode,
          user_id: userId,
          birthday: dateOfBirth,
          mastercard_number: cardNumber,
          email: email,
          first_name: name,
          last_name: lastName,
          comment: comment
        },
        ["email", "first_name", "last_name", "comment"],
        encodeURIComponent)
    ).map(response => {
        let res = response.json();
        let fieldsToEncode = ['email','first_name','last_name'];

        res.user = convert(
          convert( res.user,fieldsToEncode,encodeURIComponent),
          fieldsToEncode,
          decodeURIComponent
        );
        res.customer = convert(
          convert( res.customer,fieldsToEncode,encodeURIComponent),
          fieldsToEncode,
          decodeURIComponent
        );
        return res
      })
      .catch((err) => {
        throw err
      })
  }

  sendSMSCode({phone,cardId, userId}: ISmsRequest = {phone:'',cardId: null, userId:0}): Observable<ISmsResponse> {
      console.warn('sendSMSCode')
    if (!phone && !cardId)
      return Observable.throw('sendSMSCode - empty params');

    userId || (userId = 0);
    phone || (phone = '');

    if (phone) phone = this.clearInput(phone);

    let params = {
      scenario: SCENARIES.VERIFY_DISCOUNTCARD_CONNECT,
      phone: phone,
      discountcard_id: cardId,
      user_id: userId
    };

    return this.http.post('/evotor?route=/api/v1/customer/register', params)
      .map(res => res.json())
      .catch(err => {
        throw err
      })
  }

  normalizeDate(date:string|number):number {
      if (typeof date === 'number') return date;
      date = (()=>{
        if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
          return date;
        } else
        if (/^\d{2}-\d{2}-\d{4}$/.test(date)) {
          return `${date.substr(-4)}-${date.substr(3,2)}-${date.substr(0,2)}`;
        } else
        if (/^\d{2}\.\d{2}\.\d{4}$/.test(date)) {
          return `${date.substr(-4)}-${date.substr(3,2)}-${date.substr(0,2)}`;
        }
      })();

      let ts = Number(new Date(date))/1000;
      if (!isNaN(ts)) return ts;
      else return null;
  }

}




function convert (
    obj:any={},
    keys:string[]=[],
    converter = (el)=>{return el}
  ):Object {
  return _.chain({})
    .merge(obj)
    .merge(
      _.mapValues(
        _.pick(obj,keys),converter
      )
    )
    .value()
}
