document.addEventListener("click", function (e) {
  if (e.target.classList.contains("action")) {
    browser.runtime.sendMessage({
      type: "action",
      action: e.target.dataset.action
    });
  }
});
