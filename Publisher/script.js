var iMousePosX;
var fNetscape = false;
function init() {
  fNetscape = navigator.appName == "Netscape";
  if (fNetscape) {
    document.addEventListener("mousemove", watch_mouse);
  }
}
function watch_mouse(e) {
  iMousePosX = e.clientX;
}
var popup_window = null;
function openPopup(url) {
  if (popup_window != null) popup_window.focus();
  else {
    var width = (screen.width / 2) * 0.9;
    var height = screen.height * 0.9;
    var extra = (screen.width / 2) * 0.05;
    var left;
    if (!fNetscape) iMousePosX = event.screenX;
    if (iMousePosX < screen.width / 2) left = screen.width / 2 + extra;
    else left = screen.width / 2 - width - extra;
    popup_window = open(
      url,
      "Popup",
      "width=" + width + ",height=" + height + ",left=" + left + ", top=0",
    );
  }
}
function closePopup() {
  if (popup_window != null) {
    popup_window.close();
    popup_window = null;
  }
}
function openFixedPopup(url, target) {
  var width = (screen.width / 2) * 0.9;
  var height = screen.height * 0.9;
  var extra = (screen.width / 2) * 0.05;
  var left;
  if (!fNetscape) iMousePosX = event.screenX;
  if (iMousePosX < screen.width / 2) left = screen.width / 2 + extra;
  else left = screen.width / 2 - width - extra;
  window.open(
    url,
    target,
    "width=" + width + ",height=" + height + ",left=" + left + ", top=0",
  );
}
