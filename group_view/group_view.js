var querying = browser.tabs.query({currentWindow: true});

var output = "<ul>";

querying.then((result)=>{
  result.forEach((tab)=>{
//    console.log("favIconUrl of tab at index ", tab.id, " and the favIconUrl is ", tab.favIconUrl);
    output += `
      <li>
        <h4>${tab.title}</h4>
        <img src="${tab.favIconUrl}"alt="">
      </li>`;
  });
  output += "</ul>";
  document.body.insertAdjacentHTML("afterbegin",output);
});

var storedGroups = browser.storage.local.get().then((items)=>{
  console.log("items",items);
  console.log("items.tabs",items.tabs);

var groupContainer = document.getElementById("groups");

  var groupNode = document.createElement("div");
  var tabList = document.createElement("ul");
  items.tabs.forEach((tab) => {
    console.log("tab",tab);
    var listElement = document.createElement("li");
    var imgElement = document.createElement("img");
    imgElement.setAttribute("src", tab.favIconUrl);
    listElement.appendChild(imgElement);
    tabList.appendChild(listElement);
  });
  groupNode.appendChild(tabList);
  groupContainer.appendChild(groupNode);

});
