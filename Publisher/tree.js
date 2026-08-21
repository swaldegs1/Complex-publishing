//Neccessary for older browser like IE 11
if (typeof String.prototype.startsWith !== "function") {
  String.prototype.startsWith = function (searchString, position) {
    if (searchString) {
      position = position || 0;
      return (
        this.substring(position, position + searchString.length) ===
        searchString
      );
    } else return false;
  };
}

function ExpandOrCollapse(child) {
  var fEnable;
  var fEnableSet = false;

  var nextListItem = child.parentElement.nextElementSibling;
  if (nextListItem.querySelector("ul") != null) {
    var childs = nextListItem.querySelectorAll("li");
    for (i = 0; i < childs.length; i++) {
      if (!fEnableSet) {
        fEnable = childs[i].style.display == "none";
        fEnableSet = true;
      }
      if (fEnable) {
        childs[i].style.display = "block";
      } else {
        childs[i].style.display = "none";
      }
    }
  }
}

function LoadContent(ele, pushHistoryState) {
  var selected = ele.id;
  var targetURL = ele.getAttribute("data-targetUrl");
  for (i = 0; i < document.getElementsByClassName("treeitem").length; i++) {
    const item = document.getElementsByClassName("treeitem")[i];
    if (item.id != ele.id)
      item.className = item.className.replace(" selected", "");
    else if (
      (item.id == ele.id || (ele.id == "null" && i == 0)) &&
      item.className.includes("selected") == false
    ) {
      item.className += " selected";
      selected = item.id;
    }
  }
  if (pushHistoryState)
    history.pushState(null, "", location.pathname + "?selected=" + selected);
  if (targetURL != "") {
    const iframe = document.getElementById("iframe");
    iframe.contentWindow.location.replace(targetURL);
  }
}

function getURLParameter(name) {
  return decodeURI(
    (RegExp(name + "=" + "(.+?)(&|$)").exec(location.search) || [, null])[1],
  );
}

function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

window.addEventListener("popstate", function (event) {
  var selected = getURLParameter("selected");
  var selTreeItem;
  if (selected != "null") selTreeItem = document.getElementById(selected);
  else selTreeItem = document.getElementsByClassName("treeitem")[0];

  if (selTreeItem != null) {
    if (isInViewport(selTreeItem) == false) selTreeItem.scrollIntoView();
    LoadContent(selTreeItem, false);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  var selected = getURLParameter("selected");
  if (selected != "null") {
    var selTreeItem = document.getElementById(selected);
    if (selTreeItem != null) {
      if (isInViewport(selTreeItem) == false) selTreeItem.scrollIntoView();
      LoadContent(selTreeItem, false);
    }
  }

  // Query the element
  const resizer = document.getElementsByClassName("splitter")[0];
  if (resizer != null) {
    const leftSide = resizer.previousElementSibling;
    const rightSide = resizer.nextElementSibling;

    // The current position of mouse
    let x = 0;
    let y = 0;

    // Width of left side
    let leftWidth = 0;

    // Handle the mousedown event
    // that's triggered when user drags the resizer
    const mouseDownHandler = function (e) {
      // Get the current mouse position
      x = e.clientX;
      y = e.clientY;
      leftWidth = leftSide.getBoundingClientRect().width;

      // Attach the listeners to `document`
      document.addEventListener("mousemove", mouseMoveHandler);
      document.addEventListener("mouseup", mouseUpHandler);
    };

    // Attach the handler
    resizer.addEventListener("mousedown", mouseDownHandler);

    const mouseMoveHandler = function (e) {
      // How far the mouse has been moved
      const dx = e.clientX - x;
      const dy = e.clientY - y;

      const newLeftWidth =
        ((leftWidth + dx) * 100) /
        resizer.parentNode.getBoundingClientRect().width;
      leftSide.style.width = newLeftWidth + "%";

      resizer.style.cursor = "col-resize";
      document.body.style.cursor = "col-resize";

      leftSide.style.userSelect = "none";
      leftSide.style.pointerEvents = "none";

      rightSide.style.userSelect = "none";
      rightSide.style.pointerEvents = "none";
    };

    const mouseUpHandler = function () {
      resizer.style.removeProperty("cursor");
      document.body.style.removeProperty("cursor");

      leftSide.style.removeProperty("user-select");
      leftSide.style.removeProperty("pointer-events");

      rightSide.style.removeProperty("user-select");
      rightSide.style.removeProperty("pointer-events");

      // Remove the handlers of `mousemove` and `mouseup`
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("mouseup", mouseUpHandler);
    };
  }
});
