var _currWin = function() {
  return browser.windows.getCurrent();
}

var _getExistingView = function(winId) {
  return browser.sessions.getWindowValue(winId, "groupView");
}

var _setViewInformation = function(winId, tab) {
  browser.sessions.setWindowValue(winId, "groupView", tab.id);
}

var _unsetViewInformation = function(winId) {
  browser.sessions.removeWindowValue(winId, "groupView")
}

var _newGroupView = function(winId) {
  browser.tabs.create({
    active: true,
    url: "/group_view/group_view.html"
  }).then((tab) => {
    _setViewInformation(winId, tab)
  });
}

var viewGroups = function() {
  var currentWindow;
  _currWin()
  .then((win) => {
    currentWindow = win.id;
    return _getExistingView(currentWindow);
  })
  .then((tabId) => {
    console.log('tab', tabId);
    if (tabId) {
      browser.tabs.update(tabId, {active: true})
        .then(null, (error) => {
          // Handle error, i.e. if tab id no longer exists
          // Could happen due to a browser crash, etc
          _unsetViewInformation(currentWindow);
          _newGroupView(currentWindow);
        });
    }
    else {
      _newGroupView(currentWindow);
    }
  });
}

var removeGroupView = function(tabId) {
  var currentWindow;
  _currWin
  .then((win) => {
    currentWindow = win.id;
    return _getExistingView(currentWindow);
  })
  .then((existingTab) => {
    if (existingTab == tabId) {
      _unsetViewInformation(currentWindow);
    }
  });
}

var _handleAction = function(action) {
  switch(action) {
    case 'view':
      viewGroups();
      break;
  }
}

var _handleMessage = function(message, sender) {
  switch(message.type) {
    case 'action':
      _handleAction(message.action);
      break;
    default:
  }
}

browser.runtime.onMessage.addListener(_handleMessage);
browser.tabs.onRemoved.addListener(removeGroupView);
