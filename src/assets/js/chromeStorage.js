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

module.exports = { getSyncStorage, setSyncStorage };
