function getSyncStorage(objectKey) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(objectKey, function (result, reject) {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      return resolve(result);
    });
  });
}

function setSyncStorage(value) {
  chrome.storage.sync.set(value);
}

function getSyncFavoriteStorage() {
  return new Promise((resolve) => {
    const favorites = {};
    getSyncStorage(null).then((result) => {
      if (result) {
        for (const [videoId, markups] of Object.entries(result)) {
          const favoriteMarkup = markups.filter((markup) => markup.favorite);
          if (favoriteMarkup.length > 0) {
            favorites[videoId] = favoriteMarkup;
          }
        }
      }
    });
    resolve(favorites);
  });
}

module.exports = { getSyncStorage, setSyncStorage, getSyncFavoriteStorage };
