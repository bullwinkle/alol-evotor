import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {
  IUser,
  ICompanyDiscrountCard,
  ILoyaltyConnection,
  IUserDiscountCardConnectionResponse,
  ISmsRequest,
  ISmsResponse,
  IConfirmConnectionParams,
  IConfirmConnectionResponse
} from "../../../typings"

const SCENARIES = {
  USER_GET_OR_CREATE: 'check_loyalty_state',
  GET_COMPANY_DISCOUNTCARD: 'get_company_discountcard',
  VERIFY_DISCOUNTCARD_CONNECT: 'verify_discountcard_connect',
  DISCOUNTCARD_CONNECT: 'discountcard_connect'
};


@Injectable()
export class EvotorResource {

  constructor(private http: Http) {}

  public clearInput(str:string=''):string {
    return !str?'':str.replace(/\D/g, '');
  }

  checkUser({phone, card}): Observable<IUserDiscountCardConnectionResponse> {
    console.warn(this.http)

    if (!phone && !card) return Observable.throw('empty params');

    let rawPhone = this.clearInput(phone);
    let rawCard = this.clearInput(card);

    return this.http.post('/evotor?route=/api/v1/customer/register', {
      scenario: SCENARIES.USER_GET_OR_CREATE,
      phone: rawPhone,
      mastercard_number: rawCard
    })
      .map(res => {
        console.info('raw res',res)
        return res.json()
      })
      .catch((err) => {
        throw err.json()
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
        throw err.json()
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
    cardNumber
  }:IConfirmConnectionParams): Observable<IConfirmConnectionResponse> {

    userId || (userId = 0);
    phone || (phone = '');

    if (phone) phone = this.clearInput(phone);
    if (cardNumber) cardNumber = this.clearInput(cardNumber);
    if (dateOfBirth) dateOfBirth = this.normalizeDate(dateOfBirth);

    return this.http.post('/evotor?route=/api/v1/customer/register', {
      scenario: SCENARIES.DISCOUNTCARD_CONNECT,
      phone,
      sex: sex,
      email,
      discountcard_id: cardId,
      confirmation_code: confirmationCode,
      user_id: userId,
      first_name: name,
      last_name: lastName,
      birthday: dateOfBirth,
      mastercard_number: cardNumber,
    })
      .map(res => res.json())
      .catch((err) => {
        throw err.json()
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
        throw err.json()
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
