var modifyTab = function(tab) {
    console.debug("Calling modifyTab");

    var iconPath = "/icons3/NA.png";
    var title = "POPUP TEST";

    browser.pageAction.setIcon({
        path: iconPath,
        tabId: tab.id
    });

    browser.pageAction.setTitle({
        title: title,
        tabId: tab.id
    });
};

var getTabInfo = function (tab) {
  if (tab.url !== undefined) {
      modifyTab(tab);
      browser.pageAction.show(tab.id);
  }
}

browser.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    getTabInfo(tab);
});

browser.tabs.onActivated.addListener(function (ids) {
    browser.tabs.get(ids.tabId, getTabInfo);
});
