var handleAction = function(action) {
  console.log("action", action);
  switch (action) {
    case "view":
        viewGroups();
      break;
    default:
  }
  window.close();
}

var viewGroups = function() {
  browser.tabs.create({
    active: true,
    url: "/group_view/group_view.html"
  });
}

document.addEventListener("click", function (e) {
  console.log("click", e);
  if (e.target.classList.contains("action")) {
    console.log("Action!");
    handleAction(e.target.dataset.action);
  }
});
