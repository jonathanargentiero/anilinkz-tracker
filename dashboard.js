import { userData, retrieveUserData, sortUserData } from './src/userData.js';
import { locale } from './src/utils.js';

const renderLists = (sortedUserData) => {
  const {
    recent,
    seelater,
    favorite,
    completed,
  } = sortedUserData;
  // build recent episodes list
  const recentSeries = [];
  const recentEpisodesMarkup = recent.map((item, i) => {
    if (i > userData.OPTIONS.HISTORY_LENGTH - 1) {
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
  document.getElementById('recent-episodes-list').innerHTML = recentEpisodesMarkup ? recentEpisodesMarkup.join('') : '';
  document.getElementById('recent-count').innerHTML = `(${recentEpisodesMarkup.length})`;
  // build recent series list
  const seriesMarkup = Object.keys(userData.SERIES).map((seriesId) => {
    const series = userData.SERIES[seriesId];
    const date = new Intl.DateTimeFormat(locale, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(series.lastVisit));
    return `
      <tr class="episode">
        <td sorttable_customkey="${seriesId}">
          <a class="episode-series-title episode-series-link" href="${series.seriesUrl}" target="_blank" rel="noopener noreferrer">
            ${series.seriesTitle}
          </a>
        </td>
        <td sorttable_customkey="${new Date(series.lastVisit).getTime()}">
          ${series.episodeTitle ? `
            <a class="episode-series-link" href="${series.episodeUrl}" target="_blank" rel="noopener noreferrer">
              ${series.episodeTitle}
            </a>
            <span class="episode-date">${date}</span>
            ` : ''}
        </td>
        <td sorttable_customkey="${series.favorite ? 1 : 0}">
          <a href="#" data-icon-id="favorite" data-series-id="${seriesId}" title="favorite this series" class="icon icon-favorite ${series.favorite ? 'icon-favorite-active' : ''}">${series.favorite}</a>
        </td>
        <td sorttable_customkey="${series.seelater ? 1 : 0}">
          <a href="#" data-icon-id="seelater" data-series-id="${seriesId}" title="see later this series" class="icon icon-seelater ${series.seelater ? 'icon-seelater-active' : ''}">${series.seelater}</a>
        </td>
        <td sorttable_customkey="${series.completed ? 1 : 0}">
          <a href="#" data-icon-id="completed" data-series-id="${seriesId}" title="completed this series" class="icon icon-completed ${series.completed ? 'icon-completed-active' : ''}">${series.completed}</a>
        </td>
      </tr>
    `;
  });
  const seriesTableMarkup = `<table id="series-table" class="sortable" width="100%">
    <thead>
      <tr align="left">
        <th>
          Name
        </th>
        <th>
          Last viewed
        </th>
        <th>
          Favorite
        </th>
        <th>
          See later
        </th>
        <th>
          Completed
        </th>
      </tr>
    </thead>
    <tbody>
      ${seriesMarkup ? seriesMarkup.join('') : ''}
    </tbody>
  </table>`;
  document.getElementById('series').innerHTML = seriesTableMarkup;
  document.getElementById('series-count').innerHTML = `(${seriesMarkup.length})`;
  // sort with sorttable
  const seriesTable = document.getElementById('series-table');
  window.sorttable.makeSortable(seriesTable);
  const seriesTableHeaders = seriesTable.querySelectorAll('th');
  seriesTableHeaders.forEach((header, i) => {
    header.onclick = () => {
      localStorage.setItem('seriesSortColumn', i);
      localStorage.setItem('seriesSortType', header.className);
    };
  });
  const seriesSortColumnIndex = localStorage.getItem('seriesSortColumn') || 0;
  const seriesSortType = localStorage.getItem('seriesSortType') || '';
  const seriesSortColumn = seriesTableHeaders[seriesSortColumnIndex];
  if (seriesSortType.indexOf('sorttable_sorted_reverse') >= 0) {
    // is sort desc
    // invoke the function twice on the header to simulate the desc sort
    window.sorttable.innerSortFunction.apply(seriesSortColumn, []);
    window.sorttable.innerSortFunction.apply(seriesSortColumn, []);
  } else if (seriesSortType.indexOf('sorttable_sorted') >= 0) {
    // is sort asc
    // invoke the function once on the header to simulate the asc sort
    window.sorttable.innerSortFunction.apply(seriesSortColumn, []);
  } else {
    // fallback
    // asc sort on the first column
    window.sorttable.innerSortFunction.apply(seriesSortColumn, []);
  }
  // build see later list
  const seeLaterMarkup = seelater.map((seriesId) => {
    const series = userData.SERIES[seriesId];
    return `
      <li class="episode">
        <div class="episode-series-title">
          <a class="episode-series-link float--left" href="${series.seriesUrl}" target="_blank" rel="noopener noreferrer">
            ${series.seriesTitle}
          </a>
          <a href="#" data-icon-id="seelater" data-series-id="${seriesId}" title="remove from this list" class="icon icon-cancel">seelater</a>
          <div class="clear"></div>
        </div>
      </li>
    `;
  });
  document.getElementById('seelater-list').innerHTML = seeLaterMarkup ? seeLaterMarkup.join('') : '';
  document.getElementById('seelater-count').innerHTML = `(${seeLaterMarkup.length})`;
  // build see later list
  const favoriteMarkup = favorite.map((seriesId) => {
    const series = userData.SERIES[seriesId];
    return `
      <li class="episode">
        <div class="episode-series-title">
          <a class="episode-series-link float--left" href="${series.seriesUrl}" target="_blank" rel="noopener noreferrer">
            ${series.seriesTitle}
          </a>
          <a href="#" data-icon-id="favorite" data-series-id="${seriesId}" title="remove from this list" class="icon icon-cancel">favorite</a>
          <div class="clear"></div>
        </div>
      </li>
    `;
  });
  document.getElementById('favorite-list').innerHTML = favoriteMarkup ? favoriteMarkup.join('') : '';
  document.getElementById('favorite-count').innerHTML = `(${favoriteMarkup.length})`;
  // build see later list
  const completedMarkup = completed.map((seriesId) => {
    const series = userData.SERIES[seriesId];
    return `
      <li class="episode">
        <div class="episode-series-title">
          <a class="episode-series-link float--left" href="${series.seriesUrl}" target="_blank" rel="noopener noreferrer">
            ${series.seriesTitle}
          </a>
          <a href="#" data-icon-id="completed" data-series-id="${seriesId}" title="remove from this list" class="icon icon-cancel">completed</a>
          <div class="clear"></div>
        </div>
      </li>
    `;
  });
  document.getElementById('completed-list').innerHTML = completedMarkup ? completedMarkup.join('') : '';
  document.getElementById('completed-count').innerHTML = `(${completedMarkup.length})`;
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
  retrieveUserData()
    .then((data = {}) => {
      Object.assign(userData, data);
      return sortUserData(userData);
    })
    .then((sortedUserData) => {
      renderLists(sortedUserData);
    })
    .catch((err) => {
      alert(`[ERROR] ${err}`);
    });

const activateExpandable = () => {
  document.querySelectorAll('.expand').forEach((element) => {
    element.onclick = (e) => {
      e.preventDefault();
      document.querySelector('.expand.active').className = 'expand';
      element.className = 'expand active';
      const targetId = element.getAttribute('href').slice(1);
      document.querySelector('.block.active').className = 'block';
      document.getElementById(targetId).className = 'block active';
    };
  });
};

document.addEventListener('DOMContentLoaded', () => {
  activateExpandable();
  refreshInfo();

  chrome.runtime.onMessage.addListener((request) => {
    if (request.action === 'REFRESH') {
      refreshInfo();
    }
  });
});
