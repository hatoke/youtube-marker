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

const [selectedTab, setSelectedTab] = createTabs({
  tabs,
  targetElement: ".tab-menu",
  defaultSelected: "LAST_TAB",
  changeCallback: showSelectedTabList,
});

function showSelectedTabList(selectedTab) {
  console.log("change dom ", selectedTab);
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

  let link = document.createElement("div");
  link.classList.add("video-link");
  link.setAttribute("data-url", `https://www.youtube.com/watch?v=${item.id}`);
  link.innerHTML = `<img src="https://i.ytimg.com/vi/${item.id}/hq720.jpg" class="video-thumbnail"><span class="video-title">${item.title}</span> <span class="markup-count">${item.count}</span>`;
  markupItem.appendChild(link);
  link.onclick = () => {
    open(`https://www.youtube.com/watch?v=${item.id}`);
  };

  list.appendChild(markupItem);
}

function open(url) {
  getCurrentTab().then((tab) => {
    chrome.tabs.update(tab.id, { url: url });
  });
}

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}
