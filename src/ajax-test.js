// logger.log - only 1 argument!
// ajax - 'Content-type', 'application/json' !!

logger.log('hello')

var url = 'https://alol.io/rest/2.0/user/644'

function ajax (url, callback, data, x) {
  try {
    logger.log('ajax try')
    x = new(this.XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0');
    x.open(data ? 'POST' : 'GET', url, 1);
    x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    x.setRequestHeader('Content-type', 'application/json');
    x.onreadystatechange = function () {
      x.readyState > 3 && callback && callback(x.responseText, x);
    };
    x.send(data)
  } catch (e) {
    logger.log('ajax catch')
    logger.log(e)
  }
};


function test () {

  logger.log('testing')
  ajax(url,function (res) {
    logger.log('ajax sucess')
    logger.log(res)
  });

}

setTimeout(function () {

  test();

},3000)
