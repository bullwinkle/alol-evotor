function setCursor(node,pos){

  var node = (typeof node == "string") ? document.querySelector(node) : node;

  if(!node){
    return false;
  }else if(node.createTextRange){
    var textRange = node.createTextRange();
    textRange.collapse(true);
    textRange.moveEnd(pos);
    textRange.moveStart(pos);
    textRange.select();
    return true;
  }else if(node.setSelectionRange){
    node.setSelectionRange(pos,pos);
    return true;
  }

  return false;
}

const MASKED_INPUT_NAMES = {
  PHONE: 'phone',
  CARD: 'card'
}

function setDefaultValue (el:HTMLInputElement,name) {

  let defaultValue = (()=>{
    switch (name) {
      case MASKED_INPUT_NAMES.PHONE: return ['+7 (___) ___-____',4];
      case MASKED_INPUT_NAMES.CARD: return ['____ ____ ____ ____',0];
      default: return ['',0];
    }
  })();

  if (!el.value) {
    setTimeout(()=>{
      el.value = String(defaultValue[0]);
      setTimeout(()=>{
        setCursor(el,defaultValue[1]);
      })
    })
  }
}

function unsetDefaultValue (el:HTMLInputElement,name) {

  let defaultValueStart= (()=>{
    switch (name) {
      case MASKED_INPUT_NAMES.PHONE: return '+7 (__';
      case MASKED_INPUT_NAMES.CARD: return '__';
      default: return '';
    }
  })();

  if (el.value.startsWith(defaultValueStart)) {
    setTimeout(()=>{ el.value = '';  })
  }
}
