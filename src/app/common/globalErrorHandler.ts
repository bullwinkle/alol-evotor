export function globalErrorHandler (msg, url, line, col, error) {
  // Note that col & error are new to the HTML 5 spec and may not be
  // supported in every browser.  It worked for me in Chrome.
  var extra = !col ? '' : '\ncolumn: ' + col;
  extra += !error ? '' : '\nerror: ' + error;

  // You can view the information in an alert to see things working like this:
  var errMsg = "Error: " + msg + "\nurl: " + url + "\nline: " + line + extra;
  window['http']? alert(errMsg) : console.error('GLOBAL ERROR:',errMsg);

  // TODO: Report this error via ajax so you can keep track
  //       of what pages have JS issues

  var suppressErrorAlert = false;
  // If you return true, then error alerts (like in older versions of
  // Internet Explorer) will be suppressed.
  return suppressErrorAlert;
};
