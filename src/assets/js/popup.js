import storage from "../js/chromeStorage";

let tabs = ["LAST_TAB", "FAVORITE_TAB"];

function createTabs({ tabs, defaultSelected, targetElement, changeCallback }) {
  const tabsObject = {};
  let selectedTab = "";

  if (defaultSelected) {
    selectedTab = defaultSelected;
  }

  if (!tabs || tabs.length === 0) {
    throw new Error("tabs not found, tabs length: 0");
  }

  if (!targetElement || targetElement.length === 0) {
    throw new Error("target element empty");
  }

  tabs.forEach((key, index) => {
    tabsObject[key] = document.querySelector(
      `${targetElement} li:nth-child(${index + 1})`
    );
  });

  Object.keys(tabsObject).forEach((key, index) => {
    tabsObject[key].onclick = () => {
      setSelectedTab(key);
    };
  });

  const setSelectedTab = (tab) => {
    if (tabsObject[tab]) {
      tabsObject[selectedTab].classList.remove("selected");
      tabsObject[tab].classList.add("selected");
    }
    selectedTab = tab;
    changeCallback(selectedTab);
  };

  return [tabsObject[selectedTab], setSelectedTab];
}

createTabs({
  tabs,
  targetElement: ".tab-menu",
  defaultSelected: "LAST_TAB",
  changeCallback: showSelectedTabList,
});

function showSelectedTabList(selectedTab) {
  storage.getSyncFavoriteStorage().then((result) => {
    console.log(result);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  storage.getSyncStorage(null).then((response) => {
    for (const [key, value] of Object.entries(response)) {
      if (value.length > 0) {
        let markup = value.at(0);
        addVideo({
          id: key,
          title: markup.title ?? "Unknown",
          count: value.length,
        });
      }
    }
  });
});

function addVideo(item) {
  const list = document.getElementById("videolist");

  let markupItem = document.createElement("div");
  markupItem.classList.add("markup-item");

  markupItem.innerHTML = `        
      <img src="https://i.ytimg.com/vi/${item.id}/hq720.jpg" item-id="${item.id}" class="video-thumbnail">
      <div class="video-info">
        <span class="video-title">${item.title}</span>
        <span class="markup-count">${item.count}</span>    
        <div class="collapse-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"/></svg>      
        </div> 
      </div>   
  `;

  // star icon
  //<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>

  markupItem.querySelector("img").onclick = () => {
    console.log("filan");
    /* const id = document.querySelector(".video-link").getAttribute("item-id");
    open(`https://www.youtube.com/watch?v=${id}`); */
  };

  markupItem.onclick = () => {
    console.log("falan");
  };

  list.appendChild(markupItem);
}

async function open(url) {
  getCurrentTab().then((tab) => {
    console.log(tab);
    chrome.tabs.update(tab.id, { url: url });
  });
}

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}
