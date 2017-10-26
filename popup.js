const userData = {
  OPTIONS: {
    HISTORY_LENGTH: 20,
    POPUP_HISTORY_LENGTH: 5,
  },
  HISTORY: [],
  SERIES: {},
};

const retrieveInfo = () =>
  new Promise((resolve, reject) => {
    chrome.storage.sync.get('data', (items) => {
      if (chrome.runtime.error) {
        reject(chrome.runtime.error);
        return;
      }
      resolve(items.data);
    });
  });

const sortUserData = (data) => {
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

const getUserLocale = () => window.navigator.userLanguage || window.navigator.language;

const renderLists = (sortedUserData) => {
  const locale = getUserLocale();
  const { recent, seelater } = sortedUserData;
  // build recent episodes list
  const recentSeries = [];
  const recentEpisodesMarkup = recent.map((item, i) => {
    if (i > userData.OPTIONS.POPUP_HISTORY_LENGTH - 1) {
      return '';
    }
    const {
      seriesId, episodeTitle, episodeUrl, lastVisit,
    } = item;
    const series = userData.SERIES[seriesId];
    if (recentSeries.indexOf(seriesId) < 0) {
      recentSeries.push(seriesId);
    }
    const title = episodeTitle || series.seriesTitle;
    const url = episodeUrl || series.seriesUrl;
    const date = new Intl.DateTimeFormat(locale, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(lastVisit));
    return `
      <li class="episode">
        <span class="episode-date">${date}</span>
        <div class="episode-title">
          <a class="episode-link" href="${url}" target="_blank" rel="noopener noreferrer">
            ${title}
          </a>
        </div>
        <div class="episode-series-title">
          <a class="episode-series-link" href="${series.seriesUrl}" target="_blank" rel="noopener noreferrer">
            ${series.seriesTitle}
          </a>
        </div>
      </li>
    `;
  });
  document.getElementById('recent-episodes').innerHTML = recentEpisodesMarkup ? recentEpisodesMarkup.join('') : '';
  // build recent series list
  const recentSeriesMarkup = recentSeries.map((seriesId) => {
    const series = userData.SERIES[seriesId];
    return `
      <li class="episode">
        <div class="episode-series-title">
          <a class="episode-series-link" href="${series.seriesUrl}" target="_blank" rel="noopener noreferrer">
            ${series.seriesTitle}
          </a>
        </div>
        <a href="#" data-icon-id="favorite" data-series-id="${seriesId}" title="favorite series" class="icon icon-favorite ${series.favorite ? 'icon-favorite-active' : ''}">favorite</a>
        <a href="#" data-icon-id="seelater" data-series-id="${seriesId}" title="see later series" class="icon icon-seelater ${series.seelater ? 'icon-seelater-active' : ''}">seelater</a>
        <a href="#" data-icon-id="completed" data-series-id="${seriesId}" title="completed series" class="icon icon-completed ${series.completed ? 'icon-completed-active' : ''}">completed</a>
        <div class="clear"></div>
      </li>
    `;
  });
  document.getElementById('recent-series').innerHTML = recentSeriesMarkup ? recentSeriesMarkup.join('') : '';
  // build see later list
  const seeLaterMarkup = seelater.map((seriesId) => {
    const series = userData.SERIES[seriesId];
    return `
      <li class="episode episode--small">
        <a class="episode-series-link" href="${series.seriesUrl}" target="_blank" rel="noopener noreferrer">
          <span class="episode-series-title">${series.seriesTitle}</span>
        </a>
      </li>
    `;
  });
  document.getElementById('seelater').innerHTML = seeLaterMarkup ? seeLaterMarkup.join('') : '';
  // activate listeners on icons click
  document.querySelectorAll('.icon').forEach((toggleIcon) => {
    toggleIcon.onclick = (e) => {
      e.preventDefault();
      chrome.runtime.sendMessage({
        action: 'TOGGLE',
        data: {
          id: toggleIcon.getAttribute('data-series-id'),
          attribute: toggleIcon.getAttribute('data-icon-id'),
        },
      });
    };
  });
};

const refreshInfo = () =>
  retrieveInfo()
    .then((data = {}) => {
      Object.assign(userData, data);
      if (data.HISTORY && data.HISTORY.length > 0) {
        document.getElementById('content').removeAttribute('hidden');
      } else {
        document.getElementById('no-content').removeAttribute('hidden');
      }
      return sortUserData(userData);
    })
    .then((sortedUserData) => {
      renderLists(sortedUserData);
    })
    .catch((err) => {
      alert(`[ERROR] ${err}`);
    });

document.addEventListener('DOMContentLoaded', () => {
  refreshInfo();

  document.getElementById('dashboard-link').onclick = (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: 'dashboard.html' });
  };

  chrome.runtime.onMessage.addListener((request) => {
    if (request.action === 'REFRESH') {
      refreshInfo();
    }
  });
});
