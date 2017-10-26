let userData = {
  OPTIONS: {
    HISTORY_LENGTH: 20,
    POPUP_HISTORY_LENGTH: 5,
  },
  HISTORY: [],
  SERIES: {},
};

// userData:
// {
//   HISTORY: [
//     {
//       seriesId: 'string',
//       episodeTitle: 'string',
//       episodeUrl: 'string',
//       lastVisit: 'date string',
//     },
//   ],
//   SERIES: {
//     series-name: {
//       seriesTitle: 'string',
//       seriesUrl: 'string',
//       episodeTitle: 'string',
//       episodeUrl: 'string',
//       lastVisit: 'date string',
//       favorite: 'boolean',
//       seelater: 'boolean',
//       completed: 'boolean'
//     }
//   }
// }

function updateEpisode(requestData) {
  const {
    id,
    seriesTitle,
    seriesUrl,
    episodeTitle,
    episodeUrl,
  } = requestData;
  if (!id) {
    return;
  }
  if (!userData.SERIES[id]) {
    userData.SERIES[id] = {};
  }
  let info = {};
  const lastVisit = new Date().toString();
  if (!episodeUrl) {
    // series page
    info = {
      seriesTitle,
      seriesUrl,
      lastVisit,
    };
  } else {
    // episode page
    info = {
      seriesTitle,
      seriesUrl,
      episodeTitle,
      episodeUrl,
      lastVisit,
    };
  }
  userData.SERIES[id] = Object.assign({}, userData.SERIES[id], info);

  // add history data
  const historyData = {
    seriesId: id,
    episodeTitle,
    episodeUrl,
    lastVisit,
  };
  userData.HISTORY.unshift(historyData);
  if (userData.HISTORY.length > userData.OPTIONS.HISTORY_LENGTH) {
    userData.HISTORY = userData.HISTORY.slice(0, userData.OPTIONS.HISTORY_LENGTH);
  }
}

function toggleSeeLater(requestData) {
  const {
    id,
  } = requestData;
  if (!id || !userData.SERIES[id]) {
    return;
  }
  userData.SERIES[id].seelater = !userData.SERIES[id].seelater;
}

function toggleFavorite(requestData) {
  const {
    id,
  } = requestData;
  if (!id || !userData.SERIES[id]) {
    return;
  }
  userData.SERIES[id].favorite = !userData.SERIES[id].favorite;
}

function toggleCompleted(requestData) {
  const {
    id,
  } = requestData;
  if (!id || !userData.SERIES[id]) {
    return;
  }
  userData.SERIES[id].completed = !userData.SERIES[id].completed;
}

function updateOptions(requestData) {
  const {
    name,
    value,
  } = requestData;
  if (!name || !userData.OPTIONS[name]) {
    return;
  }
  userData.OPTIONS[name] = value;
}

function importData(requestData) {
  if (!requestData) {
    return;
  }
  userData = requestData;
}

function onMessage(request) {
  try {
    // retrieve extension's user data
    chrome.storage.sync.get('data', (currentData) => {
      if (chrome.runtime.error) {
        alert('[ERROR] User data cannot be read.');
        return false;
      }
      // save data locally
      Object.assign(userData, currentData.data);
      // check if request exists and has an 'action' attribute
      if (!request && !request.action) {
        alert('[ERROR] Request not valid.');
        return false;
      }
      const requestData = Object.assign({}, request.data);
      // do the requested action
      switch (request.action) {
        case 'VIEW':
          updateEpisode(requestData);
          break;
        case 'TOGGLE':
          switch (requestData.attribute) {
            case 'favorite':
              toggleFavorite(requestData);
              break;
            case 'seelater':
              toggleSeeLater(requestData);
              break;
            case 'completed':
              toggleCompleted(requestData);
              break;
            default:
              alert('[ERROR] Unknown attribute.');
              break;
          }
          break;
        case 'OPTIONS':
          updateOptions(requestData);
          break;
        case 'IMPORT':
          importData(requestData);
          break;
        default:
          alert('[ERROR] Unknown request type.');
          return false;
      }
      // persist extension's data
      chrome.storage.sync.set({
        data: userData,
      }, () => {
        if (chrome.runtime.error) {
          return false;
        }
        chrome.runtime.sendMessage({
          action: 'REFRESH',
        });
        return true;
      });
      return true;
    });
  } catch (e) {
    alert(`[ERROR] ${e}`);
  }
  return false;
}

chrome.runtime.onMessage.addListener(onMessage);
