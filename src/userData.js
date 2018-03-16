import '../lib/largeSync.js';

export const userData = {
  OPTIONS: {
    HISTORY_LENGTH: 20,
    POPUP_HISTORY_LENGTH: 3,
  },
  HISTORY: [],
  SERIES: {},
};

export const retrieveUserData = () =>
  new Promise((resolve, reject) => {
    chrome.storage.largeSync.get(['data'], (items) => {
      if (chrome.runtime.error) {
        reject(chrome.runtime.error);
        return;
      }
      resolve(items.data);
    });
  });

export const sortUserData = (data) => {
  const sortedUserData = {
    recent: data.HISTORY,
    favorite: [],
    seelater: [],
    completed: [],
  };
  Object.keys(data.SERIES).forEach((seriesId) => {
    const series = data.SERIES[seriesId];
    if (series.favorite) {
      sortedUserData.favorite.push(seriesId);
    }
    if (series.seelater) {
      sortedUserData.seelater.push(seriesId);
    }
    if (series.completed) {
      sortedUserData.completed.push(seriesId);
    }
  });
  return sortedUserData;
};
