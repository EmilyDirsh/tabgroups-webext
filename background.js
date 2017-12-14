"use strict";

const _currWin = function() {
  return browser.windows.getCurrent();
}

const _getExistingView = winId => {
  return browser.sessions.getWindowValue(winId, "groupView");
}

const _setViewInformation = function(winId, tab) {
  browser.sessions.setWindowValue(winId, "groupView", tab.id);
}

const _unsetViewInformation = winId => {
  browser.sessions.removeWindowValue(winId, "groupView")
}

const _newGroupView = winId => {
  browser.tabs.create({
    active: true,
    url: "/group_view/group_view.html"
  }).then((tab) => {
    _setViewInformation(winId, tab)
  });
}

const viewGroups = () => {
  var currentWindow;
  _currWin()
  .then((win) => {
    currentWindow = win.id;
    return _getExistingView(currentWindow);
  })
  .then((tabId) => {
    // console.log('tab', tabId);
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

const removeGroupView = tabId => {
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

const _handleAction = action => {
  switch(action) {
    case 'view':
      viewGroups();
      break;
  }
}

const _handleMessage = (message, sender) => {
  switch(message.type) {
    case 'action':
      _handleAction(message.action);
      break;
    default:
  }
}

browser.runtime.onMessage.addListener(_handleMessage);
browser.tabs.onRemoved.addListener(removeGroupView);
