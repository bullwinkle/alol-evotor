export interface ICompanyDiscrountCard  {
  id: number,
  user_id: number,
  discountcard_id: number,
  company_id: number,
  address_ids: number[],
  company_order_id: number | null
  title: string,
  description: string,
  additional_info_main: string,
  percent_prefix: string,
  next_discountcard_id: number,
  next_discountcard_amount: number,
  percent: number,
  price: number,
  accepted_everywhere: boolean,
  excluded_address_ids: number[],
  balance: string,
  expired_at: string,
  external_id: string,
  deleted: false,
  created_at: string,
  updated_at: string,
  deleted_at: string,
  status: number,
  additional_info_customer: string,
  position: number,
}

export interface ILoyaltyConnection {
  discountcard_id: number,
  verify_status: number,
  user_id: number
}


export interface IUser {
  id: number,
  login: string,
  phone: string,
  nickname:string,
  birthday:string,
  sex: number,
  marriage:string,
  country_id: number,
  city_id: number,
  email:string,
  created_at:string,
  updated_at:string,
  deleted: boolean,
  deleted_at:string,
  type: number,
  personal_phone_number:string,
  first_name:string,
  last_name:string,
  photo_id: number,
  is_offer_accepted: boolean,
  offer_version:string,
  is_email_confirmed: boolean,
  company_id: number,
  group_id: number,
  university_id: number,
  faculty_id: number,
  fts_nickname:string,
  is_blocked: boolean
}

export interface IUserDiscountCardConnectionResponse {
  user: IUser,
  discount_cards: ICompanyDiscrountCard[],
  phone: string,
  messages: {
    find_user?: string,
    invalid_phone?: string
  },
  state: {
    has_user?: boolean,
    has_loyalty?: boolean,
    is_phone_number_valid?: boolean
  }
}

export interface ISmsRequest {
  phone: string,
  cardId: number,
  userId: number
}

export interface ISmsResponse {
  discountcard_id: number,
  phone: string,
  state: {
    is_code_sent: boolean
  },
  user: IUser
}

export interface IConfirmConnectionParams {
  phone: string,
  email: string,
  cardId: number,
  confirmationCode: string,
  userId: number,
  name: string,
  lastName: string,
  sex: number,
  dateOfBirth: string | number,
  cardNumber: string,
  comment: string
}



export interface IConfirmConnectionResponse {
  user:{
    id: number,
    phone:string,
    email:string,
    first_name: string,
    last_name:string,
    sex:0,
    birthday:null
  },
  customer:{
    id:number,
    user_id:number,
    company_id:number,
    phone:string,
    email:string,
    first_name:string,
    last_name:string,
    sex:number,
    birthday:string,
    comment:string,
  }
  phone: string,
  discount_cards: ICompanyDiscrountCard[],
  state:{
    has_user:false,
    is_confirmed:true,
    is_loyalty_activate:true
  },
  messages:{
    find_user:string
  }

}




export interface IEvotorHttp {
  get(url: string | Object): any
  post(url: string, payload: string, mediaType: string): any
}

export interface IEvotorReceipt {
  applyReceiptDiscount(discount: number): void  //применение скидки ко всему чеку, абсолютное значение в рублях
  removePosition(uuid: string): void            // удаление из чека товара, который уже был добавлен через addPosition
  addPosition(uuid: string): void               // добавление товара в чек
  addReceiptExtra(data:string):void             // доп. инфо
}

export interface IEvotorNavigation {
  /*
   Closes current view on Evotor terminal, opens next
   */
  pushNext(data?: any): void
}

export interface IEvotorLoger {
  log: Function
}

export interface IEvotorProduct {
  ID: string,  // "136"
  UUID: string,  // "1196da34-e4a8-4915-8e92-bd7792875d76"
  CODE: string,  // "4"
  CODE_UPPER_CASE: string,  // "4"
  NAME: string,  // "вино апсны"
  NAME_UPPER_CASE: string,  // "ВИНО АПСНЫ"
  IS_GROUP: string,  // "0"
  IS_FAVORITE: string,  // "0"
  MEASURE_ID: string,  // "1"
  PRICE_OUT: string,  // "20000"
  COST_PRICE: string,  // "0"
  QUANTITY: string,  // "-1000"
  TAX_NUMBER: string,  // "VAT_18"
  ABBREVIATION: string,  // "ВНП"
  TILE_COLOR: string,  // "-26624"
  TYPE: string,  // "NORMAL"
  ALCOHOL_BY_VOLUME: string,  // "0"
  ALCOHOL_PRODUCT_KIND_CODE: string,  // "0"
  TARE_VOLUME: string,  // "0"
  SELL_FORBIDDEN: string,  // "0"
  DESCRIPTION: string,
  ARTICLE_NUMBER: string,
  ARTICLE_NUMBER_UPPER_CASE: string
}

export interface IEvotorInventory {
  getProduct(productUID: string): string // JSON string with IEvotorProduct
}

