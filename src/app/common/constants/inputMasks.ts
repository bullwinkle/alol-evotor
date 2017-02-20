var o = null;

export const MASKED_INPUT_NAMES = {
  PHONE: 'phone',
  CARD: 'card'
};

export const INPUT_MASKS_CONFIG = {
  [MASKED_INPUT_NAMES.PHONE]: {
    regExp: ['+','7',' ','(',/[1-9]/,/\d/,/\d/,')',' ',/\d/,/\d/,/\d/,'-',/\d/,/\d/,/\d/,/\d/] as Array<any>,
    template: '+7 (___) ___-____',
    startWith: 4
  },
  [MASKED_INPUT_NAMES.CARD]: {
    regExp: [/\d/,/\d/,/\d/,/\d/,' ',/\d/,/\d/,/\d/,/\d/,' ',/\d/,/\d/,/\d/,/\d/,' ',/\d/,/\d/,/\d/,/\d/] as Array<any>,
    template: '____ ____ ____ ____',
    startWith: 0
  }
};

export class INPUT_MASKS {
  protected phone = INPUT_MASKS_CONFIG[MASKED_INPUT_NAMES.PHONE];
  protected card = INPUT_MASKS_CONFIG[MASKED_INPUT_NAMES.CARD];
  protected names = MASKED_INPUT_NAMES;

  constructor() {
    if (o) return o;
    console.warn('INPUT_MASKS created');
    o = this;
    return o;
  }


  setCursor(node, pos) {

    var node = (typeof node == "string") ? document.querySelector(node) : node;
    if (!node) return false;

    if (node.createTextRange) {
      var textRange = node.createTextRange();
      textRange.collapse(true);
      textRange.moveEnd(pos);
      textRange.moveStart(pos);
      textRange.select();
      return true;
    } else if (node.setSelectionRange) {
      node.setSelectionRange(pos, pos);
      return true;
    }

    return false;
  }

  setDefaultValue(el: HTMLInputElement, name) {

    let [defaultValue,startFrom] = (() => {
      switch (name) {
        case MASKED_INPUT_NAMES.PHONE:
          return [this.phone.template, 4];
        case MASKED_INPUT_NAMES.CARD:
          return [this.card.template, 0];
        default:
          return ['', 0];
      }
    })();

    defaultValue = String(defaultValue);
    if (!el.value || el.value === defaultValue) {
      el.value = defaultValue;
      setTimeout(() => {
        this.setCursor(el, startFrom);
      })
    }
  }

  unsetDefaultValue(el: HTMLInputElement, name) {

    let defaultValue = (() => {
      switch (name) {
        case MASKED_INPUT_NAMES.PHONE:
          return this.phone.template.substr(0,6);
        case MASKED_INPUT_NAMES.CARD:
          return this.card.template.substr(0,2);
        default:
          return '';
      }
    })();

    if (el.value.startsWith(defaultValue)) {
      el.value = '';
    }
  }

}
;
